import { LayoutDefinition } from './types';
import { INSCRIPT_NORMAL, INSCRIPT_SHIFT, INSCRIPT_ALT_MAP } from './hindi/mangal/inscript';
import { REMINGTON_NORMAL, REMINGTON_SHIFT, REMINGTON_ALT_MAP } from './hindi/mangal/remington-gail';
import { REMINGTON_CBI_NORMAL, REMINGTON_CBI_SHIFT } from './hindi/mangal/remington-gail-cbi';
import { processMangalCombinations } from './hindi/mangal/processor';
import { KRUTIDEV_NORMAL, KRUTIDEV_SHIFT, KRUTIDEV_ALT_MAP, processKrutidevCombinations } from './hindi/krutidev/krutidev010';
import { ENGLISH_NORMAL, ENGLISH_SHIFT } from './english/standard';

export const layouts: Record<string, LayoutDefinition> = {
  english: {
    id: "english",
    name: "English (Standard)",
    fontType: "english",
    normalMap: ENGLISH_NORMAL,
    shiftMap: ENGLISH_SHIFT
  },
  inscript: {
    id: "inscript",
    name: "Mangal Inscript (Standard)",
    fontType: "unicode",
    normalMap: INSCRIPT_NORMAL,
    shiftMap: INSCRIPT_SHIFT,
    altCodeMap: INSCRIPT_ALT_MAP
    // Inscript relies purely on OS Unicode shaping, no manual layout-level processing needed like Remington
  },
  remington: {
    id: "remington",
    name: "Mangal Remington Gail",
    fontType: "unicode",
    normalMap: REMINGTON_NORMAL,
    shiftMap: REMINGTON_SHIFT,
    processor: processMangalCombinations,
    altCodeMap: REMINGTON_ALT_MAP
  },
  remington_cbi: {
    id: "remington_cbi",
    name: "Mangal Remington Gail CBI",
    fontType: "unicode",
    normalMap: REMINGTON_CBI_NORMAL,
    shiftMap: REMINGTON_CBI_SHIFT,
    processor: processMangalCombinations,
    altCodeMap: REMINGTON_ALT_MAP
  },
  krutidev: {
    id: "krutidev",
    name: "Kruti Dev 010",
    fontType: "legacy",
    normalMap: KRUTIDEV_NORMAL,
    shiftMap: KRUTIDEV_SHIFT,
    processor: processKrutidevCombinations,
    altCodeMap: KRUTIDEV_ALT_MAP
  }
};

export const getLayout = (id: string): LayoutDefinition => layouts[id] || layouts.inscript;
