import { useColorPalletStore } from "../../../hooks/useColorPalletStore";
import { usePhaseStore } from "../../../hooks/usePhaseStore";
import { SelectionSignature } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { GetTrueColor } from "../../../logic/Units/unitColorManaging";
import { UnitDisplay } from "../../UnitDisplaying/UnitDisplay";
import { UnitHoverable } from "../../UnitDisplaying/UnitHoverable";

interface props {
  parentSignature: SelectionSignature
  parentId: string
}

export default function AdvanceChildEditorsParentDisplay(p: props) {
  const { unitMap, trueRootId } = useUnitStore()
  const { colorMap } = useColorPalletStore()
  const { currentPhase: phase } = usePhaseStore()

  const color = GetTrueColor(p.parentSignature, trueRootId, unitMap, colorMap, phase)

  return (
    <UnitHoverable signature={p.parentSignature}>
      <UnitDisplay unitId={p.parentId} color={color} className="!w-20"/>
    </UnitHoverable>
  )
}