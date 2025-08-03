import { useShortcutStore } from "../../hooks/shortcutStore";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { usePaletStore } from "../../hooks/usePaletStore";
import { processSelect, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { GetChildIdFromPath, GetTrueColorRecursively } from "../../logic/childManaging";
import { getDesignationPack } from "../../logic/designationPack";
import { defaultUnitColor } from "../../logic/logic";
import { UnitDisplay } from "./UnitDisplay"

interface TreeNodeProps {
  unitId?: string;
  path?: number[];
}

function TreeNode(p: TreeNodeProps) {
  
  const [shift, ctrl] = [useShortcutStore((s) => s.isShiftHeld), useShortcutStore((s) => s.isCtrlHeld)]
  
  const addToUnitPalet = usePaletStore(s => s.addUnitToPalet)
  const removeFromUnitPalet = usePaletStore(s => s.removeUnitFromPalet)
  
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)
  
  const onHover = useUnitInteractionStore((s) => s.setHoveredId)
  const setSelected = useUnitInteractionStore((s) => s.setSelect)
  
  const selectedId = processSelect(useUnitInteractionStore(s => s.select), unitMap, trueRootId)
  const curHovered = useUnitInteractionStore(s => s.hoveredId)
  
  const staffComments = useGlobalStore(s => s.staffComments)
  
  if (!p.unitId && !p.path) {
    console.warn("No path or id assigned!")
    return <>No path or id assigned!</>
  }
  
  const id = p.path ? GetChildIdFromPath(trueRootId, p.path, unitMap) : p.unitId as string
  const myParentId = p.path && p.path.length > 0 ? GetChildIdFromPath(trueRootId, p.path.slice(0, -1), unitMap) : undefined
  
  const isSelected = id === selectedId
  const isHovered = id === curHovered

  const handleClick = () => {
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

    setSelected(p.path ?? id);
  }

  const dp = p.path ? getDesignationPack(p.path, unitMap, trueRootId, staffComments) : {}
 
  const smartColor = unitMap[id].smartColor
  const color = p.path ? GetTrueColorRecursively(trueRootId, p.path, unitMap) : (smartColor === "inheret" ? defaultUnitColor : smartColor)
  
  // We use user choosen colors, so we're using raw styling, not css/tailwind
  const shadowSize = "3px"
  const shadowOpacityHex = isHovered || isSelected ? "bb" : "00"
  const shadowColor = isSelected ? color : "#bbbbbb"
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${shadowColor}${shadowOpacityHex}`
 
  return (
    <div className="flex justify-center">
      <div onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(undefined)} onClick={handleClick}>
        <UnitDisplay unitId={id} color={color} style={{ boxShadow: boxShadow }} designationPack={dp}/>
      </div>
    </div>
  );
}

export default TreeNode;
