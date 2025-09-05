import { useShortcutStore } from "../../hooks/shortcutStore"
import { usePaletStore } from "../../hooks/usePaletStore"
import { useUnitDropdownStore } from "../../hooks/useUnitDropdownStore"
import { processSignature, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../hooks/useUnitStore"
import { getSafeChildOptions } from "../../logic/getSafeChildOptions"
import { OrgUnit } from "../../logic/logic"

interface props {
  parentSignature: string | number[]
  childSignature: string | number[]
  whoSelectOnSelectClick: string | number[]
}

export function UnitClickableAlt(p: React.PropsWithChildren<props>) {
  const { unitMap, trueRootId } = useUnitStore(s => s)
  const { unitPalet } = usePaletStore(s => s)
  const { alt, shift, ctrl} = useShortcutStore(s => s)

  const callDropDown = useUnitDropdownStore(s => s.callDropDown)
  const { changeChildId, duplicateUnit, addOrSubtractChild } = useUnitStore(s => s)
  const { setSelect } = useUnitInteractionStore(s => s)
  
  const childId = processSignature(p.childSignature, unitMap, trueRootId)
  if (!childId) {
    console.warn("Unit (child) with id: " + childId + " processed from signature: " + p.childSignature + " is undefined")
    return null
  }
  const parentId = processSignature(p.parentSignature, unitMap, trueRootId)
  if (!parentId) {
    console.warn("Unit (parent) with id: " + parentId + " processed from signature: " + p.parentSignature + " is undefined")
    return null
  }

  const parent = unitMap[parentId] as OrgUnit
  // Problem: If given all units as a option its possible to choose yourself or other dangerous unit, and thus creating infinite loop
  // Solution: We filter them
  const childrenChoices = getSafeChildOptions(parentId, unitMap, unitPalet, parent.children)

  const handleClick = (e: any) => {
    if (alt) {
      setSelect(p.whoSelectOnSelectClick)
      return
    }

    if (shift && ctrl) {
      const dupId = duplicateUnit(childId)
      addOrSubtractChild(parentId, dupId, 1)
      return
    }

    if (shift || ctrl) {
      addOrSubtractChild(parentId, childId, shift ? -1 : 1)
      return
    }

    callDropDown(
      (choosenId: string) => { changeChildId(parentId, childId, choosenId); }, 
      {top: e.clientY + 10, left: e.clientX},
      childrenChoices
    )
    
  }

  return (
    <div onClick={handleClick} style={{ display: "contents" }}>
      {p.children}
    </div>
  );  
}