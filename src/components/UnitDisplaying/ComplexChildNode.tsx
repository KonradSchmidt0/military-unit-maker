import { useColorPalletStore } from "../../hooks/useColorPalletStore";
import { useHoverStore } from "../../hooks/useHoverStore";
import { usePhaseStore } from "../../hooks/usePhaseStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { processSignature, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { GetTrueColor } from "../../logic/Units/unitColorManaging";
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
  const { colorMap } = useColorPalletStore()
  const { phase } = usePhaseStore()
  
  const childId = processSignature(p.childSignature, unitMap, trueRootId, phase)
  const child = unitMap[childId ?? ""]
  if (!childId || !child) {
    console.warn("Unit with id: " + childId + " processed from signature: " + p.childSignature + " is undefined")
    return null
  }
  
  /// Problem: When parent has 0 of said child due to phase/attachments, the child has no flat index therefore
  // it's id has to be a string. But if child inherets the color from its parent it causes GetTrueColor function to return the
  // default color
  /// Solution: Give parents signature as a last attempt hoping it is path or does not ihenrets color
  const colorGiver = typeof p.childSignature === "string" && child.smartColor === "inheret" ? 
    p.parentSignature : p.childSignature
  const color = GetTrueColor(colorGiver, trueRootId, unitMap, colorMap, phase)

  const boxShadow = calculateUnitShadow(
    p.childSignature, selectedSignature, unitMap, trueRootId, curHoveredId, isDarkmode, colorMap, phase
  )

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