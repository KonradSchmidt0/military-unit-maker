import { create } from 'zustand';
import { Unit } from '../logic/logic';

export interface UnitMap {
  [id: string]: Unit;
}

interface UnitStore {
  unitMap: UnitMap;
  updateUnit: (id: string, newUnit: Unit) => void;
  setUnitMap: (map: UnitMap) => void;
  duplicateUnit: (id: string) => string;
}


export const useUnitStore = create<UnitStore>((set, get) => ({
  unitMap: {},

  updateUnit: (id, newUnit) =>
    set((state) => ({
      unitMap: {
        ...state.unitMap,
        [id]: newUnit,
      },
    })),

  setUnitMap: (map) => set({ unitMap: map }),

  duplicateUnit: (id: string) => {
    const unitMap = get().unitMap;
    const unit = unitMap[id];
    if (!unit) return "";

    const newId = crypto.randomUUID();
    const newUnit = structuredClone(unit);
    newUnit.name += " (Copy)";

    set((state) => ({
      unitMap: {
        ...state.unitMap,
        [newId]: newUnit,
      },
    }));

    return newId;
  },
}));


export const useDuplicateUnit = () => {
  // Just get the function from the store, no parameters here
  return useUnitStore((state) => state.duplicateUnit);
};

// The likely hood that id is not corrent is close to zero
// This was originaly always returning Unit, and throwing an error if it was incorect, but
// React really hates when you conditionally call hooks. So no "If was given UnitId: useUnitQuick"
// As such, you just use this hook and then check if it gives back a undef
export function useUnitQuick(id: string): Unit | undefined {
  const unit = useUnitStore((state) => state.unitMap[id]);
  return unit
}