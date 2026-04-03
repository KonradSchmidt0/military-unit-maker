import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { OrgUnit, removeEquipmentTypeRecursively } from "../../../logic/logic";
import { getGroupedEquipmentTable } from "../../../logic/itemListing";
import { toggleGroup, useEquipGroupingStore } from "../../../hooks/useEquipGroupingStore";

export function EQListAndRemover() {
  const {unitMap, trueRootId, setUnitMap} = useUnitStore(s => s)
  const { groups, setGroups } = useEquipGroupingStore(s => s)
  const selectedId = processSelect(useUnitInteractionStore(s => s.selectSignature), unitMap, trueRootId) as string

  const equipmentEntries = getGroupedEquipmentTable(selectedId, unitMap, groups)
  const unit = unitMap[selectedId]

  const deleteEquipmentTypeFromAllChildren = (eqType: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove all "${eqType}" equipment from this unit and its children?`
    );
    if (!confirmed) return;

    const newSelectedUnit = removeEquipmentTypeRecursively(unit, eqType, unitMap) as OrgUnit;
    setUnitMap({
      ...unitMap,
      [selectedId]: newSelectedUnit,
    });
  };

  const unminimalizeTheGroup = (groupName: string) => setGroups(toggleGroup(groups, groupName))

  return (
  <div className="editor-segment-flex">
    <div className="flex justify-between gap-2 text-lg font-bold h-8">Equipment</div>
      {equipmentEntries.map(({name, count, type}) => (
        <div key={name} className="flex items-center gap-2">
          <div className="w-24">{name}</div>
          <div className="w-24 p-1 h-8">{count}</div>
          {type === "individual" && <button onClick={() => deleteEquipmentTypeFromAllChildren(name)} className="btn-emoji !p-0">❌</button>}
          {type === "group" && <button onClick={() => unminimalizeTheGroup(name)} className="btn-emoji !p-0">↔️</button>}
        </div>
      ))}
  </div>
  )
}