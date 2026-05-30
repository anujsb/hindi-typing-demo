import { KeyMap } from '../../types';

export const KRUTIDEV_NORMAL: KeyMap = {
  '`': '़', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९', '0': '०', '-': '-', '=': 'ृ',
  'q': 'ु', 'w': 'ू', 'e': 'म', 'r': 'त', 't': 'ज', 'y': 'ल', 'u': 'न', 'i': 'प', 'o': 'व', 'p': 'च', '[': 'ख्', ']': ',', '\\': '?',
  'a': 'ं', 's': 'े', 'd': 'क', 'f': '\uE000', 'g': 'ह', 'h': 'ी', 'j': 'र', 'k': 'ा', 'l': 'स', ';': 'य', '\'': 'श्',
  'z': '्र', 'x': 'ग', 'c': 'ब', 'v': 'अ', 'b': 'इ', 'n': 'द', 'm': 'उ', ',': 'ए', '.': 'ण्', '/': 'ध्'
};

export const KRUTIDEV_SHIFT: KeyMap = {
  '~': '्\u200C', '!': '!', '@': '/', '#': 'रु', '$': '+', '%': ':', '^': '‘', '&': '’', '*': 'द्ध', '(': ';', ')': ')', '_': 'ऋ', '+': 'त्र',
  'Q': 'फ', 'W': 'ॅ', 'E': 'म्', 'R': 'त्', 'T': 'ज्', 'Y': 'ल्', 'U': 'न्', 'I': 'प्', 'O': 'व्', 'P': 'च्', '{': 'क्ष्', '}': 'द्व', '|': 'द्य',
  'A': '।', 'S': 'ै', 'D': 'क्', 'F': 'थ्', 'G': 'ळ', 'H': 'भ्', 'J': 'श्र', 'K': 'ज्ञ', 'L': 'स्', ':': 'रू', '"': 'ष्',
  'Z': 'र्', 'X': 'ग्', 'C': 'ब्', 'V': 'ट', 'B': 'ठ', 'N': 'छ', 'M': 'ड', '<': 'ढ', '>': 'झ', '?': 'घ्'
};

export const KRUTIDEV_ALT_MAP: Record<string, string> = {
  "0161": "ँ", "0152": "द्व", "0153": "ट्ट", "0155": "ट्ठ",
  "0159": "ट्", "0163": "ख्", "0165": "ज", "0180": "ज",
  "0182": "फ", "0197": "ऊ", "0216": "क्र", "0217": "र",
  "0221": "फ्र", "0225": "ह्य", "0227": "ह्म", "0240": "दृ"
};

// Kruti Dev specific combinations processor
// It skips all Mangal combinations (vowels, candras) because Kruti Dev relies on literal typing and Alt codes
export const processKrutidevCombinations = (str: string): string => {
  // Strip Zero Width Joiner (ZWJ) to allow proper combinations and ligatures
  str = str.replace(/\u200D/g, '');

  let prevText = "";
  while (prevText !== str) {
    prevText = str;
    // 1. Swap pending 'ि' (\uE000) with the following consonant and convert to real 'ि'
    str = str.replace(/\uE000([क-ह](?:्[क-ह])*(?:्)?)/g, '$1\u093F');
  }

  // 2. Fix half-consonant + vertical bar (ा) -> full consonant
  // Halant + short i + aa matra (legacy context) -> short i
  str = str.replace(/्\u093Fा/g, '\u093F');
  // Halant + aa matra -> full consonant
  str = str.replace(/्ा/g, '');

  // 6. Fix Reph (र्) - typed AFTER the consonant in Remington/Krutidev
  str = str.replace(/([क-ह](?:्[क-ह])*)([ा-ौंःँ]*)(र्)/g, '$3$1$2');
  
  return str;
};
