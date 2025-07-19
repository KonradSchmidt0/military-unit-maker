import { useShortcutStore } from "../../../hooks/shortcutStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { removeAllOfAChild } from "../../../logic/childManaging";
import { OrgUnit } from "../../../logic/logic";

export default function CountInParent() {
  const unitMap = useUnitStore(s => s.unitMap)
  const updateUnit = useUnitStore(s => s.updateUnit)

  const selectedId = useUnitInteractionStore(s => s.selectedId)
  const parentId = useUnitInteractionStore(s => s.selected_parentId)
  const setSelectedId = useUnitInteractionStore(s => s.setSelectedId)
  const setParentId = useUnitInteractionStore(s => s.setSelected_parentId)

  const [ctrl] = [useShortcutStore(s => s.isCtrlHeld)]

  const parent = unitMap[parentId as string] as OrgUnit // By definition parent is org

  if (!parentId || !selectedId)
    return null

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
          setParentId(undefined)
          setSelectedId(parentId)
        }
      }}
    />
  )
}