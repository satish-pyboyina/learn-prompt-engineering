// netlify/functions/generate.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function (event, context) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  // Parse JSON body safely
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  if (!body || !body.prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing prompt in request body' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  // Gemini API call
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gemini API key not set in environment' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents: [
      { role: 'user', parts: [{ text: body.prompt }] }
    ]
  };

  try {
    const apiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await apiRes.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from Gemini API', details: err.message }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};