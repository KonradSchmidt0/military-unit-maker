import { ChildrenList, OrgUnit } from "./logic";

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