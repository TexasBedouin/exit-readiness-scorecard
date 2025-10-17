// submit-scorecard.js - UPDATED VERSION
// Now uploads PDF to Cloudflare R2 and sends R2 URL to ActiveCampaign (not website URL)

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// ============================================
// R2 UPLOAD FUNCTION
// ============================================
async function uploadPDFToR2(pdfBase64, email) {
  const {
    CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_BUCKET_NAME,
    CLOUDFLARE_R2_PUBLIC_URL
  } = process.env;

  // Validate R2 configuration
  if (!CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY || !CLOUDFLARE_R2_BUCKET_NAME) {
    throw new Error('Missing R2 configuration in environment variables');
  }

  // Convert base64 to buffer
  const pdfBuffer = Buffer.from(pdfBase64, 'base64');

  // Generate filename: exit-readiness-reports/email_timestamp.pdf
  const timestamp = Date.now();
  const sanitizedEmail = email.replace(/[^a-z0-9]/gi, '_');
  const fileName = `exit-readiness-reports/${sanitizedEmail}_${timestamp}.pdf`;

  // Create S3 client configured for Cloudflare R2
  const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET_NAME,
    Key: fileName,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
    CacheControl: 'public, max-age=31536000', // Cache for 1 year
  });

  await s3Client.send(command);

  // Construct and return public URL
  const publicUrl = CLOUDFLARE_R2_PUBLIC_URL || `https://pub-${CLOUDFLARE_ACCOUNT_ID}.r2.dev`;
  const pdfUrl = `${publicUrl}/${fileName}`;
  
  console.log('✅ PDF uploaded to R2:', pdfUrl);
  return pdfUrl;
}

// ============================================
// MAIN HANDLER
// ============================================
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    console.log('📨 Received submission:', { 
      email: data.email, 
      overallScore: data.overallScore,
      hasPDF: !!data.pdfBase64
    });
    
    // ActiveCampaign configuration
    const AC_API_URL = process.env.AC_API_URL || 'https://legacy-dna33050.api-us1.com';
    const AC_API_TOKEN = process.env.AC_API_TOKEN;
    const AC_LIST_ID = process.env.AC_LIST_ID || '13';
    
    if (!AC_API_TOKEN) {
      throw new Error('ActiveCampaign API token not configured');
    }

    // Step 1: Upload PDF to R2 (if provided)
    let pdfUrl = null;
    if (data.pdfBase64) {
      console.log('📄 Uploading PDF to R2...');
      pdfUrl = await uploadPDFToR2(data.pdfBase64, data.email);
    } else {
      console.warn('⚠️ No PDF provided, field 21 will not be populated');
    }

    // Build field values array
    const fieldValues = [
      { field: '20', value: String(data.overallScore) }  // Overall Score
    ];

    // Add PDF URL to field 21 (not survey URL!)
    if (pdfUrl) {
      fieldValues.push({
        field: '21',  // PDF Report URL - now contains ACTUAL PDF URL from R2!
        value: String(pdfUrl)
      });
      console.log('✅ Field 21 will be set to R2 PDF URL:', pdfUrl);
    }

    // Step 2: Create or update contact in ActiveCampaign
    const contactPayload = {
      contact: {
        email: data.email,
        fieldValues: fieldValues
      }
    };

    console.log('📬 Sending contact to ActiveCampaign...');
    
    const contactResponse = await fetch(`${AC_API_URL}/api/3/contacts`, {
      method: 'POST',
      headers: {
        'Api-Token': AC_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactPayload)
    });

    const responseText = await contactResponse.text();
    console.log('ActiveCampaign response status:', contactResponse.status);

    let contactResult;
    try {
      contactResult = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse ActiveCampaign response:', responseText);
      throw new Error('Invalid response from ActiveCampaign');
    }

    if (!contactResponse.ok) {
      // Check if it's a duplicate contact error
      if (contactResponse.status === 422 && responseText.includes('duplicate')) {
        console.log('Contact already exists, attempting to update...');
        
        // Fetch existing contact
        const searchResponse = await fetch(
          `${AC_API_URL}/api/3/contacts?email=${encodeURIComponent(data.email)}`,
          {
            method: 'GET',
            headers: {
              'Api-Token': AC_API_TOKEN,
            }
          }
        );

        const searchResult = await searchResponse.json();
        
        if (searchResult.contacts && searchResult.contacts.length > 0) {
          const contactId = searchResult.contacts[0].id;
          
          // Update existing contact
          const updatePayload = {
            contact: {
              email: data.email,
              fieldValues: fieldValues
            }
          };

          const updateResponse = await fetch(
            `${AC_API_URL}/api/3/contacts/${contactId}`,
            {
              method: 'PUT',
              headers: {
                'Api-Token': AC_API_TOKEN,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatePayload)
            }
          );

          if (!updateResponse.ok) {
            const updateError = await updateResponse.text();
            console.error('Failed to update contact:', updateError);
            throw new Error('Failed to update existing contact');
          }

          contactResult = await updateResponse.json();
          console.log('✅ Successfully updated existing contact');
        }
      } else {
        throw new Error(`ActiveCampaign error: ${contactResponse.status} - ${responseText}`);
      }
    }

    // Step 3: Add contact to list
    if (contactResult.contact && contactResult.contact.id) {
      const contactId = contactResult.contact.id;
      
      const listPayload = {
        contactList: {
          list: AC_LIST_ID,
          contact: String(contactId),
          status: '1' // 1 = subscribed
        }
      };

      const listResponse = await fetch(
        `${AC_API_URL}/api/3/contactLists`,
        {
          method: 'POST',
          headers: {
            'Api-Token': AC_API_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(listPayload)
        }
      );

      if (!listResponse.ok) {
        const listError = await listResponse.text();
        console.warn('Failed to add contact to list:', listError);
        // Don't throw error here - contact was still created
      } else {
        console.log('✅ Contact added to list');
      }
    }

    // Step 4: Add tags
    if (contactResult.contact && contactResult.contact.id) {
      const contactId = contactResult.contact.id;
      const tags = ['exit-readiness-completed', `score-${Math.round(data.overallScore)}`];
      
      for (const tag of tags) {
        try {
          // First, get or create the tag
          let tagId;
          const tagSearchResponse = await fetch(
            `${AC_API_URL}/api/3/tags?search=${encodeURIComponent(tag)}`,
            {
              method: 'GET',
              headers: {
                'Api-Token': AC_API_TOKEN,
              }
            }
          );

          const tagSearchResult = await tagSearchResponse.json();
          
          if (tagSearchResult.tags && tagSearchResult.tags.length > 0) {
            tagId = tagSearchResult.tags[0].id;
          } else {
            // Create new tag
            const createTagResponse = await fetch(
              `${AC_API_URL}/api/3/tags`,
              {
                method: 'POST',
                headers: {
                  'Api-Token': AC_API_TOKEN,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  tag: {
                    tag: tag,
                    tagType: 'contact'
                  }
                })
              }
            );

            if (createTagResponse.ok) {
              const createTagResult = await createTagResponse.json();
              tagId = createTagResult.tag.id;
            }
          }

          // Add tag to contact
          if (tagId) {
            await fetch(
              `${AC_API_URL}/api/3/contactTags`,
              {
                method: 'POST',
                headers: {
                  'Api-Token': AC_API_TOKEN,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  contactTag: {
                    contact: String(contactId),
                    tag: String(tagId)
                  }
                })
              }
            );
            console.log(`✅ Tag '${tag}' added to contact`);
          }
        } catch (tagError) {
          console.warn(`⚠️ Failed to add tag '${tag}':`, tagError.message);
          // Continue with other tags
        }
      }
    }

    console.log('🎉 SUCCESS! All steps completed.');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'PDF uploaded and data submitted to ActiveCampaign successfully',
        contactId: contactResult.contact ? contactResult.contact.id : null,
        pdfUrl: pdfUrl  // Return the PDF URL so frontend knows where it is
      })
    };
    
  } catch (error) {
    console.error('❌ ERROR in submit-scorecard function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to submit data',
        details: error.message 
      })
    };
  }
};
