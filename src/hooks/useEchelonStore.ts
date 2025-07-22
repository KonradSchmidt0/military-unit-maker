import { create } from "zustand";

type EchelonSymbolMap = {
  [level: number]: string;
};

interface EchelonStore {
  intToSymbol: EchelonSymbolMap;
  setSymbol: (level: number, symbol: string) => void;
  intToIconPathEndings: string[];
  setIcon: (level: number, newIconPathEnding: string) => void;
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
  
  setSymbol: (level, symbol) =>
    set((state) => ({
      intToSymbol: {
        ...state.intToSymbol,
        [level]: symbol,
      },
    })),

  intToIconPathEndings: defaultIcons,

  setIcon: (level, newIconPath) => set((state) => ({intToIconPathEndings: {...state.intToIconPathEndings, [level]: newIconPath}})),

  reset: () => set({ intToSymbol: { ...defaultSymbols } }),
})
);