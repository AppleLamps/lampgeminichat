// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/runtime/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// This is the main function that handles all requests to the Edge Function
serve(async (req) => {
  try {
    // CORS headers to allow requests from your frontend
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // In production, replace with your specific domain
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    };

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    // Parse the request body
    const requestData = await req.json();
    
    // Extract the necessary information from the request
    const { endpoint, apiKey, payload } = requestData;
    
    if (!endpoint || !apiKey || !payload) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: endpoint, apiKey, or payload" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Construct the Google Generative AI API URL
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${endpoint}?key=${apiKey}`;

    // Forward the request to the Google Generative AI API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Get the response data
    const responseData = await response.json();

    // Return the response from the Google Generative AI API
    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Handle any errors
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
});
