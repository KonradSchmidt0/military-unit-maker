import { useHoverStore } from "../../hooks/useHoverStore"
import { usePhaseStore } from "../../hooks/usePhaseStore"
import { processSignature } from "../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../hooks/useUnitStore"

interface props {
  signature: string | number[]
}

export function UnitHoverable(p: React.PropsWithChildren<props>) {
  const { unitMap, trueRootId } = useUnitStore()
  const { callId, callOff } = useHoverStore()
  const { currentPhase: phase } = usePhaseStore()

  const myId = processSignature(p.signature, unitMap, trueRootId, phase)

  if (!myId) {
    console.warn("Incorect path or id assigned to TreeNode! ", p.signature)
    return null
  }

  return (
    <div 
      onMouseEnter={() => callId(myId)} onMouseLeave={() => callOff()}
      key={p.signature.toString()}
    >
      {p.children}
    </div>
  )
}