import { create } from "zustand";

interface TextOptionStore {
  shouldAllTextDisplay: boolean;
  shouldUnitTypeNameDisplay: boolean;

  setOptions: (
    options: Partial<
      Pick<TextOptionStore, "shouldAllTextDisplay" | "shouldUnitTypeNameDisplay">
    >
  ) => void;
}

export const useTextOptionStore = create<TextOptionStore>((set) => ({
  shouldAllTextDisplay: true,
  shouldUnitTypeNameDisplay: true,

  setOptions: (options) => set(options),
}));
