import { create } from 'zustand';

interface GlobalStore {
  echelonFoldingLevel: number;
  setEchelonFoldingLevel: (n: number) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  echelonFoldingLevel: 0,
  setEchelonFoldingLevel: (n) => set({echelonFoldingLevel: n })
}));