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


export const useUnitStore = create<UnitStore>((set) => ({
  unitMap: {},
  setUnitMap: (map) => set({ unitMap: map }),
  updateUnit: (id, newUnit) =>
    set((state) => ({
      unitMap: {
        ...state.unitMap,
        [id]: newUnit,
      },
    })),
  duplicateUnit: (id: string) => {
    const unit = getUnitQuick(id);

    const newId = crypto.randomUUID()
    const newUnit = structuredClone(unit);
    newUnit.name += ' (Copy)';

    // Add it to the map
    set((state) => ({
      unitMap: {
        ...state.unitMap,
        [newId]: newUnit,
      },
    }));

    return newId;
  },
}));

export const updateUnit = useUnitStore.getState().updateUnit;
export const getUnitMap = () => useUnitStore.getState().unitMap;
export const useDuplicateUnit = () => {
  // Just get the function from the store, no parameters here
  return useUnitStore((state) => state.duplicateUnit);
};


export function getUnitQuick(id: string, errMessage = "Error! Unit with this id not found :("): Unit {
  const unit = useUnitStore.getState().unitMap[id];

  if (!unit) {
    throw new Error(`${errMessage}   (id = ${id})`);
  }

  return unit
}

export function useUnitQuick(id: string, errMessage = "Error! Unit with this id not found :("): Unit {
  const unit = useUnitStore((state) => state.unitMap[id]);

  if (!unit) {
    throw new Error(`${errMessage}   (id = ${id})`);
  }

  return unit
}