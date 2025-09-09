import { useHoverStore } from "../../../hooks/useHoverStore"
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"

interface props {
  myPath: number[]
}

export function SelectParent(p: props) {
  const setSelect = useUnitInteractionStore(s => s.setSelect)
  const { callSimple, callOff } = useHoverStore(s => s)

  return (
    <button 
      className="btn-emoji !py-0 !ml-2" 
      onClick={() => setSelect(p.myPath.slice(0, -1))}
      onMouseEnter={() => callSimple("Selects parent")}
      onMouseLeave={() => callOff()}
    >👩‍👦</button>
  )
}