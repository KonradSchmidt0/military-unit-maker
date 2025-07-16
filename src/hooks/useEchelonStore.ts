import { create } from "zustand";

type EchelonSymbolMap = {
  [level: number]: string;
};

interface EchelonStore {
  intToSymbol: EchelonSymbolMap;
  setSymbol: (level: number, symbol: string) => void;
  resetSymbols: () => void;
}

const defaultSymbols: EchelonSymbolMap = {
  0: "ø",            
  1: "o",            // Squad
  2: "oo",           // 
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
  13: "" // For when user wants to have unspecify
};

export const useEchelonStore = create<EchelonStore>((set) => ({
  intToSymbol: { ...defaultSymbols },

  setSymbol: (level, symbol) =>
    set((state) => ({
      intToSymbol: {
        ...state.intToSymbol,
        [level]: symbol,
      },
    })),

  resetSymbols: () => set({ intToSymbol: { ...defaultSymbols } }),
}));
