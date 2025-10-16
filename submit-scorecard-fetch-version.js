// submit-scorecard-fetch-version.js
// This version uses native fetch instead of axios to avoid SSL/TLS handshake issues

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
    console.log('Received data:', { email: data.email, score: data.overallScore });
    
    // Your ActiveCampaign configuration
    const AC_API_URL = process.env.AC_API_URL || 'https://legacydna.api-us1.com';
    const AC_API_TOKEN = process.env.AC_API_TOKEN;
    const AC_LIST_ID = process.env.AC_LIST_ID || '17';
    
    if (!AC_API_TOKEN) {
      throw new Error('ActiveCampaign API token not configured');
    }

    // Step 1: Create or update contact
    const contactPayload = {
      contact: {
        email: data.email,
        firstName: data.name || '',
        fieldValues: [
          { field: '11', value: String(data.overallScore) },
          { field: '12', value: String(data.customerClarityScore) },
          { field: '13', value: String(data.messagingStrengthScore) },
          { field: '14', value: String(data.brandPositioningScore) },
          { field: '15', value: String(data.corporateStoryScore) },
          { field: '16', value: String(data.marketPresenceScore) }
        ]
      }
    };

    console.log('Sending contact to ActiveCampaign...');
    
    // Use native fetch instead of axios
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
    console.log('ActiveCampaign response:', responseText);

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
        console.log('Contact already exists, attempting to fetch existing contact...');
        
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
              firstName: data.name || '',
              fieldValues: contactPayload.contact.fieldValues
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
          console.log('Successfully updated existing contact');
        }
      } else {
        throw new Error(`ActiveCampaign error: ${contactResponse.status} - ${responseText}`);
      }
    }

    // Step 2: Add contact to list
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
        console.log('Contact successfully added to list');
      }
    }

    // Step 3: Add tags
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
            console.log(`Tag '${tag}' added to contact`);
          }
        } catch (tagError) {
          console.warn(`Failed to add tag '${tag}':`, tagError.message);
          // Continue with other tags
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Data submitted to ActiveCampaign successfully',
        contactId: contactResult.contact ? contactResult.contact.id : null
      })
    };
    
  } catch (error) {
    console.error('Error in submit-scorecard function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to submit data to ActiveCampaign',
        details: error.message 
      })
    };
  }
};
