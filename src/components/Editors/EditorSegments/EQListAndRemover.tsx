import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { OrgUnit, removeEquipmentTypeRecursively } from "../../../logic/logic";
import { getGroupedEquipmentTable, getGroupFromSingleItem } from "../../../logic/itemListing";
import { EquipGroup, toggleGroup, useEquipGroupingStore } from "../../../hooks/useEquipGroupingStore";
import { useHoverStore } from "../../../hooks/useHoverStore";

export function EQListAndRemover() {
  const {unitMap, trueRootId, setUnitMap} = useUnitStore(s => s)
  const { groups, setGroups } = useEquipGroupingStore(s => s)
  const selectedId = processSelect(useUnitInteractionStore(s => s.selectSignature), unitMap, trueRootId) as string
  const { callSimpleI, callOff } = useHoverStore(s => s)

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

  const toggleTheGroup = (groupName: string) => setGroups(toggleGroup(groups, groupName))

  const onDoubleClick = (myGroup: EquipGroup | undefined) => {
    if (!myGroup) {
      return
    }
    toggleTheGroup(myGroup.name)
  }

  const onMouseEnter = (itemName: string, myGroup: EquipGroup | undefined) => {
    if (!myGroup) {
      return
    }
    callSimpleI({header: `${myGroup.name}/${itemName}`, desc: "Double click me to fold my item group!"})
  }

  return (
  <div className="editor-segment-flex">
    <div className="flex justify-between gap-2 text-lg font-bold h-8">Equipment</div>

    {equipmentEntries.map(({name, count, type, group}) => { 
      const style = group ? {color: group.color} : undefined;
      return (
        <div key={name} className="flex items-center gap-2" style={style}>
          <b 
            onDoubleClick={() => onDoubleClick(group)} 
            onMouseEnter={() => onMouseEnter(name, group)} onMouseLeave={callOff} 
            className="w-24"
          >
            {name}
          </b>
          <b className="w-24 p-1 h-8">{count}</b>
          {type === "individual" && <button onClick={() => deleteEquipmentTypeFromAllChildren(name)} className="btn-emoji !p-0">❌</button>}
          {type === "group" && <button onClick={() => toggleTheGroup(name)} className="btn-emoji !p-0">↔️</button>}
        </div>
      )
    })}
  </div>
  )
}