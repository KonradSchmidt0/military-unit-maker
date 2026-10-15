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

export function FlatIndex2InsideIndex
  (path: number[], rootId: string, unitMap: UnitMap, phase: number, aaa?: boolean) : 
  {childId: string, insideIndex: number} | undefined 
{
  const childId = GetChildIdFromPath(rootId, path, unitMap, phase)
  const parentId = GetChildIdFromPath(rootId, path.slice(0, -1), unitMap, phase)
  
  if (!childId || !parentId) return undefined

  const parent = unitMap[parentId] as OrgUnit
  const flatIndexOfChildEntry = getComplexChildList(parent, false, phase).find(e => e.childId === childId)?.flatIndex
  
  if (flatIndexOfChildEntry === undefined) return undefined
  
  const insideIndex = (path.at(-1) ?? flatIndexOfChildEntry) - flatIndexOfChildEntry

  return {childId: childId, insideIndex: insideIndex}
}