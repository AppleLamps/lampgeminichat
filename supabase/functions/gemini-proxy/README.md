# Gemini API Proxy Edge Function

This Edge Function serves as a proxy for Google's Generative AI API (Gemini), helping to bypass CORS issues when calling the API from a browser.

## Deployment Instructions

1. Log in to your Supabase dashboard: https://app.supabase.com/
2. Navigate to your project
3. Go to "Edge Functions" in the left sidebar
4. Click "Create a new function"
5. Name the function "gemini-proxy"
6. Upload the `index.ts` file from this directory
7. Deploy the function

## Usage

Once deployed, you can use the Edge Function by making a POST request to:

```
https://[YOUR-PROJECT-ID].supabase.co/functions/v1/gemini-proxy
```

With a JSON body in the following format:

```json
{
  "endpoint": "gemini-2.5-flash-preview-04-17:generateContent",
  "apiKey": "YOUR_GEMINI_API_KEY",
  "payload": {
    // Your Gemini API request payload
  }
}
```

The Edge Function will forward your request to the Gemini API and return the response.

## Security Considerations

- This Edge Function does not store your API key, but it does transmit it to the Gemini API
- Consider implementing additional security measures like JWT authentication for the Edge Function
- In a production environment, you might want to store the API key as a secret in Supabase and retrieve it in the Edge Function
