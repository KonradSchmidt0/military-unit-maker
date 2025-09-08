import { create } from 'zustand';
import { ChildrenList, createNewOrgUnit, createNewRawUnit, getEquipmentTable, OrgUnit, SmartColor, Unit } from '../logic/logic';
import { addChild, GetChildIdFromPath, moveChild, removeAllOfAChild, removeChild, setChildCount, setChildId } from '../logic/childManaging';
import { temporal } from 'zundo'
import { createRawUnitWithFractionOfEquipment } from '../logic/unitConversion';

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

  getCurrentRootId: (trueId: string, actingPath: number[], map: UnitMap) => string | undefined;
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

    creatNewChild: (parentId, type, addUnitToPalet) => {
      const parent = get().unitMap[parentId]

      const childInput = {layers: parent.layers, echelonLevel: Math.max(0, parent.echelonLevel - 1), smartColor: "inheret" as SmartColor}
      const child = type === "org" ? createNewOrgUnit(childInput) : createNewRawUnit(childInput)
      const childId = crypto.randomUUID()
      get().updateUnit(childId, child)
      get().addOrSubtractChild(parentId, childId, 1)
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
        console.warn(`Cant change child in rawUnit ${parentId}`); return;
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
        children: { [babyId]: childCount },
        flatCallSigns: {},
        flatDescriptions: {}
      };
      get().updateUnit(newMadeParentId, updatedParent);

      if (addUnitToPalet) {
        addUnitToPalet(babyId)
      }

      // Return baby id
      return babyId
    },


    addNewChild: (parentId, childId) => {
      const parent = get().unitMap[parentId] as OrgUnit
      const newChildren = {...parent.children, [childId]: 1}
      get().updateUnit(parentId, {...parent, children: newChildren});
    },


    consolidateOrgUnit: (id: string) => {
      const um = get().unitMap
      const unit = um[id] as OrgUnit
      const eq = getEquipmentTable(id, um)
      get().updateUnit(id, {...unit, type: "raw", equipment: eq})
    },

    setInnerTexts: (id, shortName, desc) => {
      const um = get().unitMap
      const unit = um[id]
      get().updateUnit(id, {...unit, name: shortName ?? unit.name, desc: desc ?? unit.desc})
    },



    trueRootId: "infatry_oo",
    actingRootPath: [],
  
    getCurrentRootId(trueId, actingPath, map) {
      return GetChildIdFromPath(trueId, actingPath, map);
    },
  
    setTrueRootId: (n) => {set({ trueRootId: n });},
    setActingRootPath: (n) => set({ actingRootPath: n }),
  
    popNewTrueRoot: (setSelect, offsetSelect, setNewRootAsParent) => {
      const oldRootId = get().trueRootId
      const oldRoot = get().unitMap[oldRootId]
      const newRootId = crypto.randomUUID()
      // No idea why, but when i do it as children: {rootUnitId : 1} it reads rootUnitId as a string of value "rootUnitId"
      let c: ChildrenList = { }; c[oldRootId] = 1;
      const newRoot: OrgUnit = { 
        ...oldRoot,
        type: "org", name: "New Root Unit", echelonLevel: oldRoot.echelonLevel + 1,
        children: c,
        flatCallSigns: {},
        flatDescriptions: {},
        desc: ""
      }
      
      if (!setNewRootAsParent)
        setSelect([])
      else
        offsetSelect()
      
      get().updateUnit(newRootId, newRoot)
      get().setTrueRootId(newRootId)
  
    },
  }))
)