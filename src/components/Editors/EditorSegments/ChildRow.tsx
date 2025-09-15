import { useShortcutStore } from "../../../hooks/shortcutStore"
import { useHoverStore } from "../../../hooks/useHoverStore"
import { useUnitInteractionStore, processSignature } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { OrgUnit } from "../../../logic/logic"
import { ComplexChildNode } from "../../UnitDisplaying/ComplexChildNode"
import { RemoveChildButton } from "../EditorElements/RemoveChildButton"
import { SafeNumberInput } from "../EditorElements/SafeNumberInput"

interface ChildRowProps {
  parentSignature: string | number[]
  childSignature: string | number[]
  whoSelectOnSelectClick: string | number[]
  key: string
  disableShadow?: boolean
  onMoveMade?: (dir: "top" | "bottom") => void
}

export function ChildRow(p: ChildRowProps) {
  const { unitMap, trueRootId } = useUnitStore(s => s)
  const { alt } = useShortcutStore(s => s)
  const { setSelect } = useUnitInteractionStore(s => s)
  const { changeChildCount, moveChildPos } = useUnitStore(s => s)
  const { callSimpleI, callOff } = useHoverStore(s => s)
  
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

  const handleMove = (d: "top" | "bottom") => {
    moveChildPos(parentId, childId, d)

    if (alt) {
      setSelect(p.whoSelectOnSelectClick)
      return
    }

    if (!p.onMoveMade)
      return
    p.onMoveMade(d)
  }

  return (
    <div className="editor-segment-row">
      <button className="btn-emoji !p-0" onClick={() => handleMove("top")}
        onMouseEnter={() => callSimpleI("Moves shown unit to the top of children list")} onMouseLeave={callOff}
        >⬆️</button>
      <button className="btn-emoji !p-0" onClick={() => handleMove("bottom")}
        onMouseEnter={() => callSimpleI("Moves shown unit to the bottom of children list")} onMouseLeave={callOff}
        >⬇️</button>

      <div className="!w-[6.5rem] flex justify-center">
        <ComplexChildNode 
          parentSignature={p.parentSignature} childSignature={p.childSignature} 
          disableShadow={p.disableShadow !== undefined && p.disableShadow}
          whoSelectOnSelectClick={p.whoSelectOnSelectClick}
        />
      </div>

      <SafeNumberInput 
        count={parent.children[childId]}
        onCountChange={(n) => { changeChildCount(parentId, childId, n); if (alt) { setSelect(p.whoSelectOnSelectClick) } }} 
        key={"sni" + p.key}
        hover={"Count of shown unit in parent"}
      />

      <RemoveChildButton 
        parentSignature={p.parentSignature} 
        childSignature={p.childSignature}
        hover={"Removes this unit type from parent"}
      />
    </div> 
  )
}