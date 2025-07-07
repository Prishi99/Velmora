
import { KEYWORDS } from '../data/healthData';

export type Intent = 'nutrition' | 'medicine' | 'emergency' | 'general';

export function classifyIntent(text: string): Intent {
  const lowerText = text.toLowerCase();
  
  // Enhanced keyword matching with better patterns
  for (const [intent, words] of Object.entries(KEYWORDS)) {
    for (const word of words) {
      // Create more flexible regex patterns
      const cleanWord = word.toLowerCase().replace(/[^\w\s]/g, '');
      const patterns = [
        new RegExp(`\\b${cleanWord}\\b`, 'i'),
        new RegExp(`${cleanWord}`, 'i'),
        new RegExp(`\\b${word.toLowerCase()}\\b`, 'i')
      ];
      
      // Check if any pattern matches
      if (patterns.some(pattern => pattern.test(lowerText))) {
        console.log(`Matched intent '${intent}' with keyword '${word}' in text: "${text}"`);
        return intent as Intent;
      }
    }
  }
  
  console.log(`No intent match found for: "${text}" - defaulting to general`);
  return 'general';
}
