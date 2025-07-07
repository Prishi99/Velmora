import re
from collections import Counter
from typing import List, Dict, Tuple

# ---------------------------------------------------------------
# 1. Intent Classification (pure Python, lightning‑fast)
# ---------------------------------------------------------------
_KEYWORDS: Dict[str, List[str]] = {
    "nutrition": [
        "eat", "diet", "food", "nutrition", "vitamin", "protein", "iron", "calcium",
        "खाना", "भोजन", "आहार",                         # Hindi
        "உணவு", "ஆஹாரம்", "சாப்பிட"                    # Tamil
    ],
    "medicine": [
        "paracetamol", "ibuprofen", "tablet", "dose", "drug", "medicine", "medication",
        "दवा", "गोली",                                   # Hindi
        "மருந்து", "டோஸ்"                                # Tamil
    ],
    "emergency": [
        "emergency", "urgent", "bleeding", "unconscious", "chest pain", "stroke",
        "ambulance",
        "आपात", "इमरजेंसी", "अचेत",                     # Hindi
        "அவசரம்", "இரத்த", "உடல் வலி"                   # Tamil
    ],
}

_WORD_BOUNDARY_RE = re.compile(r"\w+")

def classify_intent(text: str) -> str:
    """Return the intent label for *text*."""
    text_lc = text.lower()
    for intent, words in _KEYWORDS.items():
        if any(re.search(rf"\b{re.escape(w)}\b", text_lc) for w in words):
            return intent
    return "general"

# ---------------------------------------------------------------
# 2. Entity Extraction  (spaCy → fallback)
# ---------------------------------------------------------------
try:
    import spacy
    _NLP = spacy.load("en_core_web_sm")          # small English model
except Exception:
    _NLP = None

def extract_entities(text: str) -> List[Tuple[str, str]]:
    """
    Return list of (entity_text, entity_label).
    If spaCy not installed, returns an empty list.
    """
    if _NLP is None:
        return []
    doc = _NLP(text)
    return [(ent.text, ent.label_) for ent in doc.ents]

# ---------------------------------------------------------------
# 3. Keyword Extraction  (RAKE → simple fallback)
# ---------------------------------------------------------------
try:
    from rake_nltk import Rake
    _RAKE = Rake()
except Exception:
    _RAKE = None

_STOPWORDS = set("""
a an and are as at be by for from has he in is it its of on that the to was were will with
""".split())

def _basic_keywords(text: str, top_n: int = 5) -> List[str]:
    """Very small TF counter fallback."""
    words = [w.lower() for w in _WORD_BOUNDARY_RE.findall(text) if w.lower() not in _STOPWORDS]
    common = Counter(words).most_common(top_n)
    return [w for w, _ in common]

def extract_keywords(text: str, top_n: int = 5) -> List[str]:
    """
    Return *top_n* keywords using RAKE if available, else simple frequency list.
    """
    if _RAKE is not None:
        _RAKE.extract_keywords_from_text(text)
        return _RAKE.get_ranked_phrases()[:top_n]
    return _basic_keywords(text, top_n)

# ---------------------------------------------------------------
# 4. Quick Demo
# ---------------------------------------------------------------
if __name__ == "__main__":
    SAMPLE_QUESTIONS = [
        "What should I eat to increase hemoglobin?",
        "Is ibuprofen safe with paracetamol?",
        "My mother is unconscious – what do I do?",
        "Give me exercises to sleep better.",
    ]

    for q in SAMPLE_QUESTIONS:
        intent = classify_intent(q)
        entities = extract_entities(q)
        keywords = extract_keywords(q)
        print(f"\nQ: {q}\nIntent  : {intent}\nEntities: {entities}\nKeywords: {keywords}")
