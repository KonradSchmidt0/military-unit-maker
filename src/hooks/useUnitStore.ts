import { create } from 'zustand';
import { Unit } from '../logic/logic'; // Adjust path to your Unit type

export interface UnitMap {
  [id: string]: Unit;
}

interface UnitStore {
  unitMap: UnitMap;
  selectedUnitId: string | null;
  setSelectedUnitId: (id: string | null) => void;
  updateUnit: (id: string, newUnit: Unit) => void;
  setUnitMap: (map: UnitMap) => void;
}

export const useUnitStore = create<UnitStore>((set) => ({
  unitMap: {},
  selectedUnitId: null,
  setSelectedUnitId: (id) => set({ selectedUnitId: id }),
  setUnitMap: (map) => set({ unitMap: map }),
  updateUnit: (id, newUnit) =>
    set((state) => ({
      unitMap: {
        ...state.unitMap,
        [id]: newUnit,
      },
    })),
}));

export const updateUnit = useUnitStore.getState().updateUnit;
export const setSelectedUnitId = useUnitStore.getState().setSelectedUnitId;
export const getUnitMap = () => useUnitStore.getState().unitMap;

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