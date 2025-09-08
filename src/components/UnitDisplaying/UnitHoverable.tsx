import { useHoverStore } from "../../hooks/useHoverStore"
import { processSignature } from "../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../hooks/useUnitStore"

interface props {
  signature: string | number[]
}

export function UnitHoverable(p: React.PropsWithChildren<props>) {
  const { unitMap, trueRootId } = useUnitStore(s => s)
  const { callId, callOff } = useHoverStore(s => s)

  const myId = processSignature(p.signature, unitMap, trueRootId)

  if (!myId) {
    console.warn("Incorect path or id assigned to TreeNode! ", p.signature)
    return null
  }

  return (
    <div onMouseEnter={() => callId(myId)} onMouseLeave={() => callOff()}>
      {p.children}
    </div>
  )
}