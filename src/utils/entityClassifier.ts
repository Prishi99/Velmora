
export type Entity = 
  | 'cardiology'      // Heart-related
  | 'hematology'      // Blood-related
  | 'nutrition'       // Diet and food
  | 'pharmacology'    // Medications
  | 'emergency'       // Urgent medical situations
  | 'gynecology'      // Women's health/pregnancy
  | 'immunology'      // Immune system
  | 'general';        // General health

interface EntityKeywords {
  [key: string]: string[];
}

const ENTITY_KEYWORDS: EntityKeywords = {
  cardiology: [
    'heart', 'chest pain', 'cardiac', 'blood pressure', 'hypertension', 'cholesterol',
    'दिल', 'सीने में दर्द', 'हृदय', 'बीपी', 'कोलेस्ट्रॉल',
    'இதயம்', 'மார்பு வலி', 'இரத்த அழுத்தம்', 'கொலஸ்ட்ரால்'
  ],
  hematology: [
    'hemoglobin', 'anemia', 'blood', 'iron deficiency', 'hb',
    'हीमोग्लोबिन', 'खून', 'एनीमिया', 'आयरन',
    'ஹீமோகுளோபின்', 'இரத்தம்', 'இரத்த சோகை', 'இரும்பு'
  ],
  nutrition: [
    'eat', 'diet', 'food', 'nutrition', 'vitamin', 'protein', 'calcium', 'fruits', 'vegetables',
    'खाना', 'भोजन', 'आहार', 'विटामिन', 'प्रोटीन', 'कैल्शियम',
    'உணவு', 'ஆஹாரம்', 'வைட்டமின்', 'புரதம்', 'கால்சியம்'
  ],
  pharmacology: [
    'paracetamol', 'ibuprofen', 'tablet', 'dose', 'drug', 'medicine', 'medication', 'pills',
    'दवा', 'गोली', 'पैरासिटामोल', 'दवाई',
    'மருந்து', 'பைராசிட்டமால்', 'மாத்திரை'
  ],
  emergency: [
    'emergency', 'urgent', 'bleeding', 'unconscious', 'chest pain', 'stroke', 'accident',
    'आपात', 'घातक', 'अचानक', 'बेहोश', 'दुर्घटना',
    'அவசரம்', 'கொடுதுயரம்', 'மயக்கம்', 'விபத்து'
  ],
  gynecology: [
    'pregnancy', 'pregnant', 'menstruation', 'periods', 'gynecology', 'obstetrics',
    'गर्भावस्था', 'गर्भवती', 'माहवारी', 'प्रसूति',
    'கர்ப்பம்', 'கர்ப்பிணி', 'மாதவிடாய்', 'மகப்பேறு'
  ],
  immunology: [
    'immunity', 'immune', 'infection', 'fever', 'cold', 'flu', 'antibody',
    'प्रतिरक्षा', 'संक्रमण', 'बुखार', 'सर्दी', 'फ्लू',
    'நோய் எதிர்ப்பு', 'தொற்று', 'காய்ச்சல்', 'சளி'
  ]
};

export function classifyEntity(text: string): Entity {
  const lowerText = text.toLowerCase();
  
  // Check each entity category
  for (const [entity, keywords] of Object.entries(ENTITY_KEYWORDS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`);
      if (regex.test(lowerText)) {
        return entity as Entity;
      }
    }
  }
  
  return 'general';
}
