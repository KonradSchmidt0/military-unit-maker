import { create } from "zustand";

type EchelonSymbolMap = {
  [level: number]: string;
};

interface EchelonStore {
  intToSymbol: EchelonSymbolMap;
  setSymbols: (entries: [level: number, symbol: string][]) => void;

  intToIconPathEndings: string[];
  setIcons: (entries: [level: number, newIconPathEnding: string][]) => void;

  reset: () => void;
}

  
const defaultSymbols: EchelonSymbolMap = {
  0: "ø",            
  1: "o",            // Squad
  2: "oo",           // Section
  3: "ooo",          // Platoon
  4: "I",            // Company
  5: "II",            // Battalion
  6: "III",         
  7: "X",         
  8: "XX",       
  9: "XXX",
  10: "Δ", // Army
  11: "ΔΔ", // Army Group / Front
  12: "ΔΔΔ", // Combatant Command / Front Group
  13: "++",
  14: "oooo",
  15: "", // For when user wants to have unspecify
};

const defaultIcons: string[] = [
  "e-e.svg",
  "e-o.svg",
  "e-oo.svg",
  "e-ooo.svg",
  "e-I.svg",
  "e-II.svg",
  "e-III.svg",
  "e-X.svg",
  "e-XX.svg",
  "e-XXX.svg",
  "e-XXXX.svg",
  "e-XXXXX.svg",
  "e-XXXXXX.svg",
  "e-++.svg",
  "e-oooo.svg",
]


export const useEchelonStore = create<EchelonStore>((set) => ({
  intToSymbol: { ...defaultSymbols },
  intToIconPathEndings: defaultIcons,

  setSymbols: (entries) =>
    set((state) => {
      const updated = { ...state.intToSymbol };
      for (const [level, symbol] of entries) {
        updated[level] = symbol;
      }
      return { intToSymbol: updated };
    }),

  setIcons: (entries) =>
    set((state) => {
      const updated = [...state.intToIconPathEndings];
      for (const [level, newIcon] of entries) {
        updated[level] = newIcon;
      }
      return { intToIconPathEndings: updated };
    }),

  reset: () => set({ intToSymbol: { ...defaultSymbols }, intToIconPathEndings: { ...defaultIcons } }),
})
);