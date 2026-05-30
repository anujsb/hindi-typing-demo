import { KeyMap } from '../../types';
import { ENGLISH_NORMAL, ENGLISH_SHIFT } from '../../english/standard';

// Kruti Dev uses standard US English layout keys
export const KRUTIDEV_NORMAL: KeyMap = { ...ENGLISH_NORMAL };
export const KRUTIDEV_SHIFT: KeyMap = { ...ENGLISH_SHIFT };

// Alt codes map to extended ASCII characters which the Kruti Dev font renders as specific Hindi ligatures
export const KRUTIDEV_ALT_MAP: Record<string, string> = {
  "0161": "¡", // ँ
  "0152": "˜", // द्व
  "0153": "™", // ट्ट
  "0155": "›", // ट्ठ
  "0159": "Ÿ", // ट्
  "0163": "£", // ख्
  "0165": "¥", // ज
  "0180": "´", // ज
  "0182": "¶", // फ
  "0197": "Å", // ऊ
  "0216": "Ø", // क्र
  "0217": "Ù", // र
  "0221": "Ý", // फ्र
  "0225": "á", // ह्य
  "0227": "ã", // ह्म
  "0240": "ð"  // दृ
};

// Kruti Dev does NOT use any processing because it maps visually through CSS fonts.
export const processKrutidevCombinations = (str: string): string => str;

