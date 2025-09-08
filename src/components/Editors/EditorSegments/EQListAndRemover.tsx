import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { getEquipmentTable, OrgUnit, removeEquipmentTypeRecursively } from "../../../logic/logic";

interface EQListAndRemoverProps {

}

export function EQListAndRemover(p : EQListAndRemoverProps) {
  const {unitMap, trueRootId, setUnitMap} = useUnitStore(s => s)
  const selectedId = processSelect(useUnitInteractionStore(s => s.selectSignature), unitMap, trueRootId) as string

  const equipmentEntries = Object.entries(getEquipmentTable(selectedId, unitMap));
  const unit = unitMap[selectedId]

  const deleteEquipmentTypeFromAllChildren = (type: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove all "${type}" equipment from this unit and its children?`
    );
    if (!confirmed) return;

    const newSelectedUnit = removeEquipmentTypeRecursively(unit, type, unitMap) as OrgUnit;
    setUnitMap({
      ...unitMap,
      [selectedId]: newSelectedUnit,
    });
  };

  return (
  <div className="editor-segment-flex">
    <div className="flex justify-between gap-2 text-lg font-bold h-8">Equipment</div>
      {equipmentEntries.map(([type, value]) => (
        <div key={type} className="flex items-center gap-2">
          <div className="w-24">{type}</div>
          <div className="w-24 p-1 h-8">{value}</div>
          <button onClick={() => deleteEquipmentTypeFromAllChildren(type)} className="btn-emoji !p-0">❌</button>
        </div>
      ))}
  </div>
  )
}