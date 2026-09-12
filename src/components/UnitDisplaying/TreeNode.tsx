import { useHoverStore } from "../../hooks/useHoverStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { processSignature, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { GetTrueColor } from "../../logic/Units/unitColorManaging";
import { DesignationPack } from "../../logic/Designations/designationPack";
import { calculateUnitShadow } from "./CalculateUnitShadow";
import { UnitClickableSelect } from "./UnitClickable/UnitClickableSelect";
import { UnitDisplay } from "./UnitDisplay"
import { UnitHoverable } from "./UnitHoverable";
import { useColorPalletStore } from "../../hooks/useColorPalletStore";
import { usePhaseStore } from "../../hooks/usePhaseStore";

interface TreeNodeProps {
  signature: number[] | string
  dp?: DesignationPack
  stack?: number
  showLeftText?: boolean
  showRightText?: boolean
  overrideDisplayTextSetting?: boolean
}

function TreeNode(p: TreeNodeProps) {  
  const {unitMap, trueRootId} = useUnitStore()
  const isDarkmode = useThemeStore(s => s.isDark)
  const selectedSignature = useUnitInteractionStore(s => s.selectSignature)
  const {id: curHoveredId } = useHoverStore(s => s)
  const {colorMap} = useColorPalletStore()
  const { currentPhase: phase } = usePhaseStore()
  
  const myId = processSignature(p.signature, unitMap, trueRootId, phase)

  if (!myId) {
    console.warn("Incorect path or id assigned to TreeNode! ", p.signature)
    return <>Something went wrong with signature :(</>
  }

  const color = GetTrueColor(p.signature, trueRootId, unitMap, colorMap, phase)
  const boxShadow = calculateUnitShadow(
    p.signature, selectedSignature, unitMap, trueRootId, curHoveredId, isDarkmode, colorMap, phase
  )
 
  return (
    <UnitHoverable signature={p.signature}>
      <UnitClickableSelect signature={p.signature}>
        <UnitDisplay 
          unitId={myId} color={color} 
          style={{boxShadow: boxShadow}} className="transition-colors ring-white" 
          designationPack={p.dp ?? {}} stack={p.stack}
          showLeftText={p.showLeftText} showRightText={p.showRightText} overrideDisplayTextSetting={p.overrideDisplayTextSetting}
        />
      </UnitClickableSelect>
    </UnitHoverable>
  );
}

export default TreeNode;
