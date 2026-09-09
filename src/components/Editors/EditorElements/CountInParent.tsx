import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePhaseStore } from "../../../hooks/usePhaseStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { setChildCount } from "../../../logic/Units/childManaging";
import { GetChildEntry, OrgUnit } from "../../../logic/Units/logic";
import { SafeNumberInput } from "./SafeInputs/SafeNumberInput";


export default function CountInParent() {
  const { unitMap, trueRootId, updateUnit  } = useUnitStore()
  const { selectSignature, getSelectedParent, selectParent  } = useUnitInteractionStore()
  const {ctrl} = useShortcutStore()
  const {phase} = usePhaseStore()

  const selectedId = processSelect(selectSignature, unitMap, trueRootId, phase)
  const parentId = getSelectedParent(unitMap, trueRootId, phase)
  
  if (!parentId || !selectedId)
    return null
  
  const parent = unitMap[parentId] as OrgUnit // By definition parent is org

  const selfInParent = GetChildEntry(parent, phase, selectedId)?.count
  const selfCountInParent = selfInParent ? selfInParent : 0

  return (
    <SafeNumberInput
      id="count-in-parent"
      count={selfCountInParent}
      onCountChange={ (newCount: number) => {
        const n = Math.max(newCount, 0)

        const updatedParent = setChildCount(parent, selectedId, n)

        updateUnit(parentId, updatedParent);

        if (ctrl) {
          selectParent()
        }
      }}
    />
  )
}