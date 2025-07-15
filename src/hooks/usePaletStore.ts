import { create } from 'zustand';

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
