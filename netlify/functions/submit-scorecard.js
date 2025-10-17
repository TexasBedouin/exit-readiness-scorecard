const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the request body
    const { email, overallScore, pdfBase64 } = JSON.parse(event.body);

    console.log('📨 Received submission:', {
      email,
      overallScore,
      hasPDF: !!pdfBase64,
    });

    // Validate required fields
    if (!email || !overallScore) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: email, overallScore',
        }),
      };
    }

    let pdfUrl = null;

    // Upload PDF to R2 if provided
    if (pdfBase64) {
      try {
        console.log('📄 Uploading PDF to R2...');

        // Configure R2 client (R2 is S3-compatible)
        const r2Client = new S3Client({
          region: 'auto',
          endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
          },
        });

        // Create a unique filename
        const timestamp = Date.now();
        const sanitizedEmail = email.replace(/[@.]/g, '_');
        const fileName = `${sanitizedEmail}_${timestamp}.pdf`;
        const key = `exit-readiness-reports/${fileName}`;

        // Convert base64 to Buffer
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        // Upload to R2
        const uploadCommand = new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: key,
          Body: pdfBuffer,
          ContentType: 'application/pdf',
        });

        await r2Client.send(uploadCommand);

        // ✅ FIX: Properly construct the public URL without double slashes
        const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
        // Remove trailing slash from public URL if it exists
        const baseUrl = publicUrl.endsWith('/') ? publicUrl.slice(0, -1) : publicUrl;
        // Ensure key starts with a slash
        const normalizedKey = key.startsWith('/') ? key : `/${key}`;
        // Construct the final URL
        pdfUrl = `${baseUrl}${normalizedKey}`;

        console.log('✅ PDF uploaded to R2:', pdfUrl);
      } catch (uploadError) {
        console.error('❌ R2 upload failed:', uploadError);
        // Continue anyway - don't fail the whole request
        pdfUrl = null;
      }
    }

    // Prepare ActiveCampaign data
    const acData = {
      contact: {
        email: email,
        fieldValues: [
          {
            field: '20', // Overall Score field
            value: overallScore.toString(),
          },
        ],
      },
    };

    // Add PDF URL to field 21 if we have it
    if (pdfUrl) {
      console.log('✅ Field 21 will be set to R2 PDF URL:', pdfUrl);
      acData.contact.fieldValues.push({
        field: '21', // PDF Report URL field
        value: pdfUrl,
      });
    } else {
      console.log('⚠️ No PDF URL to set in field 21');
    }

    // Send to ActiveCampaign
    console.log('📬 Sending contact to ActiveCampaign...');
    const acResponse = await fetch(
      `${process.env.AC_API_URL}/api/3/contact/sync`,
      {
        method: 'POST',
        headers: {
          'Api-Token': process.env.AC_API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(acData),
      }
    );

    console.log('ActiveCampaign response status:', acResponse.status);

    if (!acResponse.ok) {
      const errorText = await acResponse.text();
      console.error('ActiveCampaign error:', errorText);
      throw new Error(`ActiveCampaign API failed: ${acResponse.status}`);
    }

    const acResult = await acResponse.json();
    const contactId = acResult.contact.id;

    // Add contact to list
    const listData = {
      contactList: {
        list: process.env.AC_LIST_ID,
        contact: contactId,
        status: 1,
      },
    };

    const listResponse = await fetch(
      `${process.env.AC_API_URL}/api/3/contactLists`,
      {
        method: 'POST',
        headers: {
          'Api-Token': process.env.AC_API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listData),
      }
    );

    if (listResponse.ok) {
      console.log('✅ Contact added to list');
    } else {
      console.error('⚠️ Failed to add contact to list');
    }

    // Add tags
    const tags = ['exit-readiness-completed', `score-${overallScore}`];

    for (const tagName of tags) {
      try {
        // First, get or create the tag
        const tagSearchResponse = await fetch(
          `${process.env.AC_API_URL}/api/3/tags?search=${encodeURIComponent(tagName)}`,
          {
            headers: {
              'Api-Token': process.env.AC_API_TOKEN,
            },
          }
        );

        let tagId;
        if (tagSearchResponse.ok) {
          const tagSearchResult = await tagSearchResponse.json();
          if (tagSearchResult.tags && tagSearchResult.tags.length > 0) {
            tagId = tagSearchResult.tags[0].id;
          } else {
            // Create tag if it doesn't exist
            const createTagResponse = await fetch(
              `${process.env.AC_API_URL}/api/3/tags`,
              {
                method: 'POST',
                headers: {
                  'Api-Token': process.env.AC_API_TOKEN,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  tag: {
                    tag: tagName,
                    tagType: 'contact',
                  },
                }),
              }
            );
            const createTagResult = await createTagResponse.json();
            tagId = createTagResult.tag.id;
          }
        }

        // Apply tag to contact
        if (tagId) {
          await fetch(`${process.env.AC_API_URL}/api/3/contactTags`, {
            method: 'POST',
            headers: {
              'Api-Token': process.env.AC_API_TOKEN,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contactTag: {
                contact: contactId,
                tag: tagId,
              },
            }),
          });
          console.log(`✅ Tag '${tagName}' added to contact`);
        }
      } catch (tagError) {
        console.error(`⚠️ Failed to add tag '${tagName}':`, tagError);
      }
    }

    console.log('🎉 SUCCESS! All steps completed.');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Scorecard submitted successfully',
        contactId: contactId,
        pdfUrl: pdfUrl,
      }),
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
    };
  }
};
