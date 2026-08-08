import { create } from "zustand"
import { defaultUnitColor } from "../logic/Units/logic"

export interface ColorProfile {
  color: `#${string}`
  name: string
}

export type ColorMap = ColorProfile[]

interface ColorPaletStore {
  colorMap: ColorMap
}

export const useColorPalletStore = create<ColorPaletStore>((set) => ({
  colorMap: [
    {color: "#5baa5b", name: "Battle Order Infantry"},
    {color: "#ffd00b", name: "Battle Order Armor"},
    {color: "#ff3333", name: "Battle Order Artillery"},
    {color: "#a2e3e8", name: "Battle Order Aviation"},
    {color: "#d87600", name: "Battle Order Service"},
    {color: "#f7f7f7", name: "Battle Order Support"},
    {color: "#333fff", name: "Blue"},
    {color: "#a333ff", name: "Purple"},
  ],
}))

export function getColorFromColorMap(index: number, colorMap: ColorMap): `#${string}` {
  if (colorMap.length < index) {
    return defaultUnitColor
  }
  return colorMap[index].color
}