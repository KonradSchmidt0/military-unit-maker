import { create } from "zustand";

export interface IconEntry {
  filename: string;
  tags: string;
}

interface iconsStore {
  icons: IconEntry[];
  setIcons: (n: IconEntry[]) => void;

  callDropDown: (onChosen?: Function, pos?: { top: number, left: number }) => void;
  dropDown_onChosen?: Function;
  dropdown_pos: { top: number, left: number }
}

export const useIconsStore = create<iconsStore>((set) => ({
  icons: [],
  setIcons: (n) => set({icons: n}),
  
  dropDown_onChosen: undefined,
  dropdown_pos: {top: 100, left: 100},
  callDropDown(onChosen, pos) {
    /// The dropdown menu can overflow, breaking the height and/or width limits of our page
    /// Solution: Clamp it

    const padding = 8
    // Crued measurings, but suffice
    const approximateHeight = 280
    const approximateWidth = 288

    const t = pos ? Math.min(pos.top, window.innerHeight - approximateHeight - padding) : 0
    const l = pos ? Math.min(pos.left - approximateWidth / 2, window.innerWidth - approximateWidth - padding) : 0

    set({dropDown_onChosen: onChosen, dropdown_pos: {top: t, left: Math.max(l, padding)}})
  }
}))