
import { EXAMPLES } from '../data/healthData';

const GEMINI_API_KEY = 'AIzaSyByhHISApDurGWD4SkTJbWQokrOalNwDgc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Language detection helper
function detectLanguage(text: string): 'english' | 'hindi' | 'tamil' {
  // Check for Tamil characters
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'tamil';
  }
  // Check for Hindi/Devanagari characters
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hindi';
  }
  // Default to English
  return 'english';
}

// Enhanced similarity function to find matching questions
function findSimilarExample(question: string, language: 'english' | 'hindi' | 'tamil') {
  const lowerQuestion = question.toLowerCase().trim();
  
  console.log(`Looking for similar question in ${language} for: "${lowerQuestion}"`);
  
  // First try exact match (case-insensitive)
  const exactMatch = EXAMPLES.find(example => 
    example.language === language && 
    example.q.toLowerCase().trim() === lowerQuestion
  );
  
  if (exactMatch) {
    console.log('Found exact match:', exactMatch.q);
    return exactMatch;
  }
  
  // Then try partial matching with key phrases
  const partialMatch = EXAMPLES.find(example => {
    if (example.language !== language) return false;
    
    const exampleLower = example.q.toLowerCase();
    const questionLower = lowerQuestion;
    
    // Check for key phrase matches
    const keyPhrases = [
      'hemoglobin', 'हीमोग्लोबिन', 'ஹீமோகுளோபின்',
      'paracetamol', 'पैरासिटामोल', 'பைராசிட்டமால்',
      'dehydration', 'पानी की कमी', 'நீர்ச்சத்து',
      'dizzy', 'चक्कर', 'தலைச்சுற்றல்',
      'heart attack', 'दिल का दौरा', 'மாரடைப்பு',
      'pregnancy', 'गर्भावस्था', 'கர்ப்பம்',
      'fever', 'बुखार', 'காய்ச்சல்'
    ];
    
    // Check if question and example share any key phrases
    const questionHasPhrase = keyPhrases.some(phrase => questionLower.includes(phrase.toLowerCase()));
    const exampleHasPhrase = keyPhrases.some(phrase => exampleLower.includes(phrase.toLowerCase()));
    
    if (questionHasPhrase && exampleHasPhrase) {
      // Further verify they share the same key phrase
      const sharedPhrase = keyPhrases.find(phrase => 
        questionLower.includes(phrase.toLowerCase()) && exampleLower.includes(phrase.toLowerCase())
      );
      if (sharedPhrase) {
        console.log(`Found partial match with shared phrase "${sharedPhrase}":`, example.q);
        return true;
      }
    }
    
    return false;
  });
  
  if (partialMatch) {
    return partialMatch;
  }
  
  console.log('No similar example found in knowledge base');
  return null;
}

export async function generateGeminiResponse(message: string): Promise<string> {
  const detectedLanguage = detectLanguage(message);
  console.log(`Detected language: ${detectedLanguage}`);
  
  // First, check if we have a similar example in our knowledge base
  const similarExample = findSimilarExample(message, detectedLanguage);
  
  if (similarExample) {
    console.log('Using knowledge base answer for:', similarExample.q);
    return similarExample.a;
  }

  console.log('No knowledge base match found, using Gemini API');

  const languageInstructions = {
    english: 'Respond in English only. Use empathetic, caring tone with practical advice.',
    hindi: 'केवल हिंदी में जवाब दें। सहानुभूति और देखभाल के साथ व्यावहारिक सलाह दें।',
    tamil: 'தமிழில் மட்டுமே பதிலளிக்கவும். அனுதாபத்துடன் மற்றும் கவனிப்புடன் நடைமுறை ஆலோசனைகளை வழங்கவும்।'
  };

  // Use examples as context for better responses
  const relevantExamples = EXAMPLES
    .filter(example => example.language === detectedLanguage)
    .slice(0, 3)
    .map(example => `Q: ${example.q}\nA: ${example.a}`)
    .join('\n\n---\n\n');

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a multilingual health AI assistant. ${languageInstructions[detectedLanguage]}

Follow these examples for tone and format:

${relevantExamples}

Guidelines:
- Respond in the SAME language as the user's question
- Use empathetic, caring tone like the examples above
- For nutrition: Suggest specific foods and include emojis/symbols
- For medicine: Provide general info but emphasize consulting doctors
- For emergencies: Give immediate advice while urging medical care
- Always include appropriate disclaimers
- Keep responses helpful but concise (under 300 words)

User question: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
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
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback responses in the detected language
    const fallbackResponses = {
      english: "I understand you have a health question. While I'd like to help, I recommend consulting with a qualified healthcare professional who can provide personalized advice based on your specific situation.\n\n🩺 *Remember: This is educational information only. Please consult a healthcare professional.*",
      hindi: "मैं समझता हूं कि आपका एक स्वास्थ्य प्रश्न है। जबकि मैं मदद करना चाहूंगा, मैं एक योग्य स्वास्थ्य पेशेवर से सलाह लेने की सिफारिश करता हूं।\n\n🩺 *याद रखें: यह केवल शैक्षिक जानकारी है। कृपया किसी स्वास्थ्य पेशेवर से सलाह लें।*",
      tamil: "உங்களுக்கு ஒரு சுகாதார கேள்வி இருப்பதை நான் புரிந்துகொள்கிறேன். நான் உதவ விரும்பினாலும், தகுதியான சுகாதார நிபுணரை அணுகுமாறு பரிந்துரைக்கிறேன்.\n\n🩺 *நினைவில் கொள்ளுங்கள்: இது கல்வி தகவல் மட்டுமே. சுகாதார நிபுணரை அணுகவும்.*"
    };
    
    return fallbackResponses[detectedLanguage];
  }
}
