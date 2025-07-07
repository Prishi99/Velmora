
export interface QAPair {
  q: string;
  a: string;
  language: 'english' | 'hindi' | 'tamil';
  intent: 'nutrition' | 'medicine' | 'emergency' | 'general';
}

export const EXAMPLES: QAPair[] = [
  // English Examples
  {
    q: "What should I eat when my hemoglobin is low?",
    a: "I understand how concerning it can feel when you're told your hemoglobin is low, especially if you've been feeling tired or weak lately. But don't worry—nutrition can play a powerful role here.\n\nTo boost hemoglobin, try to include iron-rich foods in every meal. Some excellent choices are spinach, beetroot, lentils, dates, and red meat (if you're non-vegetarian). Pair these with vitamin C-rich foods like oranges, guavas, or tomatoes—this helps your body absorb iron better.\n\nFor example, a breakfast of poha with lemon and peanuts or oats with raisins and a glass of orange juice can go a long way. Lunch could include rajma, rice, and beetroot salad.\n\nAlso, try to avoid drinking tea or coffee right after meals—they can hinder iron absorption.\n\n✨ Take it one day at a time. Healing is a journey, and your body just needs a bit of help.\n\n*Disclaimer: This is AI-generated and educational. Please consult a doctor or dietitian for a tailored plan.*",
    language: 'english',
    intent: 'nutrition'
  },
  {
    q: "Is paracetamol safe during pregnancy?",
    a: "That's a very thoughtful and responsible question. Many moms-to-be worry about every little thing they take—and rightly so.\n\nParacetamol is generally considered safe for short-term use during pregnancy and is commonly recommended to manage mild pain or fever. The safest dose is 500–650 mg, taken every 4–6 hours, not exceeding 4 grams in a day.\n\nBut do use it sparingly. Prolonged or frequent use—especially without medical supervision—should be avoided. Also, don't mix it with other cold or pain meds without checking with your doctor.\n\n💛 You're doing your best to take care of your baby, and that's beautiful.\n\n*Disclaimer: This is AI-generated. Always consult your gynecologist before taking any medication during pregnancy.*",
    language: 'english',
    intent: 'medicine'
  },
  {
    q: "Can I take ibuprofen and paracetamol together for fever?",
    a: "Yes, you can, but it's important to be careful with the timing and dosage. This combo is often used to manage high fever or persistent pain more effectively, especially in children and elderly.\n\nThe usual method is to stagger them—take paracetamol first, then ibuprofen about 3 hours later. This allows you to manage symptoms more evenly across the day. Paracetamol (500–1000 mg) and ibuprofen (200–400 mg) are both effective, but don't exceed the recommended max in 24 hours.\n\nHowever, if you have kidney issues, ulcers, or are pregnant, ibuprofen may not be safe—so consult your doctor first.\n\n💡 Fever can be your body's way of fighting back—support it gently and wisely.\n\n*Disclaimer: AI-generated medical info. Please consult a healthcare provider before using multiple medications.*",
    language: 'english',
    intent: 'medicine'
  },
  {
    q: "How do I manage mild dehydration at home?",
    a: "Feeling dizzy, having dry lips, or noticing dark-colored urine? These could be signs your body is asking for help.\n\nStart with oral rehydration solution (ORS)—you can make it at home with 6 teaspoons of sugar and ½ teaspoon of salt in 1 liter of clean water. Sip slowly, about 100 ml every 15 minutes.\n\nEat soft fruits like watermelon, banana, and drink coconut water if available—they restore minerals naturally.\n\nIf the symptoms worsen—like extreme thirst, confusion, or you stop urinating—**don't wait. Go to the hospital.**\n\n💧 Your body deserves kindness, even through something as basic as hydration.\n\n*Disclaimer: This response is AI-generated and not a replacement for medical attention. Consult a doctor if symptoms persist or worsen.*",
    language: 'english',
    intent: 'general'
  },
  // Hindi Examples
  {
    q: "हीमोग्लोबिन कम हो तो क्या खाना चाहिए?",
    a: "यह जानकर थोड़ी चिंता होना स्वाभाविक है—लेकिन अच्छी बात यह है कि सही खाना आपकी मदद कर सकता है।\n\nआयरन से भरपूर चीज़ें खाएँ—जैसे पालक, चुकंदर, अनार, गुड़, सूखे मेवे, और दालें। विटामिन C जैसे नींबू, अमरूद, संतरा के साथ इन्हें लें ताकि शरीर आयरन को अच्छी तरह सोख सके।\n\nउदाहरण के लिए, सुबह का नाश्ता अंकुरित मूंग + नींबू, दोपहर में चुकंदर पराठा + दही, रात में मसूर की दाल और ब्राउन राइस।\n\n📌 चाय या कॉफी खाने के 1–2 घंटे बाद ही लें।\n\nआपका शरीर फिर से मजबूत बन सकता है—बस थोड़ा प्यार और देखभाल चाहिए।\n\n*डिस्क्लेमर: यह जानकारी AI द्वारा बनाई गई है, कृपया डॉक्टर से व्यक्तिगत सलाह लें।*",
    language: 'hindi',
    intent: 'nutrition'
  },
  {
    q: "क्या बुखार में पैरासिटामोल लेना सुरक्षित है?",
    a: "जी हाँ, पैरासिटामोल बुखार और दर्द के लिए आमतौर पर सुरक्षित मानी जाती है। वयस्कों में 500–650 mg हर 4–6 घंटे पर दी जाती है, लेकिन 24 घंटे में 4 ग्राम से अधिक न लें।\n\nबच्चों के लिए खुराक उनके वजन पर निर्भर करती है—10–15 mg/kg।\n\nयदि आपको लिवर से जुड़ी कोई समस्या है, या आप नियमित शराब का सेवन करते हैं, तो सावधानी बरतें।\n\n🌡️ बुखार के साथ खुद की देखभाल करें—आराम करें, खूब पानी पिएँ, और डॉक्टर की सलाह लें।\n\n*डिस्क्लेमर: यह AI द्वारा तैयार की गई है; सही खुराक जानने हेतु डॉक्टर से संपर्क करें।*",
    language: 'hindi',
    intent: 'medicine'
  },
  {
    q: "अचानक चक्कर आना कब खतरनाक होता है?",
    a: "कभी-कभी थकान, गर्मी या खाली पेट के कारण हल्का चक्कर आ सकता है, जो सामान्य होता है। पर अगर चक्कर के साथ बेहोशी, तेज़ दिल धड़कना, सीने में दर्द, या शरीर का एक हिस्सा सुन्न हो जाए, तो यह गंभीर संकेत हो सकते हैं।\n\n⛑️ ऐसी स्थिति में तुरंत डॉक्टर से संपर्क करें या आपातकालीन सेवा (108) पर कॉल करें।\n\n❗हमेशा अपनी शरीर की बात सुनिए। वो आपको कुछ ज़रूरी बता रही होती है।\n\n*डिस्क्लेमर: यह AI-जनरेटेड है। आपात स्थिति में बिना देरी तुरंत चिकित्सा सहायता लें।*",
    language: 'hindi',
    intent: 'emergency'
  },
  // Tamil Examples
  {
    q: "ஹீமோகுளோபின் குறைந்திருந்தால் என்ன சாப்பிடலாம்?",
    a: "நீங்கள் இப்போது களைப்பாக, சோர்வாக உணர்ந்தால் அது சாதாரணம். இரத்த ஹீமோகுளோபின் குறைந்திருக்கலாம். நல்ல உணவுகளால் அதை திருப்பிக் கொள்ளலாம்.\n\nசுண்டைக்காய், முருங்கைக்கீரை, பீட்ரூட், உருளைக்கிழங்கு, குருதிக் கிழங்கு போன்றவை இரும்புச்சத்து மிகுந்தவை.\n\nவெள்ளைக்கீரை சாம்பார், பீர்க்கங்காய் கூட்டு, மற்றும் சத்தான பழங்கள் (ஆரஞ்சு, பப்பாளி) தினமும் சேர்த்துக்கொள்ளுங்கள்.\n\n🍽️ பசிக்கும்போது நமக்கும் நம் உடலுக்கும் அன்பாக இருக்கலாம்.\n\n*இது AI வழிகாட்டி மட்டுமே. உங்கள் மருத்துவரிடம் ஆலோசனை பெறுங்கள்.*",
    language: 'tamil',
    intent: 'nutrition'
  },
  {
    q: "கர்ப்ப காலத்தில் பைராசிட்டமால் பாதுகாப்பா?",
    a: "இது ஒரு முக்கியமான கேள்வி. நீங்கள் உங்கள் பிள்ளையின் நலனைப்பற்றிக் கவலைபடுவது நியாயம்தான்.\n\nபைராசிட்டமால் பெரும்பாலும் பாதுகாப்பாகவே கருதப்படுகிறது, குறிப்பாக குறுகிய காலத்திற்கு மட்டும் பயன்படுத்தினால். 500–650 mg மாத்திரைகளை தினமும் 3–4 முறை எடுத்துக்கொள்ளலாம்.\n\nஆனால், நீண்ட நாட்களாக எடுத்தால் மருத்துவரிடம் ஆலோசிக்கவும்.\n\n👶 நீங்கள் கவனமாக இருக்கிறீர்கள் என்பதை பாராட்டுகிறேன்.\n\n*AI உருவாக்கிய பதில். மருத்துவரின் ஆலோசனை தவிர்க்கவே கூடாது.*",
    language: 'tamil',
    intent: 'medicine'
  },
  {
    q: "மாரடைப்பின் அறிகுறிகள் என்ன?",
    a: "திடீர் மார்புவலி, வியர்வை, மூச்சுத்திணறல், இடது கையில் குமட்டும் வலி—இவை எல்லாம் மாரடைப்பின் அறிகுறிகளாக இருக்கலாம்.\n\n5 நிமிடங்களுக்கு மேலாக இந்த அறிகுறிகள் இருந்தால்—அதிக அவசரம். 108 அழைக்கவும்.\n\nஅழுத்தம், குழப்பம் இருந்தால் அருகிலுள்ள மருத்துவமனையை உடனே அணுகுங்கள்.\n\n🫀 உங்கள் உயிர் விலைமிக்கது—தாமதிக்க வேண்டாம்.\n\n*AI உருவாக்கிய தகவல். உடனடி மருத்துவம் தேவைப்படும் நேரத்தில் தயங்காமல் செல்லுங்கள்.*",
    language: 'tamil',
    intent: 'emergency'
  }
];

export const KEYWORDS = {
  nutrition: [
    "eat", "diet", "food", "nutrition", "vitamin", "iron", "protein", "calcium", "hemoglobin", "anemia", "हीमोग्लोबिन", "खाना", "भोजन", "आहार", "विटामिन", "आयरन", "प्रोटीन", "कैल्शियम", "खून", "एनीमिया", "ஹீமோகுளோபின்", "உணவு", "ஆஹாரம்", "வைட்டமின்", "இரும்பு", "புரதம்", "கால்சியம்", "இரத்தம்", "இரத்த சோகை", "சாப்பிட"
  ],
  medicine: [
    "paracetamol", "ibuprofen", "tablet", "dose", "drug", "medicine", "medication", "pills", "fever", "pain", "safe", "pregnancy", "pregnant", "दवा", "गोली", "पैरासिटामोल", "दवाई", "बुखार", "दर्द", "सुरक्षित", "गर्भावस्था", "गर्भवती", "மருந்து", "பைராசிட்டமால்", "மாத்திரை", "காய்ச்சல்", "வலி", "பாதுகாப்பு", "கர்ப்பம்", "கர்ப்பிணி"
  ],
  emergency: [
    "emergency", "urgent", "bleeding", "unconscious", "chest pain", "stroke", "accident", "dizzy", "dizziness", "heart attack", "dangerous", "आपात", "घातक", "अचानक", "बेहोश", "दुर्घटना", "चक्कर", "खतरनाक", "दिल का दौरा", "सीने में दर्द", "அவசரம்", "கொடுதுயரம்", "மயக்கம்", "விபத்து", "தலைச்சுற்றல்", "ஆபத்து", "மாரடைப்பு", "மார்பு வலி"
  ],
  general: [
    "dehydration", "dehydrated", "water", "thirst", "dizzy", "tired", "weakness", "manage", "home remedies", "पानी की कमी", "प्यास", "कमजोरी", "थकान", "घरेलू उपाय", "நீர்ச்சத்து குறைபாடு", "தாகம்", "பலவீனம்", "களைப்பு", "வீட்டு வைத்தியம்"
  ]
};
