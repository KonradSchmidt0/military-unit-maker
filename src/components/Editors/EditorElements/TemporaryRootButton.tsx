import { useHoverStore } from "../../../hooks/useHoverStore"
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"

interface props {

}

export function TemporaryRootButton(p: props) {
  const { unitMap, trueRootId, setActingRootPath, getCurrentRootId, actingRootPath } = useUnitStore(s => s)
  const { selectSignature } = useUnitInteractionStore(s => s)
  const { callSimple, callOff } = useHoverStore(s => s)
  
  const temporaryRootId = getCurrentRootId(trueRootId, actingRootPath, unitMap)
  const selectedId = processSelect(selectSignature, unitMap, trueRootId)
  const isChild = Array.isArray(selectSignature) && selectSignature.length > 0

  function handleSelectingUnselectingActingRoot(b: boolean) {
    if (!b) {
      setActingRootPath([])
      return
    }

    if (!Array.isArray(selectSignature))
      return

    setActingRootPath(selectSignature)
  }

  return (<>
      {temporaryRootId !== selectedId && isChild &&
        <button 
          className="btn-emoji" 
          onClick={() => handleSelectingUnselectingActingRoot(true)}
          onMouseEnter={() => callSimple("'Pins' this unit as a temporary root", "Meaning it still has a parent, but visually it appears as the unit on the top, making it easier to focus on its children")}
          onMouseLeave={() => callOff()}
        >📌🦒</button>}
      {temporaryRootId === selectedId && trueRootId !== selectedId &&
        <button 
          className="btn-emoji" 
          onClick={() => handleSelectingUnselectingActingRoot(false)}
          onMouseEnter={() => callSimple("'Unpins' this unit", "Giving back the original unit on top")}
          onMouseLeave={() => callOff()}
        >❌📌</button>}
  </>)
}