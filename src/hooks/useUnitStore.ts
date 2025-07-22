import { create } from 'zustand';
import { ChildrenList, createNewOrgUnit, createNewRawUnit, OrgUnit, SmartColor, Unit } from '../logic/logic';
import { addChild, moveChild, removeAllOfAChild, removeChild, setChildCount, setChildId } from '../logic/childManaging';
import { temporal } from 'zundo'

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
  removeChildType: (parentId: string, childId: string) => void;
  changeChildCount: (parentId: string, childId: string, newCount: number) => void;
  changeChildId: (parentId: string, oldId: string, newId: string) => void;
  moveChildPos: (parentId: string, childId: string, destination: "top" | "bottom") => void,

  rootId: string;
  setRootId: (newRootId: string) => void;
  popNewRoot: (setSelected: Function, setParent: Function, setNewRootAsParent?: boolean) => void;
}


export const useUnitStore = create<UnitStore>()(
  temporal((set, get) => ({
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

      const childInput = {layers: parent.layers, echelonLevel: Math.max(0, parent.echelonLevel - 1), smartColor: "inheret" as SmartColor}
      const child = type === "org" ? createNewOrgUnit(childInput) : createNewRawUnit(childInput)
      const childId = crypto.randomUUID()
      get().updateUnit(childId, child)
      get().addOrSubtractChild(parentId, childId, 1)
      return childId
    },

    removeChildType: (parentId, childId) => {
      const unitMap = get().unitMap;
      const parent = unitMap[parentId]
      if (!parent) {
        console.warn(`No unit of id = ${parentId} fount`); return;
      }
      if (parent.type === "raw") {
        console.warn(`Cant add child to rawUnit ${parentId}`); return;
      }
      const parentUpdated = removeAllOfAChild(parent, childId)
      get().updateUnit(parentId, parentUpdated)
    },

    changeChildCount: (parentId, childId, newCount) => {
      const unitMap = get().unitMap;
      const parent = unitMap[parentId]
      if (!parent) {
        console.warn(`No unit of id = ${parentId} found`); return;
      }
      if (parent.type === "raw") {
        console.warn(`Cant add child to rawUnit ${parentId}`); return;
      }
      const parentUpdated = setChildCount(parent, childId, newCount)
      get().updateUnit(parentId, parentUpdated)
    },

    changeChildId(parentId, oldId, newId) {
      const unitMap = get().unitMap;
      const parent = unitMap[parentId]
      if (!parent) {
        console.warn(`No unit of id = ${parentId} found`); return;
      }
      if (parent.type === "raw") {
        console.warn(`Cant add child to rawUnit ${parentId}`); return;
      }

      const parentUpdated = setChildId(parent, oldId, newId)
      get().updateUnit(parentId, parentUpdated)
    },

    moveChildPos: (parentId, childId, destination) => {
      const unitMap = get().unitMap;
      const parent = unitMap[parentId]
      if (!parent) {
        console.warn(`No unit of id = ${parentId} found`); return;
      }
      if (parent.type === "raw") {
        console.warn(`Cant add child to rawUnit ${parentId}`); return;
      }

      const np = moveChild(parent, childId, destination)
      get().updateUnit(parentId, np)
    },
    
    rootId: "",
    setRootId: (newRootId) => set({ rootId: newRootId }),
  
    popNewRoot: (setSelected, setParent, setNewRootAsParent) => {
      const oldRootId = get().rootId
      const oldRoot = get().unitMap[oldRootId]
      const newRootId = crypto.randomUUID()
      // No idea why, but when i do it as children: {rootUnitId : 1} it reads rootUnitId as a string of value "rootUnitId"
      let c: ChildrenList = { }; c[oldRootId] = 1;
      const newRoot: OrgUnit = { 
        ...oldRoot,
        type: "org", name: "New Root Unit", echelonLevel: oldRoot.echelonLevel + 1,
        children: c
      }
      
      if (!setNewRootAsParent)
        setSelected(newRootId)
      else
        setParent(newRootId)
      get().updateUnit(newRootId, newRoot)
      get().setRootId(newRootId)
  
    },
  }))
)

// The likely hood that id is not corrent is close to zero
// This was originaly always returning Unit, and throwing an error if it was incorect, but
// React really hates when you conditionally call hooks. So no "If was given UnitId: useUnitQuick"
// As such, you just use this hook and then check if it gives back a undef
export function useUnitQuick(id: string): Unit | undefined {
  const unit = useUnitStore((state) => state.unitMap[id]);
  return unit
}