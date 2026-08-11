import { create } from "zustand"

interface ColorPalletDropdownStore {
  onChosen?: (chosenIndex: number) => void
  pos?: {top: number, left: number}

  CallColorDropdown: (onChosen?: (chosenIndex: number) => void, pos?: {top: number, left: number}) => void
}

export const useColorPalletDropdownStore = create<ColorPalletDropdownStore>((set) => ({
  onChosen: undefined,
  pos: undefined,
  CallColorDropdown(onChosen, pos) {
    set({onChosen: onChosen, pos: pos})
  }
}))