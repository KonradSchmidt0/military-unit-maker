import { create } from 'zustand';
import { UnitMap } from './useUnitStore';

interface PaletStore {
  unitPalet: string[];
  setUnitPalet: (newPalet: string[]) => void;
  addUnitToPalet: (unitId: string) => void;
  removeUnitFromPalet: (unitId: string) => void;
}

export const usePaletStore = create<PaletStore>((set) => ({
  unitPalet: [],

  setUnitPalet: (newPalet) => set({ unitPalet: newPalet }),

  addUnitToPalet: (unitId) =>
    set((state) => ({
      unitPalet: state.unitPalet.includes(unitId) 
        ? state.unitPalet 
        : [...state.unitPalet, unitId],
    })),

  removeUnitFromPalet: (unitId) =>
    set((state) => ({
      unitPalet: state.unitPalet.filter((id) => id !== unitId),
    })),
}));

export function GetUnitPaletAsUnitMap(unitPalet: string[], unitMap: UnitMap): UnitMap {
  const paletSet = new Set(unitPalet);

  return Object.fromEntries(
    Object.entries(unitMap).filter(([id]) => paletSet.has(id))
  );
}