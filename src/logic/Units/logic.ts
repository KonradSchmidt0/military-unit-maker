import { UnitMap } from "../../hooks/useUnitStore";
import { SmartColor } from "./unitColorManaging";

export type EquipmentType = string;
export type EquipmentTable = Record<EquipmentType, number>;
export type ChildrenList = Record<string, number>

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

  children: ChildrenList // First is UnitId, second is count of how many

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
  children = {},
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
    children,
    flatCallSigns: {},
    flatDescriptions: {}
  };
}


export function HowManyOfThisTypeInParent(
  parentId: string,
  searchedId: string,
  unitMap: UnitMap
): number {
  const parent = unitMap[parentId]
  if (parent.type === "raw") return 0;

  let total = 0

  for (const [childId, count] of Object.entries(parent.children)) {
    if (childId === searchedId) {
      total += count;
    }

    const nested = unitMap[childId];
    if (nested && nested.type === "org") {
      total += HowManyOfThisTypeInParent(childId, searchedId, unitMap) * count;
    }
  }

  return total;
}