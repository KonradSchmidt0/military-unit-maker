import { useShortcutStore } from "../../../hooks/shortcutStore"
import { useHoverStore } from "../../../hooks/useHoverStore"
import { usePaletStore } from "../../../hooks/usePaletStore"
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { GetFlatIds } from "../../../logic/childManaging"
import { OrgUnit } from "../../../logic/logic"
import { TemporaryRootButton } from "../EditorElements/TemporaryRootButton"

interface props {
  
}

export function CommonEditorAlphaRow(p:props) {
  const { unitMap, trueRootId, popNewTrueRoot } = useUnitStore(s => s)
  const { selectSignature, setSelect, offsetSelect } = useUnitInteractionStore(s => s)
  const { duplicateUnit, addOrSubtractChild } = useUnitStore(s => s)
  const {ctrl, alt} = useShortcutStore(s => s)
  const { callSimple, callOff } = useHoverStore(s => s)
  const { addUnitToPalet, unitPalet, removeUnitFromPalet } = usePaletStore(s => s)

  const selectedId = processSelect(selectSignature, unitMap, trueRootId)
  const parentId = useUnitInteractionStore(s => s.getSelectedParent(unitMap, trueRootId))
  
  if (!selectSignature || !selectedId)
    return null
  
  function handleUnlinking(id: string, parentId: string, selectPath: number[]) {
    const parent = unitMap[parentId as string] as OrgUnit

    const newId = duplicateUnit(id);
    addOrSubtractChild(parentId, selectedId as string, -1)
    addOrSubtractChild(parentId, newId, 1)

    if (!alt)
      setSelect([...selectPath.slice(0, -1), GetFlatIds(parent.children).length - 1])
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