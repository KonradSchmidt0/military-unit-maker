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
  const unit = getUnitQuick(unitId, "No unit with this ID (getEquipmentTable)")

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