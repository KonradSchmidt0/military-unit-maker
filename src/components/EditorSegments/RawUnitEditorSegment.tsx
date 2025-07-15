import { useUnitQuick, useUnitStore } from "../../hooks/useUnitStore";
import { RawUnit } from "../../logic/logic";

interface RawUnitEditorSegmentProps {
  selectedUnitId: string;
}

export default function RawUnitEditorSegment({ selectedUnitId }: RawUnitEditorSegmentProps) {
  const unit = useUnitQuick(selectedUnitId) as RawUnit
  const updateUnit = useUnitStore((s) => s.updateUnit);

  if (!unit || unit.type !== "raw") {
    throw Error(`Unit ID or type wrong ID = ${selectedUnitId}, type = ${unit?.type}`)
  }

  const equipmentEntries = Object.entries(unit.equipment);

  const updateEquipment = (type: string, value: number) => {
    const newEquipment = { ...unit.equipment, [type]: value };
    updateUnit(selectedUnitId, { ...unit, equipment: newEquipment });
  };

  const deleteEquipment = (type: string) => {
    const newEquipment = { ...unit.equipment };
    delete newEquipment[type];
    updateUnit(selectedUnitId, { ...unit, equipment: newEquipment });
  };

  const addEquipment = () => {
    const newType = prompt("Enter new equipment type:");
    if (!newType) return;

    const newValue = parseInt(prompt("Enter quantity:") || "0", 10);
    if (isNaN(newValue)) return;

    updateEquipment(newType, newValue);
  };

  return (
    <div className="border-slate-400 border-b-2 border-dashed p-2 flex flex-col gap-2 items-center">
      <div className="flex justify-between gap-2">
        <span className="text-lg font-bold">Equipment</span>
        <button onClick={addEquipment} className="btn-editor">
          + Add
        </button>
      </div>

      {equipmentEntries.map(([type, value]) => (
        <div key={type} className="flex items-center gap-2">
          <span className="w-24">{type}</span>
          <input
            id={type}
            type="number"
            value={value}
            className="w-20 bg-slate-800 text-white border p-1"
            onChange={(e) => updateEquipment(type, parseInt(e.target.value))}
          />
          <button onClick={() => deleteEquipment(type)} className="text-red-400 hover:text-red-600">
            ❌
          </button>
        </div>
      ))}
    </div> )
}