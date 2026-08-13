import { useShortcutStore } from "../../../hooks/shortcutStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { removeAllOfAChild } from "../../../logic/Units/childManaging";
import { OrgUnit } from "../../../logic/Units/logic";
import { SafeNumberInput } from "./SafeInputs/SafeNumberInput";

export default function CountInParent() {
  const { unitMap, trueRootId, updateUnit  } = useUnitStore()
  const { selectSignature, getSelectedParent, selectParent  } = useUnitInteractionStore()
  const {ctrl} = useShortcutStore()

  const selectedId = processSelect(selectSignature, unitMap, trueRootId)
  const parentId = getSelectedParent(unitMap, trueRootId)
  
  if (!parentId || !selectedId)
    return null
  
  const parent = unitMap[parentId] as OrgUnit // By definition parent is org

  const selfInParent = parent.children[selectedId]
  const selfCountInParent = selfInParent ? selfInParent : 0

  return (
    <SafeNumberInput
      id="count-in-parent"
      count={selfCountInParent}
      onCountChange={ (newCount: number) => {
        if (newCount <= 0) {
          updateUnit(parentId, removeAllOfAChild(parent, selectedId))
          return
        }

        let updatedChildren = parent.children
        updatedChildren[selectedId] = newCount

        updateUnit(parentId, {
          ...parent,
          children: updatedChildren,
        });

        if (ctrl) {
          selectParent()
        }
      }}
    />
  )
}