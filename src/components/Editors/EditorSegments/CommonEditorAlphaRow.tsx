import { useShortcutStore } from "../../../hooks/shortcutStore"
import { useHoverStore } from "../../../hooks/useHoverStore"
import { usePaletStore } from "../../../hooks/usePaletStore"
import { usePhaseStore } from "../../../hooks/usePhaseStore"
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { OrgUnit } from "../../../logic/Units/logic"
import { RemoveRootButton } from "../EditorElements/RemoveRootButton"
import { TemporaryRootButton } from "../EditorElements/TemporaryRootButton"

interface props {
  
}

export function CommonEditorAlphaRow(p:props) {
  const { unitMap, trueRootId, popNewTrueRoot } = useUnitStore(s => s)
  const { selectSignature, setSelect, offsetSelect } = useUnitInteractionStore(s => s)
  const { duplicateUnit, addOrSubtractChild } = useUnitStore(s => s)
  const { ctrl } = useShortcutStore(s => s)
  const { callSimple, callOff } = useHoverStore(s => s)
  const { addUnitToPalet, unitPalet, removeUnitFromPalet } = usePaletStore(s => s)
  const { phase } = usePhaseStore()

  const selectedId = processSelect(selectSignature, unitMap, trueRootId, phase)
  const parentId = useUnitInteractionStore(s => s.getSelectedParent(unitMap, trueRootId, phase))
  
  if (!selectSignature || !selectedId)
    return null
  
  function handleUnlinking(id: string, parentId: string, selectPath: number[]) {
    const parent = unitMap[parentId as string] as OrgUnit

    const newId = duplicateUnit(id);
    addOrSubtractChild(parentId, selectedId as string, -1)
    addOrSubtractChild(parentId, newId, 1)
  }

  return (
    <div className="editor-segment-row">
      {parentId && Array.isArray(selectSignature) && <button 
        className="btn-emoji" 
        onClick={() => handleUnlinking(selectedId, parentId, selectSignature)}
        onMouseEnter={() => callSimple("Unlinks this unit", "Makes so changes to this unit, don't affect units of previously the same type")}
        onMouseLeave={() => callOff()}
      >Unlink</button>}
      {trueRootId === selectedId && 
        <button 
          className="btn-emoji" 
          onClick={() => popNewTrueRoot(setSelect, offsetSelect, !ctrl)}
          onMouseEnter={() => callSimple("Adds parent unit above")}
          onMouseLeave={() => callOff()}
        >⬆️➕</button>}
      <TemporaryRootButton/>
      <RemoveRootButton/>
      {!unitPalet.includes(selectedId) && 
        <button 
          className="btn-emoji"
          onClick={() => addUnitToPalet(selectedId)}
          onMouseEnter={() => callSimple("Adds this unit to pallet, making it reusable", "f.e. when adding already existing unit as a child, or when changing child to diffrent unit")}
          onMouseLeave={() => callOff()}
        >➕🎨</button>}
      {unitPalet.includes(selectedId) && 
        <button 
          className="btn-emoji"
          onClick={() => removeUnitFromPalet(selectedId)}
          onMouseEnter={() => callSimple("Removes this unit from pallet", "Units in pallet can be reused, f.e. when adding already existing unit as a child, or when changing child to diffrent unit")}
          onMouseLeave={() => callOff()}
        >🎨🚮</button>}
    </div>
  )
}