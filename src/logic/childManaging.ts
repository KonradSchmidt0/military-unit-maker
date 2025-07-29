import { UnitMap } from "../hooks/useUnitStore";
import { ChildrenList, defaultUnitColor, OrgUnit } from "./logic";

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

export function setChildCount(
  parent: OrgUnit,
  childId: string,
  newCount: number
): OrgUnit {
  const curCount = parent.children[childId]

  if (!curCount) return parent; // no child to edit

  if (newCount === 0) {
    return removeAllOfAChild(parent, childId)
  } else {
    // When i do { newId: 1 } it reads new id as a freaking string of value "newId"
    let aaa: ChildrenList = {}
    aaa[childId] = newCount
    return {
      ...parent,
      children: {...parent.children, ...aaa}
    };
  }
}

export function setChildId(
  parent: OrgUnit,
  oldId: string,
  newId: string
): OrgUnit {
  const oldIdCount = parent.children[oldId]
  if (!oldIdCount)
    return parent

  let updatedChildren = parent.children
  delete updatedChildren[oldId]
  updatedChildren[newId] = oldIdCount
  return { ...parent, children: updatedChildren }
}

export function moveChild(
  parent: OrgUnit,
  childId: string,
  destination: "top" | "bottom"
): OrgUnit {
  const exist = parent.children[childId]
  if (!exist) {
    return parent
  }

  let newChildren = {}
  if (destination === "top")
    newChildren = { [childId]: exist, ...parent.children }
  else {
    const { [childId]: myCount, ...rest } = parent.children;
    newChildren = {...rest, [childId]: exist}
  }

  return {...parent, children: newChildren}
}



export function GetFlatIds(children: ChildrenList) {
  const o: string[] = [];

  for (const [childType, count] of Object.entries(children)) {
    for (let i = 0; i < count; i++) {
      o.push(childType);
    }
  }

  return o;
}

export function GetIdFromFlatIndex(children: ChildrenList, index: number) {
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

export function GetChildIdFromPath(rootId: string, path: number[], unitMap: UnitMap): string {
  if (path.length === 0) {
    return rootId
  }
  const parent = unitMap[rootId] as OrgUnit
  const nextId = GetIdFromFlatIndex(parent.children, path[0])
  if (path.length === 1) {
    return nextId
  }
  const np = path.slice(1)
  return GetChildIdFromPath(nextId, np, unitMap)
}

export function GetTrueColorRecursively(rootId: string, path: number[], unitMap: UnitMap): `#${string}` {
  if (path.length <= 0) {
    const root = unitMap[rootId] 
    return (root.smartColor !== "inheret" ? root.smartColor : defaultUnitColor)
  }
  const unit = unitMap[path[path.length - 1]]
  if (unit.smartColor !== "inheret") {
    return unit.smartColor
  }
  return GetTrueColorRecursively(rootId, path.slice(0, -1), unitMap)
}