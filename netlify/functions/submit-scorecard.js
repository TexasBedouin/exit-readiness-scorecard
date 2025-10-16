/**
 * Netlify Function: Submit Scorecard
 * 
 * This function:
 * 1. Receives PDF blob and user data from frontend
 * 2. Uploads PDF to Cloudflare R2
 * 3. Sends contact data to ActiveCampaign with scores and PDF link
 * 4. Returns success/error response
 */

const fetch = require('node-fetch');

// Environment variables needed (set in Netlify dashboard):
// - CLOUDFLARE_ACCOUNT_ID
// - CLOUDFLARE_R2_ACCESS_KEY_ID
// - CLOUDFLARE_R2_SECRET_ACCESS_KEY
// - CLOUDFLARE_R2_BUCKET_NAME
// - CLOUDFLARE_R2_PUBLIC_URL (e.g., https://pub-xxxxx.r2.dev)
// - ACTIVECAMPAIGN_API_KEY
// - ACTIVECAMPAIGN_API_URL
// - ACTIVECAMPAIGN_LIST_ID

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    const boundary = event.headers['content-type'].split('boundary=')[1];
    const parts = parseMultipartForm(event.body, boundary);

    const pdfBlob = parts.pdf;
    const email = parts.email;
    const overallScore = parseInt(parts.overallScore);
    const domainScores = JSON.parse(parts.domainScores);

    // Validate required fields
    if (!pdfBlob || !email || !overallScore || !domainScores) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `exit-readiness-${sanitizedEmail}-${timestamp}.pdf`;

    // Step 1: Upload PDF to Cloudflare R2
    const pdfUrl = await uploadToR2(pdfBlob, filename);

    // Step 2: Send to ActiveCampaign
    await sendToActiveCampaign({
      email,
      overallScore,
      domainScores,
      pdfUrl
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Scorecard submitted successfully',
        pdfUrl
      })
    };

  } catch (error) {
    console.error('Error in submit-scorecard function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to submit scorecard',
        details: error.message
      })
    };
  }
};

/**
 * Upload PDF to Cloudflare R2
 */
async function uploadToR2(pdfBuffer, filename) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;

  // Using AWS S3 SDK compatible API for R2
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey
    }
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    Body: pdfBuffer,
    ContentType: 'application/pdf'
  });

  await s3Client.send(command);

  // Return public URL
  return `${publicUrl}/${filename}`;
}

/**
 * Send contact and scores to ActiveCampaign
 */
async function sendToActiveCampaign({ email, overallScore, domainScores, pdfUrl }) {
  const apiKey = process.env.ACTIVECAMPAIGN_API_KEY;
  const apiUrl = process.env.ACTIVECAMPAIGN_API_URL;
  const listId = process.env.ACTIVECAMPAIGN_LIST_ID;

  // Step 1: Create or update contact
  const contactPayload = {
    contact: {
      email: email,
      fieldValues: [
        { field: '20', value: overallScore.toString() },  // Overall Score (Field ID 20)
        { field: '21', value: pdfUrl }                    // PDF Report URL (Field ID 21)
      ]
    }
  };

  const contactResponse = await fetch(`${apiUrl}/api/3/contact/sync`, {
    method: 'POST',
    headers: {
      'Api-Token': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactPayload)
  });

  if (!contactResponse.ok) {
    const errorText = await contactResponse.text();
    throw new Error(`ActiveCampaign contact sync failed: ${errorText}`);
  }

  const contactData = await contactResponse.json();
  const contactId = contactData.contact.id;

  // Step 2: Add contact to list
  const contactListPayload = {
    contactList: {
      list: listId,
      contact: contactId,
      status: 1 // 1 = active, 2 = unsubscribed
    }
  };

  const listResponse = await fetch(`${apiUrl}/api/3/contactLists`, {
    method: 'POST',
    headers: {
      'Api-Token': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactListPayload)
  });

  if (!listResponse.ok) {
    const errorText = await listResponse.text();
    console.error(`Warning: Could not add to list: ${errorText}`);
    // Don't throw - contact was created successfully
  }

  // Step 3: Add tag "exit-readiness-scorecard"
  const tagPayload = {
    contactTag: {
      contact: contactId,
      tag: 'exit-readiness-scorecard'
    }
  };

  const tagResponse = await fetch(`${apiUrl}/api/3/contactTags`, {
    method: 'POST',
    headers: {
      'Api-Token': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tagPayload)
  });

  if (!tagResponse.ok) {
    const errorText = await tagResponse.text();
    console.error(`Warning: Could not add tag: ${errorText}`);
    // Don't throw - contact was created successfully
  }

  return contactId;
}

/**
 * Simple multipart form parser
 * (In production, consider using a library like 'busboy' or 'formidable')
 */
function parseMultipartForm(body, boundary) {
  const parts = {};
  const sections = body.split(`--${boundary}`);

  for (const section of sections) {
    if (section.includes('Content-Disposition')) {
      const nameMatch = section.match(/name="([^"]+)"/);
      if (nameMatch) {
        const name = nameMatch[1];
        const contentStart = section.indexOf('\r\n\r\n') + 4;
        const contentEnd = section.lastIndexOf('\r\n');
        let content = section.substring(contentStart, contentEnd);

        // If it's the PDF, keep as buffer
        if (name === 'pdf') {
          // Extract binary data (this is a simplified version)
          // In production, you'd want to use a proper multipart parser
          parts[name] = Buffer.from(content, 'binary');
        } else {
          parts[name] = content;
        }
      }
    }
  }

  return parts;
}
