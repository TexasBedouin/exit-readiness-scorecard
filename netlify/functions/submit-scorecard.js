const { getStore } = require('@netlify/blobs');

// Fetch with timeout and retry
async function fetchWithRetry(url, options = {}, { timeoutMs = 8000, retries = 2, backoffMs = 1000 } = {}) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, backoffMs * attempt));
    }
  }
}

// ActiveCampaign fetch helper — adds auth header and timeout/retry
async function acFetch(path, options = {}) {
  const url = `${process.env.AC_API_URL}${path}`;
  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Api-Token': process.env.AC_API_TOKEN,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  return response;
}

exports.handler = async (event) => {
  const submissionId = Math.random().toString(36).substring(2, 8);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  const warnings = [];
  const log = (step, status, detail) =>
    console.log(JSON.stringify({ submissionId, step, status, detail }));

  try {
    const { email, overallScore, pdfBase64 } = JSON.parse(event.body);

    log('parse', 'ok', { email, overallScore, hasPDF: !!pdfBase64 });

    if (!email || overallScore === undefined || overallScore === null) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: email, overallScore',
          submissionId,
        }),
      };
    }

    // --- Upload PDF to Netlify Blobs ---
    let pdfUrl = null;

    if (pdfBase64) {
      try {
        log('pdf-upload', 'start', null);

        const store = getStore('scorecard-pdfs');
        const shortId = Math.random().toString(36).substring(2, 8);
        const key = `LegacyDNA-${shortId}.pdf`;
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        await store.set(key, pdfBuffer, { metadata: { contentType: 'application/pdf', email } });

        // The serve-pdf function will serve this file
        pdfUrl = `/.netlify/functions/serve-pdf?id=${encodeURIComponent(key)}`;

        log('pdf-upload', 'ok', { key, pdfUrl });
      } catch (uploadError) {
        log('pdf-upload', 'error', uploadError.message);
        warnings.push('PDF upload failed — report may not be available via link');
      }
    }

    // --- Create/update contact in ActiveCampaign ---
    log('ac-contact', 'start', null);

    const acData = {
      contact: {
        email,
        fieldValues: [
          { field: '20', value: overallScore.toString() },
        ],
      },
    };

    if (pdfUrl) {
      acData.contact.fieldValues.push({ field: '21', value: pdfUrl });
    }

    const acResponse = await acFetch('/api/3/contact/sync', {
      method: 'POST',
      body: JSON.stringify(acData),
    });

    if (!acResponse.ok) {
      const errorText = await acResponse.text().catch(() => 'unknown');
      log('ac-contact', 'error', { status: acResponse.status, body: errorText });
      throw new Error(`Failed to save contact to CRM (status ${acResponse.status})`);
    }

    const acResult = await acResponse.json();
    const contactId = acResult.contact && acResult.contact.id;

    if (!contactId) {
      log('ac-contact', 'error', 'No contact ID in response');
      throw new Error('CRM returned success but no contact ID');
    }

    log('ac-contact', 'ok', { contactId });

    // --- Add contact to list (CRITICAL for email automations) ---
    log('ac-list', 'start', null);

    const listResponse = await acFetch('/api/3/contactLists', {
      method: 'POST',
      body: JSON.stringify({
        contactList: {
          list: process.env.AC_LIST_ID,
          contact: contactId,
          status: 1,
        },
      }),
    });

    if (!listResponse.ok) {
      const listError = await listResponse.text().catch(() => 'unknown');
      log('ac-list', 'error', { status: listResponse.status, body: listError });
      // This is a hard failure — without list membership, no follow-up emails trigger
      throw new Error('Contact saved but could not be added to the email list. Follow-up emails will not be sent.');
    }

    log('ac-list', 'ok', null);

    // --- Add tags ---
    const tags = ['exit-readiness-completed', `score-${overallScore}`];

    for (const tagName of tags) {
      try {
        log('ac-tag', 'start', tagName);

        // Search for existing tag
        const tagSearchResponse = await acFetch(
          `/api/3/tags?search=${encodeURIComponent(tagName)}`
        );

        let tagId = null;

        if (tagSearchResponse.ok) {
          const tagSearchResult = await tagSearchResponse.json();
          if (tagSearchResult.tags && tagSearchResult.tags.length > 0) {
            tagId = tagSearchResult.tags[0].id;
          } else {
            // Create tag
            const createTagResponse = await acFetch('/api/3/tags', {
              method: 'POST',
              body: JSON.stringify({ tag: { tag: tagName, tagType: 'contact' } }),
            });

            if (!createTagResponse.ok) {
              log('ac-tag', 'warn', `Could not create tag "${tagName}"`);
              warnings.push(`Could not create tag "${tagName}"`);
              continue;
            }

            const createTagResult = await createTagResponse.json();
            tagId = createTagResult.tag && createTagResult.tag.id;
          }
        } else {
          log('ac-tag', 'warn', `Tag search failed for "${tagName}"`);
          warnings.push(`Tag search failed for "${tagName}"`);
          continue;
        }

        if (!tagId) {
          warnings.push(`Could not resolve tag ID for "${tagName}"`);
          continue;
        }

        // Apply tag to contact
        const applyResponse = await acFetch('/api/3/contactTags', {
          method: 'POST',
          body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
        });

        if (!applyResponse.ok) {
          log('ac-tag', 'warn', `Could not apply tag "${tagName}" to contact`);
          warnings.push(`Could not apply tag "${tagName}"`);
        } else {
          log('ac-tag', 'ok', tagName);
        }
      } catch (tagError) {
        log('ac-tag', 'warn', { tagName, error: tagError.message });
        warnings.push(`Tag "${tagName}" failed: ${tagError.message}`);
      }
    }

    log('complete', 'ok', { warnings: warnings.length });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Scorecard submitted successfully',
        contactId,
        pdfUrl,
        warnings,
        submissionId,
      }),
    };
  } catch (error) {
    log('fatal', 'error', error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        warnings,
        submissionId,
      }),
    };
  }
};
