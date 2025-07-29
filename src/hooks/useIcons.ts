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
    set({dropDown_onChosen: onChosen, dropdown_pos: pos?? {top: 100, left: 100}})
  }
}))