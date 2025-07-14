import { updateUnit, useDuplicateUnit, useUnitStore } from "../../hooks/useUnitStore";
import { addChild, OrgUnit, removeChild } from "../../logic/logic";

interface CommonUnitEditorSegmentProps {
  selectedUnitId: string;
  setSelected_NotTouchingParent: Function;
  selectedUnitParentId?: string
}

export default function CommonUnitEditorSegment({ selectedUnitId, setSelected_NotTouchingParent, selectedUnitParentId }: CommonUnitEditorSegmentProps) {
  // We are getting whole map since later we will need to get other unit in a conditional, and u can only use hooks at top
  const unitMap = useUnitStore((state) => state.unitMap);

  const selectedUnit = unitMap[selectedUnitId]
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
    setSelected_NotTouchingParent(newId)
    let parent = unitMap[selectedUnitParentId] as OrgUnit // By definition parent is an OrgUnit
    parent = removeChild(parent, selectedUnitId)
    parent = addChild(parent, newId)
    updateUnit(selectedUnitParentId, parent);
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

      <button className="btn-editor" onClick={() => handleUnlinking(selectedUnitId)}>Unlink</button>
    </div> )
      
}
