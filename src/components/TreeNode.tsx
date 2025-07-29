import { useShortcutStore } from "../hooks/shortcutStore";
import { usePaletStore } from "../hooks/usePaletStore";
import { processSelect, useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../hooks/useUnitStore";
import { GetChildIdFromPath } from "../logic/childManaging";
import { defaultUnitColor, Unit } from "../logic/logic";
import { UnitDisplay } from "./UnitDisplay"

interface TreeNodeProps {
  unitId?: string;
  path?: number[];
  // Problem: If our color is 'inheret' and parents color is 'inheret' we would need extra hard way to search up the chain
  //   Also, node can appear without parent outside of a tree, or as a root. We have to handle those cases
  // Solution: Parent tree view calculates actual color, and sends it lower 
  calculatedParentColor?: `#${string}`; 
}

function TreeNode({ unitId = undefined, path = undefined, calculatedParentColor = undefined }: TreeNodeProps) {
  
  const [shift, ctrl] = [useShortcutStore((s) => s.isShiftHeld), useShortcutStore((s) => s.isCtrlHeld)]
  
  const addToUnitPalet = usePaletStore(s => s.addUnitToPalet)
  const removeFromUnitPalet = usePaletStore(s => s.removeUnitFromPalet)
  
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)
  
  const onHover = useUnitInteractionStore((s) => s.setHoveredId)
  const setSelected = useUnitInteractionStore((s) => s.setSelect)
  const parentId = useUnitInteractionStore(s => s.getSelectedParent)(unitMap, trueRootId)

  const selectedId = processSelect(useUnitInteractionStore(s => s.select), unitMap, trueRootId)
  
  const isSelected = unitId === selectedId
  const isHovered = unitId === useUnitInteractionStore(s => s.hoveredId)
  
  if (!unitId && !path) {
    console.warn("No path or id assigned!")
    return <>No path or id assigned!</>
  }

  const id = path ? GetChildIdFromPath(trueRootId, path, unitMap) : unitId as string

  const unit = unitMap[id] as Unit

  const handleClick = () => {
    if (shift && ctrl) {
      const dupId = duplicateUnit(id)

      if (parentId) {
        addChild(parentId, dupId, 1)
        return
      }

      addToUnitPalet(dupId)
      return
    }

    if (shift || ctrl) {
      if (parentId) {
        addChild(parentId, id, shift ? -1 : 1)
        return
      }

      shift ? removeFromUnitPalet(id) : addToUnitPalet(id)
      return
    }

    setSelected(path ?? id);
  }
 
  const color = unit.smartColor === "inheret" ? (calculatedParentColor ? calculatedParentColor : defaultUnitColor) : unit.smartColor
  
  const shadowSize = "3px"
  const shadowOpacityHex = isHovered || isSelected ? "bb" : "00"
  const shadowColor = isSelected ? color : "#bbbbbb"
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${shadowColor}${shadowOpacityHex}`
 
  return (
    <div className="flex justify-center">
      <div onMouseEnter={() => onHover(unitId)} onMouseLeave={() => onHover(undefined)} onClick={handleClick}>
        <UnitDisplay unitId={id} color={color} style={{ boxShadow: boxShadow }}/>
      </div>
    </div>
  );
}

export default TreeNode;
