import { UnitMap } from "../../hooks/useUnitStore";
import { SmartColor } from "./unitColorManaging";

export type EquipmentType = string;
export type EquipmentTable = Record<EquipmentType, number>;

export interface ChildEntry {
  id: string
  count: number
}
export type Phase2ChildEntry = ChildEntry[]
export type ChildrenList = Phase2ChildEntry[]

export interface RawUnit {
  type: "raw";
  name: string;
  smartColor: SmartColor;
  echelonLevel: number;
  layers: string[];

  equipment: EquipmentTable;

  desc?: string;
}

export interface OrgUnit {
  type: "org";
  name: string;
  smartColor: SmartColor;
  echelonLevel: number;
  layers: string[];

  childList: ChildrenList // First is UnitId, second is count of how many

  desc?: string;
  flatCallSigns: Record<number, string>
  flatDescriptions: Record<number, string>
}


export type Unit = RawUnit | OrgUnit;


export function createNewRawUnit({
  name = "",
  layers = [],
  echelonLevel = 0,
  smartColor = "inheret",
  eq = {},
}: {
  name?: string;
  layers?: string[];
  echelonLevel?: number;
  smartColor?: SmartColor;
  eq?: EquipmentTable;
} = {}): RawUnit {
  return {
    type: "raw",
    name,
    layers,
    smartColor,
    echelonLevel,
    equipment: eq,
  };
}


export function createNewOrgUnit({
  name = "",
  layers = [],
  echelonLevel = 0,
  smartColor = "inheret",
  children = [],
}: {
  name?: string;
  layers?: string[];
  echelonLevel?: number;
  smartColor?: SmartColor;
  children?: ChildrenList;
} = {}): OrgUnit {
  return {
    type: "org",
    name,
    layers,
    smartColor,
    echelonLevel,
    childList: children,
    flatCallSigns: {},
    flatDescriptions: {}
  };
}


export function HowManyOfThisTypeInParent(
  parentId: string,
  searchedId: string,
  unitMap: UnitMap,
  phase: number
): number {
  const parent = unitMap[parentId]
  if (parent.type === "raw") return 0;

  let total = 0

  parent.childList.forEach( (phase2Entry) => {
    const {id, count} = phase2Entry[phase]

    if (id === searchedId) {
      total += count;
    }

    const nested = unitMap[id];
    if (nested && nested.type === "org") {
      total += HowManyOfThisTypeInParent(id, searchedId, unitMap, phase) * count;
    }
  } )

  return total;
}

// TODO: move to child managing
export function removeEquipmentTypeRecursively(
  unit: Unit,
  equipmentTypeToRemove: EquipmentType,
  unitMap: UnitMap,
  phase: number
): Unit {
  if (unit.type === "raw") {
    let newEquipment = { ...unit.equipment };
    delete newEquipment[equipmentTypeToRemove];
    return { ...unit, equipment: newEquipment };
  }

  // If it's an OrgUnit, recursively process its children
  const newChildren = unit.childList.map( (phase2Entry) => {
    const entry = phase2Entry[phase]
    const child = unitMap[entry.id]

    const updatedChild = removeEquipmentTypeRecursively(
      child,
      equipmentTypeToRemove,
      unitMap,
      phase
    );

    unitMap[entry.id] = updatedChild; // Update in place
    return {...entry, id: }
  } )

  return { ...unit, childList: newChildren };
}