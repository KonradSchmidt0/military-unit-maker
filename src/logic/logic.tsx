import { UnitMap } from "../hooks/useUnitStore";

export const defaultUnitColor = "#6ad8e2"

export type EquipmentType = string;
export type EquipmentTable = Record<EquipmentType, number>;
export type ChildrenList = Record<string, number>

export interface RawUnit {
  type: "raw";
  name: string;
  smartColor: "inheret" | string;
  echelonLevel: number;
  layers: string[]; // For now just a path to /public/ later will think about user custom icons
  equipment: EquipmentTable;
}

export interface OrgUnit {
  type: "org";
  name: string;
  smartColor: "inheret" | string;
  echelonLevel: number;
  layers: string[]; // For now just a path to /public/ later will think about user custom icons
  children: ChildrenList // First is UnitId, second is count of how many
}


export type Unit = RawUnit | OrgUnit;


export function getEquipmentTable(unitId: string, unitMap: UnitMap): EquipmentTable {
  const unit = unitMap[unitId]

  if (!unit) {
    throw Error(`No unit with ID = ${unitId}`)
  }

  if (unit.type === "raw") {
    return unit.equipment;
  } else {
    const combined: EquipmentTable = {};

    for (const [childId, count] of Object.entries(unit.children)) {
      const childEq = getEquipmentTable(childId, unitMap);

      for (const [type, qty] of Object.entries(childEq)) {
        combined[type] = (combined[type] || 0) + qty * count;
      }
    }

    return combined;
  }
}

export function createNewRawUnit({
  name = "New Raw Unit",
  layers = [],
  echelonLevel = 0,
  smartColor = "inheret",
  eq = {},
}: {
  name?: string;
  layers?: string[];
  echelonLevel?: number;
  smartColor?: string;
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
  name = "New Org Unit",
  layers = [],
  echelonLevel = 0,
  smartColor = "inheret",
  children = {},
}: {
  name?: string;
  layers?: string[];
  echelonLevel?: number;
  smartColor?: string;
  children?: ChildrenList;
} = {}): OrgUnit {
  return {
    type: "org",
    name,
    layers,
    smartColor,
    echelonLevel,
    children
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


export function removeEquipmentTypeRecursively(
  unit: Unit,
  equipmentTypeToRemove: EquipmentType,
  unitMap: UnitMap
): Unit {
  if (unit.type === "raw") {
    let newEquipment = { ...unit.equipment };
    delete newEquipment[equipmentTypeToRemove];
    return { ...unit, equipment: newEquipment };
  }

  // If it's an OrgUnit, recursively process its children
  const newChildren: ChildrenList = {};

  for (const [childId, count] of Object.entries(unit.children)) {
    const childUnit = unitMap[childId];

    const updatedChild = removeEquipmentTypeRecursively(
      childUnit,
      equipmentTypeToRemove,
      unitMap
    );

    unitMap[childId] = updatedChild; // Update in place
    newChildren[childId] = count; // Preserve count
  }

  return { ...unit, children: newChildren };
}
