import { processSignature } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"

interface props {
  parentSignature: string | number[]
  childSignature: string | number[]
}

export function RemoveChildButton(p: React.PropsWithChildren<props>) {
  const { unitMap, trueRootId } = useUnitStore(s => s)

  const removeChildFully = useUnitStore(s => s.removeChildType)

  const parentId = processSignature(p.parentSignature, unitMap, trueRootId)
  const childId = processSignature(p.childSignature, unitMap, trueRootId)

  if (!parentId || !childId) {
    return null
  }

  return (
    <button
      className="btn-emoji !p-0"
      onClick={() => {
        removeChildFully(parentId, childId)
      }}
    >
      {p.children ?? "❌"}
    </button>
  )
}