const GEMINI_API_KEY = 'AIzaSyAklMRnjQG0CxAc9aRfDgmDR5xi4BF1Npk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export const generateSuggestions = async (extractedText: string): Promise<string> => {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Based on this medical prescription/document, provide:

1. **Medicine Schedule**: Clear timing and dosage instructions for each medicine
2. **7-Day Diet Plan**: Detailed daily meal suggestions that complement the treatment
3. **General Health Tips**: Lifestyle recommendations for faster recovery
4. **Precautions**: Important things to avoid or be careful about

Medical Document Text:
${extractedText}

Please provide practical, safe, and general advice. Always recommend consulting with healthcare professionals for personalized medical guidance.

Format the response in a clear, organized manner with proper headings and bullet points.`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1500,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Suggestions API request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};