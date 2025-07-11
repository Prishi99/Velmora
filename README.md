
# 🌿 Velmora – Your AI-Powered Health Assistant  
### Link - https://velmora1.vercel.app/

Velmora is a multilingual AI health assistant chatbot designed to answer common health-related questions in a **context-aware, emotionally sensitive** manner. It can help users understand their symptoms, nutritional needs, and medications, while gently reminding them to consult professionals for critical decisions. 

---

## 🩺 Features

-  10+ Context-Aware Health Q&A Examples (GPT-3.5 Simulated)
-  Multilingual Support – English, Hindi & Tamil
-  Emotionally empathetic responses
-  Upload & Extract Patient Data via OCR
-  Simple Intent Classification Logic
-  Organized Markdown Knowledge Base
-  Optional: Python Notebook for Intent Classification

---

##  Sample Questions It Can Answer

- What to eat when hemoglobin is low?
- Is paracetamol safe during pregnancy?
- Can I take ibuprofen with a cold?
- क्या बुखार में सिर दर्द होना सामान्य है?  
- கர்ப்ப காலத்தில் எந்த மருந்துகள் பாதுகாப்பாகும்?

> **Note:** All answers are AI-generated for informational use only. Please consult a healthcare professional for medical decisions.

---

##  Intent Classification Logic

Velmora classifies health-related questions into simple **intent categories** based on keywords:
- `nutrition`: diet, food, iron, vitamin, intake
- `medicine`: paracetamol, tablet, dose, side effect
- `emergency`: chest pain, unconscious, seizure, bleeding

Example:
```python
keywords = {
    'nutrition': ['eat', 'diet', 'iron', 'haemoglobin', 'vitamin', 'protein'],
    'medicine': ['paracetamol', 'medicine', 'tablet', 'safe', 'dose'],
    'emergency': ['emergency', 'pain', 'seizure', 'bleeding', 'urgent']
}
