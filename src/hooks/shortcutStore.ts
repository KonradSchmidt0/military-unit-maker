import { create } from "zustand";

interface ShortcutStore {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  meta: boolean;

  setModifiers: (mods: Partial<Pick<ShortcutStore, 'shift' | 'ctrl' | 'alt' | 'meta'>>) => void;
}

export const useShortcutStore = create<ShortcutStore>((set) => ({
  shift: false,
  ctrl: false,
  alt: false,
  meta: false,

  setModifiers: (mods) => set(mods),
}));
