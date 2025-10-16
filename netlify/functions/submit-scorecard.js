const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const busboy = require('busboy');

exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    const { fields, files } = await parseMultipartForm(event);

    console.log('Received fields:', Object.keys(fields));
    console.log('Received files:', Object.keys(files));

    // Extract form data
    const email = fields.email;
    const overallScore = parseInt(fields.overallScore);
    
    // Parse domainScores - handle case where it might not exist
    let domainScores = [];
    if (fields.domainScores) {
      try {
        domainScores = JSON.parse(fields.domainScores);
      } catch (parseError) {
        console.error('Error parsing domainScores:', parseError);
        domainScores = [];
      }
    }

    const pdfFile = files.pdf;

    if (!email || !overallScore || !pdfFile) {
      console.error('Missing required fields:', { email, overallScore, hasPdf: !!pdfFile });
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          received: { email: !!email, overallScore: !!overallScore, pdf: !!pdfFile }
        })
      };
    }

    console.log('Processing scorecard for:', email, 'Score:', overallScore);

    // Upload PDF to Cloudflare R2
    const pdfUrl = await uploadToR2(pdfFile, email);
    console.log('PDF uploaded to:', pdfUrl);

    // Submit to ActiveCampaign
    const acResult = await submitToActiveCampaign(email, overallScore, domainScores, pdfUrl);
    console.log('ActiveCampaign result:', acResult);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Scorecard submitted successfully',
        pdfUrl,
        activeCampaign: acResult
      })
    };

  } catch (error) {
    console.error('Error in submit-scorecard function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      })
    };
  }
};

// Parse multipart/form-data
function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    const fields = {};
    const files = {};

    const bb = busboy({
      headers: {
        'content-type': event.headers['content-type'] || event.headers['Content-Type']
      }
    });

    bb.on('file', (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks = [];

      file.on('data', (data) => {
        chunks.push(data);
      });

      file.on('end', () => {
        files[fieldname] = {
          filename,
          encoding,
          mimeType,
          data: Buffer.concat(chunks)
        };
      });
    });

    bb.on('field', (fieldname, value) => {
      fields[fieldname] = value;
    });

    bb.on('finish', () => {
      resolve({ fields, files });
    });

    bb.on('error', (error) => {
      reject(error);
    });

    // Decode base64 body if it's base64 encoded
    const body = event.isBase64Encoded 
      ? Buffer.from(event.body, 'base64')
      : event.body;

    bb.write(body);
    bb.end();
  });
}

// Upload PDF to Cloudflare R2
async function uploadToR2(pdfFile, email) {
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  const timestamp = Date.now();
  const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '-');
  const key = `exit-readiness-${sanitizedEmail}-${timestamp}.pdf`;

  const command = new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
    Body: pdfFile.data,
    ContentType: 'application/pdf',
  });

  await s3Client.send(command);

  // Return the public URL
  return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}

// Submit to ActiveCampaign
async function submitToActiveCampaign(email, overallScore, domainScores, pdfUrl) {
  const AC_API_KEY = process.env.ACTIVECAMPAIGN_API_KEY;
  const AC_API_URL = process.env.ACTIVECAMPAIGN_API_URL;
  const AC_LIST_ID = process.env.ACTIVECAMPAIGN_LIST_ID;

  console.log('Submitting to ActiveCampaign:', { email, overallScore, pdfUrl });

  // Step 1: Create or update contact
  const contactPayload = {
    contact: {
      email: email,
      fieldValues: [
        {
          field: '20', // Overall Score field
          value: overallScore.toString()
        },
        {
          field: '21', // PDF URL field
          value: pdfUrl
        }
      ]
    }
  };

  const contactResponse = await fetch(`${AC_API_URL}/api/3/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': AC_API_KEY
    },
    body: JSON.stringify(contactPayload)
  });

  if (!contactResponse.ok) {
    const errorText = await contactResponse.text();
    throw new Error(`ActiveCampaign contact creation failed: ${errorText}`);
  }

  const contactData = await contactResponse.json();
  const contactId = contactData.contact.id;

  console.log('Contact created/updated:', contactId);

  // Step 2: Add contact to list
  const listPayload = {
    contactList: {
      list: AC_LIST_ID,
      contact: contactId,
      status: 1 // 1 = subscribed
    }
  };

  const listResponse = await fetch(`${AC_API_URL}/api/3/contactLists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': AC_API_KEY
    },
    body: JSON.stringify(listPayload)
  });

  if (!listResponse.ok) {
    const errorText = await listResponse.text();
    console.error('List subscription failed (may already exist):', errorText);
    // Don't throw - contact might already be on list
  } else {
    console.log('Contact added to list');
  }

  // Step 3: Add tag to trigger automation
  const tagPayload = {
    contactTag: {
      contact: contactId,
      tag: 'exit-readiness-scorecard' // This tag must exist in ActiveCampaign
    }
  };

  const tagResponse = await fetch(`${AC_API_URL}/api/3/contactTags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Token': AC_API_KEY
    },
    body: JSON.stringify(tagPayload)
  });

  if (!tagResponse.ok) {
    const errorText = await tagResponse.text();
    throw new Error(`ActiveCampaign tag application failed: ${errorText}`);
  }

  console.log('Tag applied successfully');

  return {
    contactId,
    listAdded: listResponse.ok,
    tagApplied: true
  };
}
