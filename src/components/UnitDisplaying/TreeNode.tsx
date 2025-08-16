import { useGlobalStore } from "../../hooks/useGlobalStore";
import { useHoverStore } from "../../hooks/useHoverStore";
import { processSelect, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { GetChildIdFromPath, GetTrueColorRecursively } from "../../logic/childManaging";
import { getDesignationPack } from "../../logic/designationPack";
import { defaultUnitColor, OrgUnit } from "../../logic/logic";
import { UnitClickable } from "./UnitClickable";
import { UnitDisplay } from "./UnitDisplay"

interface TreeNodeProps {
  unitId?: string;
  path?: number[];
}

function TreeNode(p: TreeNodeProps) {  
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  
  const slct = useUnitInteractionStore(s => s.select)
  const selectedId = processSelect(slct, unitMap, trueRootId)
  const {id: curHovered, call: onHover} = useHoverStore(s => s)
  
  const {staffComments, staffNames, stacking} = useGlobalStore(s => s)
  
  if (!p.unitId && !p.path) {
    console.warn("No path or id assigned!")
    return <>No path or id assigned!</>
  }
  
  const id = p.path ? GetChildIdFromPath(trueRootId, p.path, unitMap) : p.unitId as string
  const myParentId = p.path && p.path.length > 0 ? GetChildIdFromPath(trueRootId, p.path.slice(0, -1), unitMap) : undefined
  
  const isSelectedInstance = Array.isArray(slct) && p.path?.toString() === slct.toString()
  const isSelectedType = id === selectedId && !isSelectedInstance
  const isHovered = id === curHovered && !(isSelectedInstance || isSelectedType)
  
  let amIStacked = false
  let countInParent = undefined
  if (myParentId && stacking) {
    countInParent = (unitMap[myParentId] as OrgUnit).children[id]
    const multipleInParent = countInParent > 1
    amIStacked = multipleInParent ? true : false
  }

  let dp = p.path && !amIStacked ? 
    getDesignationPack(p.path, unitMap, trueRootId, staffNames, staffComments) 
    : 
    {}
 
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
            designationPack={dp} countInParent={countInParent}
            showText={true}
          />
        </UnitClickable>
      </div>
    </div>
  );
}

export default TreeNode;
