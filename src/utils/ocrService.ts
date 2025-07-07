const GEMINI_API_KEY = 'AIzaSyAklMRnjQG0CxAc9aRfDgmDR5xi4BF1Npk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
          text: `EXTRACT TEXT FROM MEDICAL PRESCRIPTION/DOCUMENT

=== STRICT FORMATTING REQUIREMENTS ===
✓ Use ONLY bullet points (•) for main items
✓ Use ONLY dashes (-) for sub-items  
✓ Each point = ONE LINE maximum
✓ NO paragraphs, NO long sentences
✓ Write "Not visible" if text unclear
✓ Follow EXACT template below

=== DO NOT DO ===
✗ No paragraphs or multiple sentences
✗ No combining multiple points into one
✗ No free-form text descriptions

=== OUTPUT TEMPLATE ===

**PATIENT INFO:**
• Name: [Extract name]
• Age: [Extract age or "Not visible"]
• Gender: [M/F or "Not visible"]
• ID: [Patient ID or "Not visible"]

**DOCTOR INFO:**
• Doctor: [Doctor name or "Not visible"]
• Hospital/Clinic: [Facility name or "Not visible"] 
• Date: [Prescription date or "Not visible"]

**MEDICATIONS:**
• **Medicine 1:**
  - Name: [Medicine name]
  - Strength: [Dosage strength]
  - Quantity: [Amount to take]
  - Frequency: [When to take]
  - Duration: [How many days]
  - Instructions: [Before/after food etc.]

• **Medicine 2:**
  - Name: [Medicine name]
  - Strength: [Dosage strength]
  - Quantity: [Amount to take]
  - Frequency: [When to take]
  - Duration: [How many days]
  - Instructions: [Before/after food etc.]

[Continue for ALL visible medicines]

**ADDITIONAL NOTES:**
• Diagnosis: [If mentioned or "Not visible"]
• Allergies: [If mentioned or "Not visible"]
• Special Instructions: [Any other notes or "Not visible"]
• Next Visit: [If scheduled or "Not visible"]

REMEMBER: ONE LINE PER POINT. NO PARAGRAPHS.`
          },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`OCR API request failed: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
  return postProcessOCRResponse(rawText);
};

const postProcessOCRResponse = (rawText: string): string => {
  // Clean up the raw text and convert to proper markdown format
  let processedText = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Process line by line to create proper markdown
  const lines = processedText.split('\n');
  let markdownLines: string[] = [];
  let inMedicineSection = false;
  let currentMedicine = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle section headers with **
    if (line.match(/^\*\*(.*?)\*\*:?$/)) {
      const header = line.replace(/^\*\*|\*\*:?$/g, '').trim();
      markdownLines.push(`\n## ${header}\n`);
      inMedicineSection = header.toLowerCase().includes('medication');
      continue;
    }

    // Handle medicine entries
    if (inMedicineSection && line.match(/^\*\*.*?\*\*:?$/)) {
      currentMedicine = line.replace(/^\*\*|\*\*:?$/g, '').trim();
      markdownLines.push(`\n### ${currentMedicine}\n`);
      continue;
    }

    // Handle bullet points and sub-points
    if (line.startsWith('•') || line.startsWith('-')) {
      let content = line.substring(1).trim();
      
      // Check if this is a sub-point (starts with dash or is indented)
      if (line.startsWith('-') || lines[i].startsWith('  -') || lines[i].startsWith('\t-')) {
        // This is a sub-point
        markdownLines.push(`  - ${content}`);
      } else {
        // This is a main bullet point
        markdownLines.push(`- ${content}`);
      }
      continue;
    }

    // Handle field: value pairs
    if (line.includes(':') && !line.startsWith('**')) {
      const [field, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      if (value && value !== 'Not visible') {
        markdownLines.push(`- **${field.trim()}**: ${value}`);
      } else {
        markdownLines.push(`- **${field.trim()}**: Not visible`);
      }
      continue;
    }

    // Handle regular content
    if (line.length > 0) {
      markdownLines.push(`- ${line}`);
    }
  }

  // Join and clean up the markdown
  let markdown = markdownLines.join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n+/, '')
    .trim();

  return markdown;
};