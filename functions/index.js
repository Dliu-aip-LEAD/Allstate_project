const { onCall } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

// Define secret (secure storage of API key)
const openaiApiKey = defineSecret('OPENAI_API_KEY');

// Create chat function
exports.chatWithOpenAI = onCall(
  {
    secrets: [openaiApiKey],
    timeoutSeconds: 60,
    memory: '256MiB'
  },
  async (request) => {
    try {
      const data = request.data;
      console.log('Received request:', {
        messageCount: data.messages?.length,
        hasImageUrl: !!data.imageUrl
      });

      // Validate input
      if (!data.messages || !Array.isArray(data.messages)) {
        throw new Error('Messages must be an array');
      }

      // Get API key
      const apiKey = openaiApiKey.value();
      
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: data.model || 'gpt-4o',
          messages: data.messages,
          max_tokens: data.max_tokens || 1000,
          temperature: data.temperature || 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('OpenAI response received successfully');

      // Return result
      return {
        reply: result.choices[0].message.content,
        usage: result.usage
      };

    } catch (error) {
      console.error('Error in chatWithOpenAI:', error);
      throw error;
    }
  });
