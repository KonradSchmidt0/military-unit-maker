import { usePaletStore } from "../../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { UnitMap, useUnitQuick, useUnitStore } from "../../../hooks/useUnitStore";
import { addNewChildUnit, ChildrenList, getEquipmentTable, OrgUnit, removeAllOfAChild, removeEquipmentTypeRecursively } from "../../../logic/logic";

export default function OrgUnitEditorSegment() {
  const selectedUnitId = useUnitInteractionStore((s) => s.selectedId) as string
  const unit = useUnitQuick(selectedUnitId) as OrgUnit
  // Used later
  const unitMap = useUnitStore((state) => state.unitMap)
  const updateUnitMap = useUnitStore((state) => state.setUnitMap)
  const updateUnit = useUnitStore(s => s.updateUnit)
  
  const equipmentEntries = Object.entries(getEquipmentTable(selectedUnitId, unitMap));

  /// Children Manager
  // If given all units as a option its possible to choose yourself or other dangerous unit, and creating infinite loop
  // As such, we filter them
  const safeChildrenOptions = getSafeChildOptions(selectedUnitId, unitMap, usePaletStore(state => state.unitPalet), unit.children)

  const handleAddingChildren = (type: "raw" | "org") => {
    const { newUnitMap, updatedParent } = addNewChildUnit(
      unit as OrgUnit,
      unitMap,
      type
    );

    // Apply to zustand
    updateUnitMap(newUnitMap);
    updateUnit(selectedUnitId, updatedParent);
  }

  const deleteEquipmentTypeFromAllChildren = (type: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove all "${type}" equipment from this unit and its children? It will affect many units, and can't be undone`
    );
    if (!confirmed) return;

    const newSelectedUnit = removeEquipmentTypeRecursively(unit, type, unitMap) as OrgUnit;
    updateUnitMap({
      ...unitMap,
      [selectedUnitId]: newSelectedUnit,
    });
  };


  const childrenHeader = (
    <div className="flex justify-between gap-2">
      <span className="text-lg font-bold">Children</span>
      <button onClick={() => handleAddingChildren("org")} className="btn-editor">
        + Org
      </button>
      <button onClick={() => handleAddingChildren("raw")} className="btn-editor">
        + Raw
      </button>
    </div>
  )
  const childrenManager = Object.entries(unit.children).map(([childId, count], index) =>  {
      /// Since the safe function retuns only the not used items, its necesary to add self to it, 
      // or else it breaks UI and potentialy logic
      const childUnit = unitMap[childId];
      const safeUnitsPlusMyself: UnitMap = { ...safeChildrenOptions, [childId]: childUnit, };
      return (
        <div key={childId} className="flex flex-row items-center gap-2 mb-2">
          {/* Dropdown to change the child.unitId */}
          <select
            className="border rounded px-2 py-1 bg-slate-800 text-white w-44"
            value={childId}
            id={childId}
            onChange={(e) => {
              let updatedChildren = unit.children;
              const newId = e.target.value;

              delete updatedChildren[childId]
              updatedChildren[newId] = count
              updateUnit(selectedUnitId, { ...unit, children: updatedChildren });
            }}
          >
            {Object.entries(safeUnitsPlusMyself).map(([id, u]) => (
              <option key={id} value={id}>
                {u.name}
              </option>
            ))}
          </select>

          {/* Input to change count */}
          <input
            type="number"
            className="w-12 px-2 py-1 rounded border bg-slate-800 text-white"
            value={count}
            onChange={(e) => {
              const newCount = parseInt(e.target.value);

              if (newCount === 0) {
                updateUnit(selectedUnitId,  removeAllOfAChild(unit, childId) )
                return
              }

              let updatedChildren = unit.children
              updatedChildren[childId] = newCount
              updateUnit(selectedUnitId, { ...unit, children: updatedChildren });
            }}
          />

          {/* Button to remove this child entry */}
          <button
            className="btn-emoji !p-0"
            onClick={() => {
              const updated = removeAllOfAChild(unit, childId);
              updateUnit(selectedUnitId, updated);
            }}
          >
            ❌
          </button>
        </div>
      );
    }
  );

  /// EQ list
  const eqList = 
    <>
      <div className="flex justify-between gap-2 text-lg font-bold h-8">Equipment</div>
      {equipmentEntries.map(([type, value]) => (
        <div key={type} className="flex items-center gap-2">
          <div className="w-24">{type}</div>
          <div className="w-24 p-1 h-8">{value}</div>
          <button onClick={() => deleteEquipmentTypeFromAllChildren(type)} className="btn-emoji !p-0">❌</button>
        </div>
      ))}
    </>
  
  return (
    <div className="border-slate-400 border-b-2 border-dashed p-2 flex flex-col gap-2 items-center">
      {childrenHeader}
      {childrenManager}
      {eqList}
    </div>
  )
  
}

function getSafeChildOptions(
  parentId: string,
  unitMap: UnitMap,
  palet: string[],
  alreadyChosenChildren: ChildrenList
): UnitMap {
  const existingIds = new Set(Object.entries(alreadyChosenChildren).map((c) => c[0]));

  function createsCycle(candidateId: string): boolean {
    if (candidateId === parentId) return true;

    const candidate = unitMap[candidateId];
    if (!candidate || candidate.type !== "org") return false;

    for (const [childId] of Object.entries(candidate.children)) {
      if (createsCycle(childId)) return true;
    }

    return false;
  }

  return Object.fromEntries(
    palet
      .filter((id) => !existingIds.has(id) && !createsCycle(id))
      .map((id) => [id, unitMap[id]])
  );
}
