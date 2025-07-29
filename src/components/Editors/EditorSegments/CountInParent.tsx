import { useShortcutStore } from "../../../hooks/shortcutStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { removeAllOfAChild } from "../../../logic/childManaging";
import { OrgUnit } from "../../../logic/logic";

export default function CountInParent() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const selectedId = processSelect(useUnitInteractionStore(s => s.select), unitMap, trueRootId) as string
  const parentId = useUnitInteractionStore(s => s.getSelectedParent(unitMap, trueRootId))
  
  const selectParent = useUnitInteractionStore(s => s.selectParent)

  const updateUnit = useUnitStore(s => s.updateUnit)

  const [ctrl] = [useShortcutStore(s => s.isCtrlHeld)]

  
  if (!parentId || !selectedId)
    return null
  
  const parent = unitMap[parentId] as OrgUnit // By definition parent is org

  const selfInParent = parent.children[selectedId]
  const selfCountInParent = selfInParent ? selfInParent : 0

  return (
    <input
      id="count-in-parent"
      type="number"
      className="w-16 editor-element"
      value={selfCountInParent}
      onChange={e => {
        const newCount = parseInt(e.target.value);

        if (isNaN(newCount)) return;
        
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