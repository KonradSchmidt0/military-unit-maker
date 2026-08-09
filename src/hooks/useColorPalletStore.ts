import { create } from "zustand"
import { defaultUnitColor } from "../logic/Units/logic"

export interface ColorProfile {
  uId: string
  color: `#${string}`
  name: string
}

export type ColorMap = ColorProfile[]

export const defaultColorMap: ColorMap = [
  {uId: "1", color: "#5baa5b", name: "BO Infantry"},
  {uId: "2", color: "#ffd00b", name: "BO Armor"},
  {uId: "3", color: "#ff3333", name: "BO Artillery"},
  {uId: "4", color: "#a2e3e8", name: "BO Aviation"},
  {uId: "5", color: "#d87600", name: "BO Service"},
  {uId: "6", color: "#f7f7f7", name: "BO Support"},
  {uId: "7", color: "#333fff", name: "Blue"},
  {uId: "8", color: "#a333ff", name: "Purple"},
]

interface ColorPaletStore {
  colorMap: ColorMap
  add: (a: ColorProfile) => void
  changeAtIndex: (index: number, change: (entry: ColorProfile) => ColorProfile) => void
  removeAtIndex: (index: number) => void
}

export const useColorPalletStore = create<ColorPaletStore>((set) => ({
  colorMap: [...defaultColorMap],

  add(a) {
    set((state) => ({
      colorMap: [...state.colorMap, a]
    }))
  },

  changeAtIndex(index, change) {
    set((state) => ({
      colorMap: state.colorMap.map((entry, i) =>
        i === index ? change(entry) : entry
      ),
    }))
  },

  removeAtIndex(index) {
    set((state) => ({
      colorMap: state.colorMap.filter((_, i) => i !== index)
    }))
  },
}))

export function getColorFromColorMap(index: number, colorMap: ColorMap): `#${string}` {
  if (colorMap.length < index) {
    return defaultUnitColor
  }
  return colorMap[index].color
}