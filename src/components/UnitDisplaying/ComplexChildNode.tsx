import { useHoverStore } from "../../hooks/useHoverStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { processSignature, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { GetTrueColor } from "../../logic/childManaging";
import { calculateUnitShadow } from "./CalculateUnitShadow";
import { UnitClickableIdSwap } from "./UnitClickable/UnitClickableIdSwap";
import { UnitDisplay } from "./UnitDisplay";
import { UnitHoverable } from "./UnitHoverable";

interface props {
  parentSignature: string | number[]
  childSignature: string | number[]
  disableShadow: boolean
  whoSelectOnSelectClick: string | number[]
}

export function ComplexChildNode(p: props) {
  const { unitMap, trueRootId } = useUnitStore(s => s)
  const isDarkmode = useThemeStore(s => s.isDark)
  const selectedSignature = useUnitInteractionStore(s => s.selectSignature)
  const {id: curHoveredId} = useHoverStore(s => s)
  
  const childId = processSignature(p.childSignature, unitMap, trueRootId)
  if (!childId) {
    console.warn("Unit with id: " + childId + " processed from signature: " + p.childSignature + " is undefined")
    return null
  }
    
  const color = GetTrueColor(p.childSignature, trueRootId, unitMap)
  const boxShadow = calculateUnitShadow(p.childSignature, selectedSignature, unitMap, trueRootId, curHoveredId, isDarkmode)

  return (
    <UnitClickableIdSwap parentSignature={p.parentSignature} childSignature={p.childSignature} whoSelectOnSelectClick={p.whoSelectOnSelectClick}>
      <UnitHoverable signature={p.childSignature}>
        <UnitDisplay 
          unitId={childId} color={color} className="!mt-1 transition-colors ring-white"
          style={{boxShadow: p.disableShadow ? "" : boxShadow}}
        />
      </UnitHoverable>
    </UnitClickableIdSwap>
  )
}