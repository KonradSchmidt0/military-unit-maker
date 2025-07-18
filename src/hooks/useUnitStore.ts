import { create } from 'zustand';
import { createNewOrgUnit, createNewRawUnit, Unit } from '../logic/logic';
import { addChild, removeChild } from '../logic/childManaging';

export interface UnitMap {
  [id: string]: Unit;
}

interface UnitStore {
  unitMap: UnitMap;
  updateUnit: (id: string, newUnit: Unit) => void;
  setUnitMap: (map: UnitMap) => void;
  duplicateUnit: (id: string) => string;
  addOrSubtractChild: (parentId: string, childId: string, count: number) => void;
  creatNewChild: (parentId: string, type: "raw" | "org") => string;
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

  addOrSubtractChild: (parentId, childId, count) => {
    const unitMap = get().unitMap;
    const parent = unitMap[parentId]
    if (!parent) {
      console.warn(`No unit of id = ${parentId} fount`); return;
    }
    if (parent.type === "raw") {
      console.warn(`Cant add child to rawUnit ${parentId}`); return;
    }

    if (count === 0) {
      console.warn(`Count = 0. Are you sure everything ok?`); return;
    }

    const func = count > 0 ? addChild : removeChild;
    const parentUpdated = func(parent, childId, Math.abs(count))
    get().updateUnit(parentId, parentUpdated)
  },

  creatNewChild: (parentId, type) => {
    const parent = get().unitMap[parentId]

    const childInput = {layers: parent.layers, echelonLevel: Math.max(0, parent.echelonLevel - 1), smartColor: "inheret"}
    const child = type === "org" ? createNewOrgUnit(childInput) : createNewRawUnit(childInput)
    const childId = crypto.randomUUID()
    get().updateUnit(childId, child)
    get().addOrSubtractChild(parentId, childId, 1)
    return childId
  }
}));

// The likely hood that id is not corrent is close to zero
// This was originaly always returning Unit, and throwing an error if it was incorect, but
// React really hates when you conditionally call hooks. So no "If was given UnitId: useUnitQuick"
// As such, you just use this hook and then check if it gives back a undef
export function useUnitQuick(id: string): Unit | undefined {
  const unit = useUnitStore((state) => state.unitMap[id]);
  return unit
}