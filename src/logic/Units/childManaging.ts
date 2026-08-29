import { UnitMap } from "../../hooks/useUnitStore";
import { OrgUnit, ChildrenList } from "./logic";

export function addChild(
  parent: OrgUnit,
  childId: string,
  count: number = 1
): OrgUnit {
  const curCount = parent.childList[childId]

  // When i do { newId: 1 } it reads new id as a freaking string of value "newId"
  let aaa: ChildrenList = {}
  aaa[childId] = curCount ? curCount + count : count
  return {
    ...parent,
    childList: {...parent.childList, ...aaa}
  };
}

export function removeChild(
  parent: OrgUnit,
  childId: string,
  count: number = 1
): OrgUnit {
  const curCount = parent.childList[childId]

  if (!curCount) return parent; // no child to remove

  if (curCount <= count) {
    return removeAllOfAChild(parent, childId)
  } else {
    // When i do { newId: 1 } it reads new id as a freaking string of value "newId"
    let aaa: ChildrenList = {}
    aaa[childId] =  curCount - count

    return {
      ...parent,
      childList: {...parent.childList, ...aaa}
    };
  }
}

export function removeAllOfAChild(
  parent: OrgUnit,
  childId: string,
): OrgUnit {
  const { [childId]: _, ...rest } = parent.childList;
  return {
    ...parent,
    childList: rest
  };
}

export function setChildCount(
  parent: OrgUnit,
  childId: string,
  newCount: number
): OrgUnit {
  const curCount = parent.childList[childId]

  if (!curCount) return parent; // no child to edit

  if (newCount === 0) {
    return removeAllOfAChild(parent, childId)
  } else {
    // When i do { newId: 1 } it reads new id as a freaking string of value "newId"
    let aaa: ChildrenList = {}
    aaa[childId] = newCount
    return {
      ...parent,
      childList: {...parent.childList, ...aaa}
    };
  }
}

export function setChildId(
  parent: OrgUnit,
  oldId: string,
  newId: string
): OrgUnit {
  const oldIdCount = parent.childList[oldId]
  if (!oldIdCount)
    return parent

  let updatedChildren = parent.childList
  delete updatedChildren[oldId]
  updatedChildren[newId] = oldIdCount
  return { ...parent, childList: updatedChildren }
}

export function moveChild(
  parent: OrgUnit,
  childId: string,
  destination: "top" | "bottom"
): OrgUnit {
  const exist = parent.childList[childId]
  if (!exist) {
    return parent
  }

  let newChildren = {}
  if (destination === "top")
    newChildren = { [childId]: exist, ...parent.childList }
  else {
    const { [childId]: myCount, ...rest } = parent.childList;
    newChildren = {...rest, [childId]: exist}
  }

  return {...parent, childList: newChildren}
}


// "Flat" as in flatten the children
// Example: Parent has children: 1 HQ, 3 Infantry, 1 Artillery. Flattening it gives us array: [HQ, inf, inf, inf, art]
export function GetFlatIds(children: ChildrenList) {
  const o: string[] = [];

  for (const [childTypeId, count] of Object.entries(children)) {
    for (let i = 0; i < count; i++) {
      o.push(childTypeId);
    }
  }

  return o;
}

export function GetIdFromFlatIndex(children: ChildrenList, index: number) : string | undefined {
  return GetFlatIds(children)[index]
}

export function GetFlatIndexFromId(children: ChildrenList, id: string) {
  let o = 0;

  for (const [childId, count] of Object.entries(children)) {
    if (childId === id) {
      return o
    }
    o += count
  }

  return o;
}

export function GetChildIdFromPath(rootId: string, path: number[], unitMap: UnitMap): string | undefined {
  if (path.length === 0) {
    return rootId
  }
  const parent = unitMap[rootId]
  if (parent.type !== "org") {
    return undefined
  }
  const nextId = GetIdFromFlatIndex(parent.childList, path[0])
  if (!nextId) {
    return undefined
  }
  if (path.length === 1) {
    return nextId
  }
  const np = path.slice(1)
  return GetChildIdFromPath(nextId, np, unitMap)
}

// Complex as in combines both standard child list (id: count) and flat list (flatten array)
export function getComplexChildList(u: OrgUnit, shouldFlatten: boolean) {
    const flat = GetFlatIds(u.childList).map((cid, i) => ({flatIndex: i, childId: cid, count: u.childList[cid]}));
  
    if (shouldFlatten) {
      return flat;
    }
  
    const seen = new Set();
    const filtered = flat.filter(entry => {
      if (seen.has(entry.childId)) return false;
      seen.add(entry.childId);
      return true;
    });
    return filtered
  }