// server.js

// Load environment variables from the .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000; // You can choose any available port

// Middleware setup
app.use(cors()); // Allows requests from your frontend
app.use(express.json()); // Allows the server to understand JSON from the request body

// Define the proxy endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not found.' });
    }

    // The prompt and other data sent from your frontend
    const clientPayload = req.body; 

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    const googleResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Pass the payload from your client directly to the Google API
      body: JSON.stringify(clientPayload), 
    });

    if (!googleResponse.ok) {
        const errorData = await googleResponse.json();
        throw new Error(`Google API responded with status ${googleResponse.status}: ${errorData.error.message}`);
    }

    const data = await googleResponse.json();
    res.json(data); // Send Google's response back to your frontend

  } catch (error) {
    console.error("Error in proxy server:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});