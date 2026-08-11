import { create } from 'zustand';
import { UnitMap } from './useUnitStore';

export interface UnitDropdownStore {
  callDropDown: (onChosen?: Function, pos?: { top: number, left: number }, options?: UnitMap) => void;
  onChosen?: Function;
  pos: { top: number, left: number }
  options?: UnitMap
}

export const useUnitDropdownStore = create<UnitDropdownStore>((set, get) => ({
  onChosen: undefined,
  pos: {top: 100, left: 100},
  options: {},
  callDropDown(onChosen, pos, options) {
    set({onChosen: onChosen, pos: pos, options: options})
  }
}));