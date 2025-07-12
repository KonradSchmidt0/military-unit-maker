import { updateUnit, useUnitStore } from "../../hooks/useUnitStore";

interface CommonUnitEditorSegmentProps {
  selectedUnitId: string;
}

export default function CommonUnitEditorSegment({ selectedUnitId }: CommonUnitEditorSegmentProps) {
  const selectedUnit = useUnitStore((state) => state.unitMap[selectedUnitId])
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUnit(selectedUnitId, {
      ...selectedUnit,
      name: e.target.value,
    });
  };

  return (
    <div className="border-slate-400 border-b-2 border-dashed p-2">
      <label className="flex flex-col gap-2">
        <span>Name:</span>
        <input
          type="text"
          value={selectedUnit.name}
          onChange={handleNameChange}
          className="p-1 border border-slate-300 bg-slate-800 text-white"
        />
      </label>
    </div> )
      
}
