import { useHoverStore } from "../../hooks/useHoverStore"
import { processSignature } from "../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../hooks/useUnitStore"

interface props {
  signature: string | number[]
}

export function UnitHoverable(p: React.PropsWithChildren<props>) {
  const { unitMap, trueRootId } = useUnitStore(s => s)
  const { call } = useHoverStore(s => s)

  const myId = processSignature(p.signature, unitMap, trueRootId)

  if (!myId) {
    console.warn("Incorect path or id assigned to TreeNode! ", p.signature)
    return null
  }

  return (
    <div onMouseEnter={(e) => call(myId, {left: e.clientX, top: e.clientY})} onMouseLeave={() => call(undefined)}>
      {p.children}
    </div>
  )
}