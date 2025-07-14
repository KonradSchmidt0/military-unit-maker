import { getUnitQuick } from "../hooks/useUnitStore";

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
