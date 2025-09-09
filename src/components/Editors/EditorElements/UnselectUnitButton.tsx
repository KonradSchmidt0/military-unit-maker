import { useHoverStore } from "../../../hooks/useHoverStore"
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"

interface props {
  className?: string
}

export function UnselectUnitButton(p: props) {
  const { resetSelected } = useUnitInteractionStore(s => s)
  const { callSimple, callOff } = useHoverStore(s => s)

  return (<button 
          className={"btn-emoji " + p.className}
          onClick={resetSelected}
          onMouseEnter={() => callSimple("Unselects currently selected unit and closes this window")}
          onMouseLeave={() => callOff()}
        >❌</button>)
}