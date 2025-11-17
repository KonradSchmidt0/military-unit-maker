import { useDialogBoxStorage } from "../../../hooks/useDialogBoxStore"
import { useHoverStore } from "../../../hooks/useHoverStore"
import { usePaletStore } from "../../../hooks/usePaletStore"
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"

interface props {

}

export function RemoveRootButton(p: props) {
  const { unitMap, trueRootId, getCurrentRootId, actingRootPath, setTrueRootId, setActingRootPath } = useUnitStore(s => s)
  const { selectSignature, setSelect } = useUnitInteractionStore(s => s)
  const { callSimple, callOff } = useHoverStore(s => s)
  const { addUnitToPalet  } = usePaletStore(s => s)
  
  const temporaryRootId = getCurrentRootId(trueRootId, actingRootPath, unitMap)
  const selectedId = processSelect(selectSignature, unitMap, trueRootId)
  const isChild = Array.isArray(selectSignature) && selectSignature.length > 0

  function handleUserCallToRemoveTrueRoot() {
    addUnitToPalet(trueRootId)

    if (!selectedId) {
      console.warn(selectedId + " is undef. Check the parent where this component is placed")
      return
    }

    console.log(selectedId)
    setTrueRootId(selectedId)
    setActingRootPath([])
    setSelect([])
  }

  return (<>
      {temporaryRootId === selectedId && isChild &&
        <button 
          className="btn-emoji" 
          onClick={() => handleUserCallToRemoveTrueRoot()}
          onMouseEnter={() => callSimple("Removes the true root", "Will 'kill' the unit at the tippy top (real root not the temporary one you currently selected), and set this unit as the new root. Action can be reversed (but you may need to press ctrl+z few times hihi). Useful when accidentally created new root")}
          onMouseLeave={() => callOff()}
        >☠️🦒</button>}
  </>)
}