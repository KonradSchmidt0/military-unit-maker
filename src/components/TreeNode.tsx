import { useShortcutStore } from "../hooks/shortcutStore";
import { usePaletStore } from "../hooks/usePaletStore";
import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../hooks/useUnitStore";
import { defaultUnitColor, Unit } from "../logic/logic";
import { GetRealColorRecusivelly, getUnitIdAtPath } from "../logic/unitPath";
import { UnitDisplay } from "./UnitDisplay"

interface TreeNodeProps {
  providedUnitId?: string;
  myPath?: number[];
}

function TreeNode({ providedUnitId, myPath }: TreeNodeProps) {
  const onHover = useUnitInteractionStore((s) => s.setHoveredId)
  const setOnlySelected = useUnitInteractionStore((s) => s.setOnlySelectedId)
  const setSelectedPath = useUnitInteractionStore((s) => s.setSelectedPath)
  
  const [shift, ctrl] = [useShortcutStore((s) => s.isShiftHeld), useShortcutStore((s) => s.isCtrlHeld)]
  
  const addToUnitPalet = usePaletStore(s => s.addUnitToPalet)
  const removeFromUnitPalet = usePaletStore(s => s.removeUnitFromPalet)
  
  const unitMap = useUnitStore(s => s.unitMap)
  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const actingRootId = useUnitStore(s => s.actingRootId)
  const curRootId = useUnitStore(s => s.getCurrentRootId(trueRootId, actingRootId))

  const isHovered = providedUnitId === useUnitInteractionStore(s => s.hoveredId)
  const isUnitSelected = providedUnitId === useUnitInteractionStore((s) => s.selectedId)
  const isNodeSelected = myPath === useUnitInteractionStore((s) => s.selectedPath)

  if (!providedUnitId && !myPath) {
    return <>No unitId AND no path!</>
  }

  const curUnitId = (myPath ? getUnitIdAtPath(curRootId, myPath, unitMap) : providedUnitId) as string
  const unit = unitMap[curUnitId] as Unit
  const acting_ParentId = (myPath ? getUnitIdAtPath(curRootId, myPath.slice(0, -1), unitMap) : undefined)

  
  const handleClick = () => {
    if (shift && ctrl) {
      const dupId = duplicateUnit(curUnitId)

      if (acting_ParentId) {
        addChild(acting_ParentId, dupId, 1)
        return
      }

      addToUnitPalet(dupId)
      return
    }

    if (shift || ctrl) {
      if (acting_ParentId) {
        addChild(acting_ParentId, curUnitId, shift ? -1 : 1)
        return
      }

      shift ? removeFromUnitPalet(curUnitId) : addToUnitPalet(curUnitId)
      return
    }

    myPath ? setSelectedPath(myPath, curRootId, unitMap) : setOnlySelected(curUnitId);
  }
 
  const color = myPath ? 
    GetRealColorRecusivelly(curRootId, myPath, unitMap) 
    : 
    (unit.smartColor === "inheret" ? defaultUnitColor : unit.smartColor )
  
  const shadowSize = "3px"
  const shadowOpacityHex = isHovered || isUnitSelected ? "bb" : "00"
  const shadowColor = isUnitSelected ? color : "#bbbbbb"
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${shadowColor}${shadowOpacityHex}`
 
  return (
    <div className="flex justify-center">
      <div onMouseEnter={() => onHover(providedUnitId)} onMouseLeave={() => onHover(undefined)} onClick={handleClick}>
        <UnitDisplay unitId={curUnitId} color={color} style={{ boxShadow: boxShadow }}/>
      </div>
    </div>
  );
}

export default TreeNode;
