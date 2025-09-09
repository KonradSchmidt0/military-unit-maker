import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TextOptionStore {
  shouldAllTextDisplay: boolean;
  shouldUnitTypeNameDisplay: boolean;

  setOptions: (options: Partial<TextOptionStore>) => void;
}

export const useTextOptionStore = create<TextOptionStore>()(
  persist(
    (set) => ({
      shouldAllTextDisplay: true,
      shouldUnitTypeNameDisplay: true,

      setOptions: (options) => set((state) => ({ ...state, ...options })),
    }),
    {
      name: "text-option-store", // 🔑 key in localStorage
    }
  )
);
