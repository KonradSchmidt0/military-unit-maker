import { useShortcutStore } from "../../../hooks/shortcutStore"
import { usePaletStore } from "../../../hooks/usePaletStore"
import { usePhaseStore } from "../../../hooks/usePhaseStore"
import { processSignature, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { GetChildIdFromPath } from "../../../logic/Units/childGetting"

interface props {
  signature: string | number[]
}

export function UnitClickableSelect(p: React.PropsWithChildren<props>) {
  const {unitMap, trueRootId} = useUnitStore()
  const {shift, ctrl} = useShortcutStore()
  const { currentPhase: phase } = usePhaseStore()
  
  const addToUnitPalet = usePaletStore(s => s.addUnitToPalet)
  const removeFromUnitPalet = usePaletStore(s => s.removeUnitFromPalet)

  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)

  const setSelected = useUnitInteractionStore((s) => s.setSelect)


  const id = processSignature(p.signature, unitMap, trueRootId, phase)
  const myParentId = 
    Array.isArray(p.signature) && p.signature.length > 0 
    ? 
    GetChildIdFromPath(trueRootId, p.signature.slice(0, -1), unitMap, phase) 
    : 
    undefined


  const handleClick = () => {
    if (!id) {
      console.warn("Incoret unit signature in UnitClickable! ", p.signature)
      return
    }

    if (shift && ctrl) {
      const dupId = duplicateUnit(id)

      if (myParentId) {
        addChild(myParentId, dupId, 1)
        return
      }

      addToUnitPalet(dupId)
      return
    }

    if (shift || ctrl) {
      if (myParentId) {
        addChild(myParentId, id, shift ? -1 : 1)
        return
      }

      shift ? removeFromUnitPalet(id) : addToUnitPalet(id)
      return
    }

    setSelected(p.signature);
  }

  return (
    <div onClick={handleClick} style={{ display: "contents" }}>
      {p.children}
    </div>
  );  
}