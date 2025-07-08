// netlify/functions/generate.js

exports.handler = async function (event, context) {
    try {
      // Netlify automatically provides environment variables here
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'API key not found.' }),
        };
      }
  
      // Get the request body sent from the frontend
      const { model, payload } = JSON.parse(event.body);
  
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
      const googleResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!googleResponse.ok) {
        const errorText = await googleResponse.text();
        throw new Error(`Google API Error: ${errorText}`);
      }
  
      const data = await googleResponse.json();
  
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
  
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  };