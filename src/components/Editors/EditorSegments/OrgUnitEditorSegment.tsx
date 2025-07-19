import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePaletStore } from "../../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { UnitMap, useUnitQuick, useUnitStore } from "../../../hooks/useUnitStore";
import { removeAllOfAChild } from "../../../logic/childManaging";
import { ChildrenList, getEquipmentTable, OrgUnit, removeEquipmentTypeRecursively } from "../../../logic/logic";

export default function OrgUnitEditorSegment() {
  const selectedUnitId = useUnitInteractionStore(s => s.selectedId) as string
  const unit = useUnitQuick(selectedUnitId) as OrgUnit
  const setSelected = useUnitInteractionStore(s => s.setSelectedId)
  const setParent = useUnitInteractionStore(s => s.setSelected_parentId)
  // Used later
  const unitMap = useUnitStore(s => s.unitMap)
  const updateUnitMap = useUnitStore(s => s.setUnitMap)
  const updateUnit = useUnitStore(s => s.updateUnit)
  const addChild = useUnitStore(s => s.creatNewChild)

  const [ctrl] = [useShortcutStore(s => s.isCtrlHeld)]
  
  const equipmentEntries = Object.entries(getEquipmentTable(selectedUnitId, unitMap));

  /// Children Manager
  // If given all units as a option its possible to choose yourself or other dangerous unit, and creating infinite loop
  // As such, we filter them
  const safeChildrenOptions = getSafeChildOptions(selectedUnitId, unitMap, usePaletStore(state => state.unitPalet), unit.children)

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
    <div className="editor-segment-row">
      <span className="text-lg font-bold">Children</span>
      <button onClick={() => {const c = addChild(selectedUnitId, "org"); if (ctrl) {setParent(selectedUnitId); setSelected(c); }}} className="btn-editor">
        + Org
      </button>
      <button onClick={() => {const c = addChild(selectedUnitId, "raw"); if (ctrl) {setParent(selectedUnitId); setSelected(c); }}} className="btn-editor">
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
      <div key={childId} className="editor-segment-row">
        {/* Dropdown to change the child.unitId */}
        <select
          className="editor-element !w-36"
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
          className="editor-element !w-16"
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

            if (ctrl) {
              setParent(selectedUnitId)
              setSelected(childId)
            }
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
  } );

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
    <div className="editor-segment-flex">
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
