import { UnitMap, updateUnit, useUnitQuick, useUnitStore } from "../../hooks/useUnitStore";
import { addNewChildUnit, getEquipmentTable, OrgUnit, removeAllOfAChild } from "../../logic/logic";

interface OrgUnitEditorSegmentProps {
  selectedUnitId: string;
}

export default function OrgUnitEditorSegment({ selectedUnitId }: OrgUnitEditorSegmentProps) {
  const unit = useUnitQuick(selectedUnitId) as OrgUnit
  const equipmentEntries = Object.entries(getEquipmentTable(selectedUnitId));
  // Used later
  const unitPallet = useUnitStore((state) => state.unitMap)
  const updateUnitPlallet = useUnitStore((state) => state.setUnitMap)

  /// Children Manager
  // If given all units as a option its possible to choose yourself or other dangerous unit, and creating infinite loop
  // As such, we filter them
  const safeChildrenOptions = getSafeChildOptions(selectedUnitId, unitPallet, unit.children)

  const handleAddingChildren = (type: "raw" | "org") => {
    const { newUnitMap, updatedParent } = addNewChildUnit(
      unit as OrgUnit,
      unitPallet,
      type
    );

    // Apply to zustand
    updateUnitPlallet(newUnitMap);
    updateUnit(selectedUnitId, updatedParent);
  }

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
  const childrenManager = unit.children.map((child, index) => 
    {
      /// Syntax?????? Brain worms WTH javascript
      /// Since the safe function retuns only the not used items, its necesary to add self to it, 
      // or else it breaks UI and potentialy logic
      const childUnit = unitPallet[child.unitId];
      const safeUnitsPlusMyself: UnitMap = { ...safeChildrenOptions, [child.unitId]: childUnit, };
      return (
        <div key={child.unitId} className="flex flex-row items-center gap-2 mb-2">
          {/* Dropdown to change the child.unitId */}
          <select
            className="border rounded px-2 py-1 bg-slate-800 text-white w-44"
            value={child.unitId}
            id={child.unitId}
            onChange={(e) => {
              const newId = e.target.value;
              let updatedChildren = [...unit.children];
              updatedChildren[index] = { ...updatedChildren[index], unitId: newId };
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
            value={child.count}
            onChange={(e) => {
              const newCount = parseInt(e.target.value);

              if (newCount === 0) {
                updateUnit(selectedUnitId,  removeAllOfAChild(unit, child.unitId) )
                return
              }

              let updatedChildren = [...unit.children];
              updatedChildren[index] = { ...updatedChildren[index], count: newCount };
              updateUnit(selectedUnitId, { ...unit, children: updatedChildren });
            }}
          />

          {/* Button to remove this child entry */}
          <button
            className="text-red-400 hover:text-red-600"
            onClick={() => {
              const updated = removeAllOfAChild(unit, child.unitId);
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
  alreadyChosenChildren: { unitId: string; count: number }[]
): UnitMap {
  const existingIds = new Set(alreadyChosenChildren.map((c) => c.unitId));

  function createsCycle(candidateId: string): boolean {
    if (candidateId === parentId) return true;

    const candidate = unitMap[candidateId];
    if (!candidate || candidate.type !== "org") return false;

    for (const child of candidate.children) {
      if (createsCycle(child.unitId)) return true;
    }

    return false;
  }

  return Object.fromEntries(
    Object.entries(unitMap).filter(
      ([id, unit]) => !existingIds.has(id) && !createsCycle(id)
    )
  );
}

