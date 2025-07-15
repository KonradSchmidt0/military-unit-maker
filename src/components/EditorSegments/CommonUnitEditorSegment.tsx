import { usePaletStore } from "../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { updateUnit, useDuplicateUnit, useUnitStore } from "../../hooks/useUnitStore";
import { addChild, OrgUnit, removeAllOfAChild, removeChild } from "../../logic/logic";

interface CommonUnitEditorSegmentProps {
  popNewParentForRoot: Function
}

export default function CommonUnitEditorSegment({ popNewParentForRoot }: CommonUnitEditorSegmentProps) {
  const selectedUnitId = useUnitInteractionStore((s) => s.selectedId) as string
  const selectedUnitParentId = useUnitInteractionStore((s) => s.selected_parentId) as string
  const setSelectedId = useUnitInteractionStore((s) => s.setSelectedId)

  // We are getting whole map since later we will need to get other unit in a conditional, and u can only use hooks at top
  const unitMap = useUnitStore((state) => state.unitMap);
  const unitPalet = usePaletStore((state) => state.unitPalet)
  const addUnitToPalet = usePaletStore((state) => state.addUnitToPalet);
  const removeUnitFromPalet = usePaletStore((state) => state.removeUnitFromPalet);

  const selectedUnit = unitMap[selectedUnitId]
  const selectedUnitParent = unitMap[selectedUnitParentId] as OrgUnit // By definitiion parent is orgUnit

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUnit(selectedUnitId, {
      ...selectedUnit,
      name: e.target.value,
    });
  };

  const duplicateUnit = useDuplicateUnit()

  function handleUnlinking(id: string) {
    if (!selectedUnitParentId)
      return

    const newId = duplicateUnit(id);
    setSelectedId(newId)
    let p = unitMap[selectedUnitParentId] as OrgUnit // By definition parent is an OrgUnit
    p = removeChild(p, selectedUnitId)
    p = addChild(p, newId)
    updateUnit(selectedUnitParentId, p);
  }

  return (
    <div className="border-slate-400 border-b-2 border-dashed p-2 flex flex-col gap-2 items-center">
      <label className="flex flex-col gap-2 w-full ">
        <span className="font-bold">Name:</span>
        <input
          type="text"
          value={selectedUnit.name}
          onChange={handleNameChange}
          className="p-1 border border-slate-300 bg-slate-800 text-white"
        />
      </label>

      <div className="flex flex-row gap-2">
        {selectedUnitParentId ? <button className="btn-editor" onClick={() => handleUnlinking(selectedUnitId)}>Unlink</button> : null}
        {selectedUnitParentId === undefined ? <button className="btn-editor" onClick={() => popNewParentForRoot()}>New Root</button> : null}
        {unitPalet.includes(selectedUnitId) ? <button onClick={() => removeUnitFromPalet(selectedUnitId)}>✔️🎨</button> : null}
        {!unitPalet.includes(selectedUnitId) ? <button onClick={() => addUnitToPalet(selectedUnitId)}>❌🎨</button> : null}
      </div>
      
      {/* WIP. Possibly moved to a new file in the future */}
      { selectedUnitParentId ? <div className="flex flex-row items-center gap-2 mb-2">
        <input
          type="number"
          className="w-12 px-2 py-1 rounded border bg-slate-800 text-white"
          value={selectedUnitParent.children.find((a) => a.unitId === selectedUnitId)?.count}
          onChange={(e) => {
            const newCount = parseInt(e.target.value);

            if (isNaN(newCount)) return;

            if (newCount === 0) {
              updateUnit(
                selectedUnitParentId,
                removeAllOfAChild(selectedUnitParent, selectedUnitId)
              );
              return;
            }

            const updatedChildren = selectedUnitParent.children.map((child) =>
              child.unitId === selectedUnitId ? { ...child, count: newCount } : child
            );

            updateUnit(selectedUnitParentId, {
              ...selectedUnitParent,
              children: updatedChildren,
            });
          }}
        />
      </div> : null}
    </div> )
      
}
