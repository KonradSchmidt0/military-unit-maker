import { UnitMap } from "../../hooks/useUnitStore";
import { GetChildren, OrgUnit } from "./logic";

// Complex as in combines both standard child list (id: count) and flat list (flatten array)
export function getComplexChildList(orgUnit: OrgUnit, shouldFlatten: boolean, phase: number) {
  const flatArray: {
    flatIndex: number;
    childId: string;
    count: any;
  }[] = [];

  const children = GetChildren(orgUnit, phase)

  let flatIndex = 0
  children.forEach((e) => {
    for (let i = 0; i < e.count; i++) {
      flatArray.push({flatIndex: flatIndex, childId: e.id, count: e.count});
      flatIndex++
    }
  });

  if (shouldFlatten) {
    return flatArray
  }

  const seen = new Set();
  return flatArray.filter(entry => {
    if (seen.has(entry.childId)) return false;
    seen.add(entry.childId);
    return true;
  });
}

// "Flat" as in flatten the children
// Example: Parent has children: 1 HQ, 3 Infantry, 1 Artillery. Flattening it gives us array: [HQ, inf, inf, inf, art]
export function GetFlatIds(orgUnit: OrgUnit, phase: number) {
  const complex = getComplexChildList(orgUnit, true, phase)
  return complex.map(e => e.childId)
}

// export function GetIdFromFlatIndex(orgUnit: OrgUnit, index: number, phase: number) : string | undefined {
//   return GetFlatIds(children)[index]
// }

// export function GetFlatIndexFromId(orgUnit, id: string) {
//   const complex = getComplexChildList(orgUnit, true, phase)
// }

export function GetChildIdFromPath(rootId: string, path: number[], unitMap: UnitMap, phase: number): string | undefined {
  if (path.length === 0) {
    return rootId
  }
  const parent = unitMap[rootId]
  if (!parent || parent.type !== "org") {
    return undefined
  }
  const nextId = GetFlatIds(parent, phase)[path[0]]
  if (!nextId) {
    return undefined
  }
  if (path.length === 1) {
    return nextId
  }
  const np = path.slice(1)
  return GetChildIdFromPath(nextId, np, unitMap, phase)
}