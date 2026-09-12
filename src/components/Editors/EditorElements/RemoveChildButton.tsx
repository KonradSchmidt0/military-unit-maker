import { simpleHover, useHoverStore } from "../../../hooks/useHoverStore"
import { usePhaseStore } from "../../../hooks/usePhaseStore"
import { processSignature } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"

interface props {
  parentSignature: string | number[]
  childSignature: string | number[]
  hover?: simpleHover
}

export function RemoveChildButton(p: React.PropsWithChildren<props>) {
  const { unitMap, trueRootId } = useUnitStore(s => s)
  const removeChildFully = useUnitStore(s => s.removeChildType)
  const { callSimpleI, callOff } = useHoverStore(s => s)
  const { currentPhase: phase } = usePhaseStore()

  const parentId = processSignature(p.parentSignature, unitMap, trueRootId, phase)
  const childId = processSignature(p.childSignature, unitMap, trueRootId, phase)

  if (!parentId || !childId) {
    return null
  }

  return (
    <button
      className="btn-emoji !p-0"
      onClick={() => {
        removeChildFully(parentId, childId)
      }}
      onMouseEnter={() => { if (p.hover) callSimpleI(p.hover) }}
      onMouseLeave={() => callOff()}
    >
      {p.children ?? "❌"}
    </button>
  )
}