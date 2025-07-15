import { getUnitQuick, UnitMap } from "../hooks/useUnitStore";

export type EquipmentType = string;
export type EquipmentTable = Record<EquipmentType, number>;

export interface RawUnit {
  type: "raw";
  name: string;
  equipment: EquipmentTable;
}

export interface OrgUnit {
  type: "org";
  name: string;
  children: {
    unitId: string;
    count: number;
  }[];
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

    for (const { unitId: childId, count } of unit.children) {
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
  const existing = parent.children.find((c) => c.unitId === childId);

  if (existing) {
    return {
      ...parent,
      children: parent.children.map((c) =>
        c.unitId === childId ? { ...c, count: c.count + count } : c
      ),
    };
  } else {
    return {
      ...parent,
      children: [...parent.children, { unitId: childId, count }],
    };
  }
}


export function removeChild(
  parent: OrgUnit,
  childId: string,
  count: number = 1
): OrgUnit {
  const existing = parent.children.find((c) => c.unitId === childId);

  if (!existing) return parent; // no child to remove

  if (existing.count <= count) {
    return {
      ...parent,
      children: parent.children.filter((c) => c.unitId !== childId),
    };
  } else {
    return {
      ...parent,
      children: parent.children.map((c) =>
        c.unitId === childId ? { ...c, count: c.count - count } : c
      ),
    };
  }
}

export function removeAllOfAChild(
  parent: OrgUnit,
  childId: string,
): OrgUnit {
  const existing = parent.children.find((c) => c.unitId === childId);

  if (!existing) return parent; // no child to remove

  return {
    ...parent,
    children: parent.children.filter((c) => c.unitId !== childId),
  };
}

export function createNewRawUnit(name = "New Raw Unit"): RawUnit {
  return {
    type: "raw",
    name,
    equipment: {}, // Empty by default
  };
}

export function createNewOrgUnit(name = "New Org Unit"): OrgUnit {
  return {
    type: "org",
    name,
    children: [],
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
    type === "raw" ? createNewRawUnit(name) : createNewOrgUnit(name);

  const newUnitMap: UnitMap = {
    ...unitMap,
    [newId]: newUnit,
  };

  const updatedParent: OrgUnit = {
    ...parent,
    children: [...parent.children, { unitId: newId, count: 1 }],
  };

  return {
    newUnitMap,
    newUnitId: newId,
    updatedParent,
  };
}
