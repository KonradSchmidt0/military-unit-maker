import { create } from 'zustand';
import { UnitMap } from './useUnitStore';

export interface UnitDropdownStore {
  callDropDown: (onChosen?: Function, pos?: { top: number, left: number }, options?: UnitMap) => void;
  onChosen?: Function;
  pos: { top: number, left: number }
  options: UnitMap
}

export const useUnitDropdownStore = create<UnitDropdownStore>((set, get) => ({
  onChosen: undefined,
  pos: {top: 100, left: 100},
  options: {},
  callDropDown(onChosen, pos, options) {
    /// The dropdown menu can overflow, breaking the height and/or width limits of our page
    /// Solution: Clamp it

    const padding = 8
    // Crued measurings, but suffice
    const approximateHeight = 280
    const approximateWidth = 288

    const t = pos ? Math.min(pos.top, window.innerHeight - approximateHeight - padding) : 0
    const l = pos ? Math.min(pos.left - approximateWidth / 2, window.innerWidth - approximateWidth - padding) : 0

    set({onChosen: onChosen, pos: {top: t, left: Math.max(l, padding)}, options: options})
  }
}));