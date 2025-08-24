import { useShortcutStore } from "../../hooks/shortcutStore"
import { usePaletStore } from "../../hooks/usePaletStore"
import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../hooks/useUnitStore"
import { GetChildIdFromPath } from "../../logic/childManaging"

interface props {
  signature: string | number[]
}

export function UnitClickable(p: React.PropsWithChildren<props>) {
  const {unitMap, trueRootId} = useUnitStore(s => s)

  const [shift, ctrl] = [useShortcutStore((s) => s.isShiftHeld), useShortcutStore((s) => s.isCtrlHeld)]
  
  const addToUnitPalet = usePaletStore(s => s.addUnitToPalet)
  const removeFromUnitPalet = usePaletStore(s => s.removeUnitFromPalet)

  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)

  const setSelected = useUnitInteractionStore((s) => s.setSelect)


  const id = Array.isArray(p.signature) ? GetChildIdFromPath(trueRootId, p.signature, unitMap) : p.signature
  const myParentId = Array.isArray(p.signature) && p.signature.length > 0 ? GetChildIdFromPath(trueRootId, p.signature.slice(0, -1), unitMap) : undefined


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