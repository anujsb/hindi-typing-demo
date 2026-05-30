export type KeyMap = Record<string, string>;

export interface LayoutProcessor {
  (text: string): string;
}

export interface LayoutDefinition {
  id: string;
  name: string;
  fontType: "unicode" | "legacy" | "english";
  normalMap: KeyMap;
  shiftMap: KeyMap;
  processor?: LayoutProcessor;
  altCodeMap?: Record<string, string>;
}

export const FINGER_COLORS: KeyMap = {
  q: "#d97706", a: "#d97706", z: "#d97706", "1": "#d97706", "`": "#d97706",
  w: "#b45309", s: "#b45309", x: "#b45309", "2": "#b45309",
  e: "#059669", d: "#059669", c: "#059669", "3": "#059669",
  r: "#0891b2", f: "#0891b2", v: "#0891b2", "4": "#0891b2",
  t: "#0369a1", g: "#0369a1", b: "#0369a1", "5": "#0369a1",
  y: "#7c3aed", h: "#7c3aed", n: "#7c3aed", "6": "#7c3aed",
  u: "#6d28d9", j: "#6d28d9", m: "#6d28d9", "7": "#6d28d9",
  i: "#be185d", k: "#be185d", ",": "#be185d", "8": "#be185d",
  o: "#dc2626", l: "#dc2626", ".": "#dc2626", "9": "#dc2626",
  p: "#0f766e", ";": "#0f766e", "/": "#0f766e", "0": "#0f766e",
  "[": "#0d9488", "'": "#0d9488", "-": "#0d9488",
  "]": "#0891b2", "=": "#0891b2", "\\": "#0891b2"
};
