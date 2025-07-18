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
