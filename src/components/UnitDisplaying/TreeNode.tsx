import { useHoverStore } from "../../hooks/useHoverStore";
import { processSelect, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { GetChildIdFromPath, GetTrueColorRecursively } from "../../logic/childManaging";
import { DesignationPack } from "../../logic/designationPack";
import { defaultUnitColor } from "../../logic/logic";
import { UnitClickable } from "./UnitClickable";
import { UnitDisplay } from "./UnitDisplay"

interface TreeNodeProps {
  unitId?: string;
  path?: number[];
  dp?: DesignationPack
  stack?: number
}

function TreeNode(p: TreeNodeProps) {  
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  
  const slct = useUnitInteractionStore(s => s.select)
  const selectedId = processSelect(slct, unitMap, trueRootId)
  const {id: curHovered, call: onHover} = useHoverStore(s => s)
  
  const id = p.path ? GetChildIdFromPath(trueRootId, p.path, unitMap) : p.unitId

  if (!id) {
    console.warn("Incorect path or id assigned to TreeNode! ", p.unitId, p.path)
    return <>No path or id assigned!</>
  }
  
  const isSelectedInstance = Array.isArray(slct) && p.path?.toString() === slct.toString()
  const isSelectedType = id === selectedId && !isSelectedInstance
  const isHovered = id === curHovered && !(isSelectedInstance || isSelectedType)
 
  const smartColor = unitMap[id].smartColor
  const color = p.path ? GetTrueColorRecursively(trueRootId, p.path, unitMap) : (smartColor === "inheret" ? defaultUnitColor : smartColor)
  
  // We use user choosen colors, so we're using raw styling, not css/tailwind
  const shadowSize = isSelectedInstance ? "4px" : "2px"
  const shadowOpacityHex = isHovered || isSelectedType || isSelectedInstance ? "dd" : "00"
  const shadowColor = isHovered ? "#888888" : color
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${shadowColor}${shadowOpacityHex}`  
 
  return (
    <div className="flex justify-center">
      <div onMouseEnter={(e) => onHover(id, {left: e.clientX, top: e.clientY})} onMouseLeave={() => onHover(undefined)} >
        <UnitClickable signature={p.path ?? p.unitId as string}>
          <UnitDisplay 
            unitId={id} color={color} 
            style={{boxShadow: boxShadow}} className="transition-colors ring-white" 
            designationPack={p.dp ?? {}} stack={p.stack}
            showText={true}
          />
        </UnitClickable>
      </div>
    </div>
  );
}

export default TreeNode;
