import { UnitMap } from "../hooks/useUnitStore";
import { ChildrenList, defaultUnitColor, OrgUnit, Unit } from "./logic";

export function expandChildren(children: ChildrenList): string[] {
  const result: string[] = [];
  for (const [id, count] of Object.entries(children)) {
    for (let i = 0; i < count; i++) {
      result.push(id);
    }
  }
  return result;
}
  
export function getUnitIdAtPath(rootId: string, path: number[], unitMap: UnitMap): string {
  let currentId = rootId;

  for (const index of path) {
    const current = unitMap[currentId] as OrgUnit
    const expanded = expandChildren(current.children);
    const childId = expanded[index];
    const child = unitMap[childId];
    if (!child) {
      console.warn("Something went wrong with path! Child with id = " + childId + " dosent exits  ||  Full path: " + path)
      return currentId
    }
    if (child.type === "raw") {
      return childId
    }
    currentId = childId
  }

  return currentId;
}

export function GetRealColorRecusivelly(rootId: string, path: number[], unitMap: UnitMap): `#${string}` {
  const pId = getUnitIdAtPath(rootId, path, unitMap)
  const c = unitMap[pId].smartColor

  if (pId === rootId || path.length === 0) {
    return c === "inheret" ? defaultUnitColor : c
  }
  if (c === "inheret") {
    return GetRealColorRecusivelly(rootId, path.slice(0, -1), unitMap)
  }
  return c
}