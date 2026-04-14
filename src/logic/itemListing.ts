import { EquipGroup } from "../hooks/useEquipGroupingStore";
import { UnitMap } from "../hooks/useUnitStore";
import { EquipmentTable } from "./logic";


export function getEquipmentTable(unitId: string, unitMap: UnitMap): EquipmentTable {
  const unit = unitMap[unitId];

  if (!unit) {
    throw Error(`No unit with ID = ${unitId}`);
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

export function getGroupedEquipmentTable(
  unitId: string,
  unitMap: UnitMap,
  groups: EquipGroup[]
): { name: string; count: number, type: 'individual' | 'group' }[] {
  const et = getEquipmentTable(unitId, unitMap);

  // Build item → group lookup
  const itemToGroup = new Map<string, EquipGroup>();
  for (const group of groups) {
    for (const entry of group.entries) {
      itemToGroup.set(entry, group);
    }
  }

  const output = new Map<string, {count: number, type: 'individual' | 'group'}>();

  // Pre-seed result based on groups
  for (const group of groups) {
    if (group.minimalized) {
      output.set(group.name, {count: 0, type: 'group'});
    } else {
      for (const entry of group.entries) {
        output.set(entry, {count: 0, type: 'individual'});
      }
    }
  }

  // Fill counts
  for (const [item, count] of Object.entries(et)) {
    const myGroup = itemToGroup.get(item);

    if (myGroup && myGroup.minimalized) {
      const cur = output.get(myGroup.name)
      output.set(myGroup.name, {count: (cur ? cur.count : 0) + count, type: 'group'});
      continue;
    }

    const cur = output.get(item)
    output.set(item,{count: (cur ? cur.count : 0) + count, type: 'individual'});
  }

  return Array.from(output, ([name, data]) => ({ name, count: data.count, type: data.type }))
  .filter(entry => entry.count !== 0);
}

export function getSingleItemsGroup(groups: EquipGroup[], searchedItem: string) : EquipGroup | null {
  return groups.find(g => g.entries.includes(searchedItem)) ?? null
}