import { getUnitQuick, UnitMap } from "../hooks/useUnitStore";

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


export function getEquipmentTable(unitId: string): EquipmentTable {
  const unit = getUnitQuick(unitId)

  if (!unit) {
    throw Error(`No unit with ID = ${unitId}`)
  }

  if (unit.type === "raw") {
    return unit.equipment;
  } else {
    const combined: EquipmentTable = {};

    for (const [childId, count] of Object.entries(unit.children)) {
      const childEq = getEquipmentTable(childId);

      for (const [type, qty] of Object.entries(childEq)) {
        combined[type] = (combined[type] || 0) + qty * count;
      }
    }

    return combined;
  }
}

export function addChild(
  parent: OrgUnit,
  childId: string,
  count: number = 1
): OrgUnit {
  const curCount = parent.children[childId]

  // When i do { newId: 1 } it reads new id as a freaking string of value "newId"
  let aaa: ChildrenList = {}
  aaa[childId] = curCount ? curCount + count : count
  return {
    ...parent,
    children: {...parent.children, ...aaa}
  };
}


export function removeChild(
  parent: OrgUnit,
  childId: string,
  count: number = 1
): OrgUnit {
  const curCount = parent.children[childId]

  if (!curCount) return parent; // no child to remove

  if (curCount <= count) {
    return removeAllOfAChild(parent, childId)
  } else {
    // When i do { newId: 1 } it reads new id as a freaking string of value "newId"
    let aaa: ChildrenList = {}
    aaa[childId] =  curCount - count

    return {
      ...parent,
      children: {...parent.children, ...aaa}
    };
  }
}

export function removeAllOfAChild(
  parent: OrgUnit,
  childId: string,
): OrgUnit {
  const { [childId]: _, ...rest } = parent.children;
  return {
    ...parent,
    children: rest
  };
}

export function createNewRawUnit(name = "New Raw Unit", layers: string[] = [], echelonLevel=0, color=defaultUnitColor, eq={}): RawUnit {
  return {
    type: "raw",
    name,
    layers,
    smartColor: color,
    echelonLevel,
    equipment: eq,
  };
}

export function createNewOrgUnit(name = "New Org Unit", layers: string[] = [], echelonLevel=0, color=defaultUnitColor, children: ChildrenList = {}): OrgUnit {
  return {
    type: "org",
    name,
    layers,
    smartColor: color,
    echelonLevel,
    children,
  };
}

// CALLER RESPONSIBILITIES:
// Update the app storage, update the parent unit in this storage (I know, messy, ill fix it later)
export function addNewChildUnit(
  parent: OrgUnit,
  unitMap: UnitMap,
  type: "raw" | "org",
  name?: string
): { newUnitMap: UnitMap; newUnitId: string; updatedParent: OrgUnit } {
  const newId = crypto.randomUUID();

  const newUnit: Unit =
    type === "raw" 
      ? createNewRawUnit(name, parent.layers, Math.max(0, parent.echelonLevel - 1)) 
      : createNewOrgUnit(name, parent.layers, Math.max(0, parent.echelonLevel - 1));

  const newUnitMap: UnitMap = {
    ...unitMap,
    [newId]: newUnit,
  };

  // When i do { newId: 1 } it reads new id as a freaking string of value "newId"
  let aaa: ChildrenList = {}
  aaa[newId] = 1
  const updatedParent: OrgUnit = {
    ...parent,
    children: {...parent.children, ...aaa},
  };

  return {
    newUnitMap,
    newUnitId: newId,
    updatedParent,
  };
}

// Known bug: Selecting root unit doesn't return 1
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
    if (!childUnit) {
      newChildren[childId] = count; // Keep as is
      continue;
    }

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
