import { create } from "zustand";

interface ShortcutStore {
  isShiftHeld: boolean;
  isCtrlHeld: boolean;
  isAltHeld: boolean;
  isMetaHeld: boolean;

  setModifiers: (mods: Partial<Pick<ShortcutStore, 'isShiftHeld' | 'isCtrlHeld' | 'isAltHeld' | 'isMetaHeld'>>) => void;
}

export const useShortcutStore = create<ShortcutStore>((set) => ({
  isShiftHeld: false,
  isCtrlHeld: false,
  isAltHeld: false,
  isMetaHeld: false,

  setModifiers: (mods) => set(mods),
}));
