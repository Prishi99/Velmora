
import { EXAMPLES } from '../data/healthData';
import { Intent } from './intentClassifier';

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

// Enhanced language-specific professional consultation messages
const CONSULTATION_ADVICE = {
  english: {
    nutrition: "💡 **Professional Advice**: For personalized nutrition plans, consult a registered dietitian or nutritionist who can assess your specific health conditions, dietary restrictions, and goals.",
    medicine: "⚠️ **Important**: Always consult your doctor or pharmacist before taking any medication. They can check for drug interactions, proper dosages, and ensure it's safe for your specific health condition.",
    emergency: "🚨 **EMERGENCY**: This requires immediate medical attention! Please contact emergency services (911/108) or visit the nearest emergency room right away. Do not delay seeking professional help.",
    general: "🩺 **Remember**: This is educational information only. For accurate diagnosis and treatment, please consult with a qualified healthcare professional who can examine you properly."
  },
  hindi: {
    nutrition: "💡 **पेशेवर सलाह**: व्यक्तिगत पोषण योजना के लिए किसी योग्य पोषण विशेषज्ञ से मिलें जो आपकी स्वास्थ्य स्थिति और आवश्यकताओं का सही आकलन कर सके।",
    medicine: "⚠️ **महत्वपूर्ण**: कोई भी दवा लेने से पहले हमेशा डॉक्टर या फार्मासिस्ट से सलाह लें। वे दवाओं के नुकसान, सही खुराक और आपकी स्थिति के लिए सुरक्षा की जांच कर सकते हैं।",
    emergency: "🚨 **आपातकाल**: इसके लिए तत्काल चिकित्सा सहायता चाहिए! कृपया आपातकालीन सेवाओं (108) से संपर्क करें या तुरंत नजदीकी अस्पताल जाएं।",
    general: "🩺 **याद रखें**: यह केवल शैक्षिक जानकारी है। सटीक निदान और इलाज के लिए किसी योग्य चिकित्सक से मिलें जो आपकी सही जांच कर सके।"
  },
  tamil: {
    nutrition: "💡 **நிபுணர் ஆலோசனை**: தனிப்பட்ட ஊட்டச்சத்து திட்டத்திற்கு தகுதியான ஊட்டச்சத்து நிபுணரை அணுகவும், அவர்கள் உங்கள் குறிப்பிட்ட சுகாதார நிலைமைகளை மதிப்பீடு செய்து உதவுவார்கள்.",
    medicine: "⚠️ **முக்கியம்**: எந்த மருந்தையும் எடுத்துக்கொள்ளும் முன் எப்போதும் மருத்துவர் அல்லது மருந்தாளரை அணுகவும். அவர்கள் மருந்து தொடர்புகள், சரியான அளவு மற்றும் பாதுகாப்பை சரிபார்க்க முடியும்.",
    emergency: "🚨 **அவசரநிலை**: இதற்கு உடனடி மருத்துவ கவனிப்பு தேவை! அவசர சேவைகளை (108) தொடர்பு கொள்ளுங்கள் அல்லது உடனடியாக அருகிலுள்ள மருத்துவமனைக்கு செல்லுங்கள்.",
    general: "🩺 **நினைவில் கொள்ளுங்கள்**: இது கல்வி தகவல் மட்டுமே. துல்லியமான நோய் கண்டறிதல் மற்றும் சிகிச்சைக்கு தகுதியான சுகாதார நிபுணரை அணுகவும்."
  }
};

// Enhanced OpenAI API call with better prompts
async function callOpenAI(question: string, intent: Intent, language: string): Promise<string> {
  const API_KEY = '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';
  
  const languageInstructions = {
    english: 'Respond in English only.',
    hindi: 'Respond in Hindi (हिंदी में जवाब दें) only.',
    tamil: 'Respond in Tamil (தமிழில் பதிலளிக்கவும்) only.'
  };

  const intentSpecificPrompts = {
    emergency: 'This is an emergency medical question. Provide immediate actionable advice while strongly emphasizing the need for emergency medical care.',
    medicine: 'This is about medication. Provide educational information but strongly emphasize consulting healthcare professionals for medication advice.',
    nutrition: 'This is about nutrition and diet. Provide helpful dietary information while recommending professional nutritionist consultation.',
    general: 'This is a general health question. Provide educational information while emphasizing professional medical consultation.'
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable but cautious health assistant. ${languageInstructions[language]} 
                     ${intentSpecificPrompts[intent]}
                     
                     Guidelines:
                     - Provide helpful, accurate health information (≤200 words)
                     - Use simple, clear language
                     - Include relevant health tips when appropriate
                     - Always emphasize that this is educational information
                     - Be empathetic and supportive
                     - If it's an emergency, prioritize immediate action advice`
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();
    
    // Add professional consultation advice based on language and intent
    const consultationMsg = CONSULTATION_ADVICE[language][intent];
    
    return `${aiResponse}\n\n${consultationMsg}\n\n*(AI-powered response)*`;
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Enhanced fallback responses
    const consultationMsg = CONSULTATION_ADVICE[language][intent];
    
    const fallbackResponses = {
      english: "I understand you have a health question. While I'd like to help, I recommend consulting with a qualified healthcare professional who can provide personalized advice based on your specific situation.",
      hindi: "मैं समझता हूं कि आपका एक स्वास्थ्य प्रश्न है। जबकि मैं मदद करना चाहूंगा, मैं एक योग्य स्वास्थ्य पेशेवर से सलाह लेने की सिफारिश करता हूं।",
      tamil: "உங்களுக்கு ஒரு சுகாதார கேள்வி இருப்பதை நான் புரிந்துகொள்கிறேன். நான் உதவ விரும்பினாலும், உங்கள் குறிப்பிட்ட நிலைமையின் அடிப்படையில் தனிப்பட்ட ஆலோசனை வழங்கக்கூடிய தகுதியான சுகாதார நிபுணரை அணுகுமாறு பரிந்துரைக்கிறேன்."
    };
    
    return `${fallbackResponses[language]}\n\n${consultationMsg}`;
  }
}

export async function generateAnswer(question: string, intent: Intent): Promise<string> {
  // First, try to find exact match in knowledge base
  const exactMatch = EXAMPLES.find(pair => 
    pair.q.toLowerCase() === question.toLowerCase()
  );
  
  if (exactMatch) {
    const language = detectLanguage(question);
    const consultationMsg = CONSULTATION_ADVICE[language][intent];
    return `${exactMatch.a}\n\n${consultationMsg}\n\n*(From knowledge base)*`;
  }
  
  // For new questions, use enhanced AI response
  const language = detectLanguage(question);
  return await callOpenAI(question, intent, language);
}
