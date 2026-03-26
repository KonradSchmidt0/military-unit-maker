import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GlobalStore {
  echelonFoldingLevel: number;
  setEchelonFoldingLevel: (n: number) => void;
  foldingDepth: number;
  setFoldingDepth: (n: number) => void;
  displayParentBox: boolean;
  setDisplayParentBox: (b: boolean) => void;
  isGlobalMini: boolean;
  setIsChangeLogMini: (b: boolean) => void;
  stacking: boolean;
  setStacking: (b: boolean) => void;

  setIsGlobalMini: (b: boolean) => void;
  isPalletMini: boolean;
  setIsPalletMini: (b: boolean) => void;
  isChangeLogMini: boolean;
  setIsItemManagerMini: (b: boolean) => void;
  isItemManagerMini: boolean
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      echelonFoldingLevel: 0,
      setEchelonFoldingLevel: (n) => set({ echelonFoldingLevel: n }),
      foldingDepth: 3,
      setFoldingDepth: (n) => set({ foldingDepth: n }),
      displayParentBox: false,
      setDisplayParentBox: (b) => set({ displayParentBox: b }),
      stacking: false,
      setStacking: (b) => set({ stacking: b }),
      isChangeLogMini: true,
      setIsChangeLogMini: (b) => set({ isChangeLogMini: b }),

      isGlobalMini: true,
      setIsGlobalMini: (b) => set({ isGlobalMini: b }),
      isPalletMini: true,
      setIsPalletMini: (b) => set({ isPalletMini: b }),
      isItemManagerMini: true,
      setIsItemManagerMini: (b) => set({ isItemManagerMini: b }),
    }),
    {
      name: "global-store", // 🔑 key for localStorage
    }
  )
);
