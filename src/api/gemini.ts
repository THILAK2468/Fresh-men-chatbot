const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function queryGemini(question: string, context: string[], userEmail?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  if (GEMINI_API_KEY === 'your_gemini_api_key') {
    throw new Error('Please replace the placeholder API key with a valid Gemini API key in your .env file.');
  }

  const username = userEmail ? userEmail.split('@')[0] : 'user';
  
  const prompt = `You're a helpful assistant for company HR policies.

The user asked: "${question}"

Here is a related document content:
---
${context.join('\n\n')}
---

Please extract the most relevant answer. Mention where this info is found (e.g., section title or line number). Respond formally with user tag @${username}.

Format your response like this example:
@${username} [Direct answer to the question]. [Additional relevant details if needed].
Found in: [Document name/section] – [Location reference]
📄 View Document`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', response.status, errorText);
      
      if (response.status === 403) {
        throw new Error(`API access denied. The API key may be invalid, expired, or doesn't have access to the Generative Language API. Please check your API key configuration.`);
      }
      
      if (response.status === 400) {
        throw new Error(`Invalid request format. Please check the API request structure.`);
      }
      
      if (response.status === 429) {
        throw new Error(`Rate limit exceeded. Please wait a moment before trying again.`);
      }
      
      throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from Gemini API');
    }
    
    const responseText = data.candidates[0]?.content?.parts[0]?.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }
    
    return responseText;
  } catch (error) {
    console.error('Error querying Gemini API:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Unknown error occurred while querying Gemini API');
  }
}