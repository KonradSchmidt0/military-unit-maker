import { UnitMap } from "../../hooks/useUnitStore";
import { SmartColor } from "./unitColorManaging";

export type EquipmentType = string;
export type EquipmentTable = Record<EquipmentType, number>;

export interface ChildEntry {
  id: string
  count: number
}
export interface ChildMod {
  phase: number
  childId: string
  mod: number
}

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

  children: ChildEntry[]
  childrenMods: ChildMod[]

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
  children?: ChildEntry[];
} = {}): OrgUnit {
  return {
    type: "org",
    name,
    layers,
    smartColor,
    echelonLevel,
    children: children,
    childrenMods: [],
    flatCallSigns: {},
    flatDescriptions: {}
  };
}

export function GetChildren(unit: Unit, phase: number): ChildEntry[] {
  if (unit.type === "raw")
    return []

  const getModdedEntry = (childEntry: ChildEntry) => {
    let childCount = childEntry.count
    unit.childrenMods
      .filter((mod) => mod.childId === childEntry.id && mod.phase === phase)
      .forEach((mod) => childCount += mod.mod)

    return {...childEntry, count: childCount}
  }
  
  return unit.children.map((childEntry) => getModdedEntry(childEntry))
}

export function GetChildEntry(unit: Unit, phase: number, childId: string) {
  const children = GetChildren(unit, phase)
  const o = children.find((entry) => entry.id === childId)

  return o
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
  const children = GetChildren(parent, phase)

  children.forEach( (childEntry) => {
    const {id, count} = childEntry

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
