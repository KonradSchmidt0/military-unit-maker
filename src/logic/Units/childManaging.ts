import { ChildEntry, GetChildEntry, OrgUnit } from "./logic";

export function setChildEntry(
  parent: OrgUnit,
  childId: string,
  func: (entry: ChildEntry | undefined) => ChildEntry
): OrgUnit { 
  const curEntry = GetChildEntry(parent, 0, childId)

  let o = curEntry ?
    {...parent, children: parent.children.map( (e) => 
      e.id === childId ? func(e) : e
    )} 
    :
    {...parent, children: parent.children.concat(func(undefined))}

  return o
}

export function setChildCount(
  parent: OrgUnit,
  childId: string,
  newCount: number
): OrgUnit {
  return setChildEntry(parent, childId, 
    (_) => ({id: childId, count: newCount})
  )
}

export function setChildEntryId(
  parent: OrgUnit,
  oldId: string,
  newId: string
): OrgUnit {
  return setChildEntry(parent, oldId, 
    (e) => ({id: newId, count: e ? e.count : 0})
  )
}

export function addChild(
  parent: OrgUnit,
  childId: string,
  count: number = 1
): OrgUnit {
  return setChildEntry(parent, childId, 
    (e) => ({id: childId, count: e ? Math.max(e.count + count, 0) : count})
  )
}

export function subtractChild(
  parent: OrgUnit,
  childId: string,
  count: number = 1
): OrgUnit {
  return addChild(parent, childId, -count)
}

export function removeChildEntry(
  parent: OrgUnit,
  childId: string,
): OrgUnit {
  return {...parent, children: parent.children.filter((e) => e.id !== childId)}
}

export function moveChild(
  parent: OrgUnit,
  childId: string,
  destination: "top" | "bottom"
): OrgUnit {
  const childEntry = parent.children.find((e) => (e.id === childId))
  if (!childEntry) {
    return parent
  }

  const childrenMinusTheChild = parent.children.filter((e) => e.id !== childId)
  const newChildren = destination === "bottom" ?
    childrenMinusTheChild.concat(childEntry) :
    [childEntry].concat(childrenMinusTheChild)
    
  return {...parent, children: newChildren}
}