import { useHoverStore } from "../../hooks/useHoverStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { processSignature, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { GetTrueColor } from "../../logic/childManaging";
import { DesignationPack } from "../../logic/designationPack";
import { calculateUnitShadow } from "./CalculateUnitShadow";
import { UnitClickable } from "./UnitClickable";
import { UnitDisplay } from "./UnitDisplay"
import { UnitHoverable } from "./UnitHoverable";

interface TreeNodeProps {
  signature: number[] | string
  dp?: DesignationPack
  stack?: number
  showLeftText?: boolean
  showRightText?: boolean
  overrideDisplayTextSetting?: boolean
}

function TreeNode(p: TreeNodeProps) {  
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const isDarkmode = useThemeStore(s => s.isDark)
  const selectedSignature = useUnitInteractionStore(s => s.selectSignature)
  const {id: curHoveredId } = useHoverStore(s => s)
  
  const myId = processSignature(p.signature, unitMap, trueRootId)

  if (!myId) {
    console.warn("Incorect path or id assigned to TreeNode! ", p.signature)
    return <>Something went wrong with signature :(</>
  }

  const color = GetTrueColor(p.signature, trueRootId, unitMap)
  const boxShadow = calculateUnitShadow(p.signature, selectedSignature, unitMap, trueRootId, curHoveredId, isDarkmode)
 
  return (
    <UnitHoverable signature={p.signature}>
      <UnitClickable signature={p.signature}>
        <UnitDisplay 
          unitId={myId} color={color} 
          style={{boxShadow: boxShadow}} className="transition-colors ring-white" 
          designationPack={p.dp ?? {}} stack={p.stack}
          showLeftText={p.showLeftText} showRightText={p.showRightText} overrideDisplayTextSetting={p.overrideDisplayTextSetting}
        />
      </UnitClickable>
    </UnitHoverable>
  );
}

export default TreeNode;
