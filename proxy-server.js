// Simple proxy server to bypass CORS issues with the Gemini API
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Main proxy endpoint
app.post('/gemini-proxy', async (req, res) => {
  try {
    const { endpoint, apiKey, payload } = req.body;
    
    if (!endpoint || !apiKey || !payload) {
      return res.status(400).json({ 
        error: "Missing required parameters: endpoint, apiKey, or payload" 
      });
    }

    // Construct the Google Generative AI API URL
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${endpoint}?key=${apiKey}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Forward the request to the Google Generative AI API
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Return the response from the Google Generative AI API
    return res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // If the error has a response, forward it
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    
    // Otherwise, return a generic error
    return res.status(500).json({ 
      error: error.message || "An error occurred while proxying the request" 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`Use http://localhost:${PORT}/gemini-proxy for API requests`);
});
