import { EquipGroup } from "../hooks/useEquipGroupingStore";
import { UnitMap } from "../hooks/useUnitStore";
import { EquipmentTable } from "./logic";

export function renameItemInUnitMap(
  unitMap: UnitMap,
  originalItemName: string,
  newItemName: string
): 
  {unitMap: UnitMap, 
   changesCount: number} 
{
  const updatedMap: UnitMap = {};
  var howManyRenamedInstances = 0

  for (const [unitId, unit] of Object.entries(unitMap)) {
    // I don't simply check for type just because i felt quirky like that lol
    if (!("equipment" in unit)) {
      updatedMap[unitId] = unit;
      continue;
    }

    const updatedEquipment: EquipmentTable = {};

    // Problem: User can input as a newName a already existing item
    // Solution: If entry of newName alredy exist, skip it. Then add up both values of originalName and newName, effectively merging them

    // Problem 2: There is no validation that originalName actualy exist somewhere, and in that cases we just skip the newName without coping it
    // Solution 2: Just check if the originalName actually exists in this table
    for (const [itemName, quantity] of Object.entries(unit.equipment)) {
      if (itemName === newItemName && unit.equipment[originalItemName]) {
        continue
      }

      if (itemName === originalItemName) {
        updatedEquipment[newItemName] = quantity + (unit.equipment[newItemName] ?? 0);
        howManyRenamedInstances += 1
      } else {
        updatedEquipment[itemName] = quantity;
      }
    }

    updatedMap[unitId] = {
      ...unit,
      equipment: updatedEquipment,
    };
  }

  return {unitMap: updatedMap, changesCount: howManyRenamedInstances};
}

export function renameItemInEqGroups(
  groups: EquipGroup[],
  originalItemName: string,
  newItemName: string
): 
  {groups: EquipGroup[], 
   changesCount: number} 
{
  var changesCount = 0

  const helper = (group: EquipGroup) => {
    const o = {...group, entries: group.entries.map((entry) => {
      if (entry === originalItemName) {
        changesCount++
        return newItemName
      }
      return entry
    })}

    var dic: Record<string, boolean> = {}
    
    return {...o, entries: o.entries.filter((entry) => {
      if (dic[entry]) {
        changesCount++
        return false
      }
      dic[entry] = true
      return true
    })}
  }

  const o = groups.map((g) => helper(g))
  return {groups: o, changesCount: changesCount}
}