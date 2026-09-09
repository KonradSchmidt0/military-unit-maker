import { create } from 'zustand';
import { createNewOrgUnit, createNewRawUnit, OrgUnit, Unit } from '../logic/Units/logic';
import { SmartColor } from "../logic/Units/unitColorManaging";
import { addChild, moveChild, removeChildEntry, subtractChild, setChildCount, setChildEntryId } from '../logic/Units/childManaging';
import { temporal } from 'zundo'
import { createRawUnitWithFractionOfEquipment } from '../logic/Units/unitConversion';
import { getEquipmentTable } from '../logic/Items/itemListing';
import { GetChildIdFromPath } from '../logic/Units/childGetting';

export interface UnitMap {
  [id: string]: Unit;
}

interface UnitStore {
  unitMap: UnitMap;
  setUnitMap: (map: UnitMap) => void;
  updateUnit: (id: string, newUnit: Unit) => void;
  duplicateUnit: (id: string) => string;
  addOrSubtractChild: (parentId: string, childId: string, count: number) => void;
  creatNewChild: (parentId: string, type: "raw" | "org", addUnitToPalet?: Function) => string;
  removeChildType: (parentId: string, childId: string) => void;
  changeChildCount: (parentId: string, childId: string, newCount: number) => void;
  changeChildId: (parentId: string, oldId: string, newId: string) => void;
  moveChildPos: (parentId: string, childId: string, destination: "top" | "bottom") => void,
  splitRawUnit: (parentId: string, childCount: number, addUnitToPalet?: Function) => string,
  addNewChild: (parentId: string, childId: string) => void,
  consolidateOrgUnit: (id: string) => void,
  setInnerTexts: (id: string, shortName?: string, desc?: string) => void,

  getCurrentRootId: (trueId: string, actingPath: number[], map: UnitMap, phase: number) => string | undefined;
  trueRootId: string;
  setTrueRootId: (newRootId: string) => void;
  actingRootPath: number[];
  setActingRootPath: (n: number[]) => void;
  popNewTrueRoot: (setSelect: Function, offsetSelect: Function, setNewRootAsParent?: boolean) => void;
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

      const func = count > 0 ? addChild : subtractChild;
      const parentUpdated = func(parent, childId, Math.abs(count))

      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [parentId]: parentUpdated,
        },
      }))
    },

    creatNewChild: (parentId, type, addUnitToPalet) => {
      const parent = get().unitMap[parentId]

      const childInput = {layers: parent.layers, echelonLevel: Math.max(0, parent.echelonLevel - 1), smartColor: "inheret" as SmartColor}
      const child = type === "org" ? createNewOrgUnit(childInput) : createNewRawUnit(childInput)
      const childId = crypto.randomUUID()
      const parentWithNewChild = addChild(parent as OrgUnit, childId)

      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [childId]: child,
          [parentId]: parentWithNewChild,
        },
      }))
      if (addUnitToPalet) {
        addUnitToPalet(childId)
      }
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
      const parentUpdated = removeChildEntry(parent, childId)
      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [parentId]: parentUpdated,
        },
      }))
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
      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [parentId]: parentUpdated,
        },
      }))
    },

    changeChildId(parentId, oldId, newId) {
      const unitMap = get().unitMap;
      const parent = unitMap[parentId]
      if (!parent) {
        console.warn(`No unit of id = ${parentId} found`); return;
      }
      if (parent.type === "raw") {
        console.warn(`Cant change child in rawUnit ${parentId}`); return;
      }

      const parentUpdated = setChildEntryId(parent, oldId, newId)
      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [parentId]: parentUpdated,
        },
      }))
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

      const parentUpdated = moveChild(parent, childId, destination)
      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [parentId]: parentUpdated,
        },
      }))
    },


    splitRawUnit: (newMadeParentId, childCount, addUnitToPalet) => {
      const unitMap = get().unitMap;
      const parent = unitMap[newMadeParentId]
      if (!parent) {
        console.warn(`No unit of id = ${newMadeParentId} found`); return "-1";
      }
      if (parent.type !== "raw") {
        console.warn(`Cant split allready splited unit ${newMadeParentId}`); return "-1";
      }

      // Create new unit (the baby)
      const eq = parent.equipment;
      const baby = createRawUnitWithFractionOfEquipment(parent, eq, childCount);
      const babyId = crypto.randomUUID()
      get().updateUnit(babyId, baby)

      // Swap parent
      const updatedParent: OrgUnit = {
        type: "org",
        name: parent.name,
        smartColor: parent.smartColor,
        echelonLevel: parent.echelonLevel,
        layers: [...parent.layers],
        children: [{id: babyId, count: childCount}],
        childrenMods: [],
        flatCallSigns: {},
        flatDescriptions: {}
      };
      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [newMadeParentId]: updatedParent,
        },
      }))

      if (addUnitToPalet) {
        addUnitToPalet(babyId)
      }

      // Return baby id
      return babyId
    },


    addNewChild: (parentId, childId) => {
      const parent = get().unitMap[parentId]
      if (parent.type !== "org")
        return
      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [parentId]: addChild(parent, childId, 1)
        },
      }))
    },


    consolidateOrgUnit: (id: string) => {
      const um = get().unitMap
      const unit = um[id] as OrgUnit
      const eq = getEquipmentTable(id, um, 0)
      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [id]: {...unit, type: "raw", equipment: eq},
        },
      }))
    },

    setInnerTexts: (id, shortName, desc) => {
      const um = get().unitMap
      const unit = um[id]
      set((state) => ({
        unitMap: {
          ...state.unitMap,
          [id]: {...unit, name: shortName ?? unit.name, desc: desc ?? unit.desc},
        },
      }))
    },



    trueRootId: "infatry_oo",
    actingRootPath: [],
  
    getCurrentRootId(trueId, actingPath, map, phase) {
      return GetChildIdFromPath(trueId, actingPath, map, phase);
    },
  
    setTrueRootId: (n) => {set({ trueRootId: n });},
    setActingRootPath: (n) => set({ actingRootPath: n }),
  
    popNewTrueRoot: (setSelect, offsetSelect, setNewRootAsParent) => {
      const oldRootId = get().trueRootId
      const oldRoot = get().unitMap[oldRootId]
      const newRootId = crypto.randomUUID()

      const newRoot: OrgUnit = { 
        ...oldRoot,
        type: "org", name: "", echelonLevel: oldRoot.echelonLevel + 1,
        children: [{id: oldRootId, count: 1}],
        childrenMods: [],
        flatCallSigns: {},
        flatDescriptions: {},
        desc: ""
      }
      
      if (!setNewRootAsParent)
        setSelect([])
      else
        offsetSelect()
      
      set((state) => ({
        trueRootId: newRootId,
        unitMap: {
          ...state.unitMap,
          [newRootId]: newRoot,
        },
      }))
  
    },
  }))
)