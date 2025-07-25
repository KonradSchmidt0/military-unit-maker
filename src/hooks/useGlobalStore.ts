import { create } from 'zustand';

interface GlobalStore {
  echelonFoldingLevel: number;
  setEchelonFoldingLevel: (n: number) => void;
  foldingDepth: number
  setFoldingDepth: (n: number) => void;
  displayParentBox: boolean;
  setDisplayParentBox: (b: boolean) => void;
  isGlobalMini: boolean;
  setIsGlobalMini: (b: boolean) => void;
  isPalletMini: boolean;
  setIsPalletMini: (b: boolean) => void;
  isChangeLogMini: boolean;
  setIsChangeLogMini: (b: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  echelonFoldingLevel: 0,
  setEchelonFoldingLevel: (n) => set({echelonFoldingLevel: n }),
  foldingDepth: 3,
  setFoldingDepth: (n) => set({foldingDepth: n}),
  displayParentBox: false,
  setDisplayParentBox: (b) => set({displayParentBox: b}),
  isGlobalMini: true,
  setIsGlobalMini: (b) => set({isGlobalMini: b}),
  isPalletMini: true,
  setIsPalletMini: (b) => set({isPalletMini: b}),
  isChangeLogMini: true,
  setIsChangeLogMini: (b) => set({isChangeLogMini: b}),
}));