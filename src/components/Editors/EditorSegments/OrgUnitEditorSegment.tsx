import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePaletStore } from "../../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { UnitMap, useUnitStore } from "../../../hooks/useUnitStore";
import { getEquipmentTable, OrgUnit, removeEquipmentTypeRecursively } from "../../../logic/logic";
import { ChildRow } from "./ChildRow";
import { getSafeChildOptions } from "../../../logic/getSafeChildOptions";

export default function OrgUnitEditorSegment() {
  const selectedUnitId = useUnitInteractionStore(s => s.selectedId) as string
  const setSelected = useUnitInteractionStore(s => s.setSelectedId)
  const setParent = useUnitInteractionStore(s => s.setSelected_parentId)
  // Used later
  const unitMap = useUnitStore(s => s.unitMap)
  const updateUnitMap = useUnitStore(s => s.setUnitMap)
  const createChild = useUnitStore(s => s.creatNewChild)
  const setChildCount = useUnitStore(s => s.changeChildCount)
  const setChildId = useUnitStore(s => s.changeChildId)
  const removeChildFully = useUnitStore(s => s.removeChildType)
  const moveChild = useUnitStore(s => s.moveChildPos)
  const addChild = useUnitStore(s => s.addNewChild)
  
  const unit = unitMap[selectedUnitId] as OrgUnit

  const addToPalet = usePaletStore(s => s.addUnitToPalet)

  const [ctrl, alt] = [useShortcutStore(s => s.isCtrlHeld), useShortcutStore(s => s.isAltHeld), useShortcutStore(s => s.isShiftHeld)]
  
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

  const handleAddingChild = (type: "org" | "raw" | "existing") => {
    let c;
    if (type === "existing") {
      console.log(Object.entries(safeChildrenOptions))
      c = Object.entries(safeChildrenOptions)[0][0]
      addChild(selectedUnitId, c)
    } else {
      c = createChild(selectedUnitId, type); 
    }
    if (ctrl) { 
      setParent(selectedUnitId); 
      setSelected(c);
    }
    if (alt) {
      addToPalet(c)
    }
  }

  const childrenHeader = (
    <div className="editor-segment-row">
      <span className="text-lg font-bold">Children</span>
      <button onClick={() => handleAddingChild("org")} className="btn-emoji">
        ➕Org
      </button>
      <button onClick={() => handleAddingChild("raw")} className="btn-emoji">
        ➕Raw
      </button>
      {Object.entries(safeChildrenOptions).length > 0 ? 
        <button onClick={() => handleAddingChild("existing")} className="btn-emoji">
          ➕
        </button> : null
      }
    </div>
  )
  const childEdittingList = Object.entries(unit.children).map(([childId, count], index) =>  {
    /// Since the safe function retuns only the not used items, its necesary to add self to it, 
    // or else it breaks UI and potentialy logic
    const childUnit = unitMap[childId];
    const safeUnitsPlusMyself: UnitMap = { ...safeChildrenOptions, [childId]: childUnit, };
    return (
      <ChildRow key={childId + "childEdittingList"}
        childId={childId} count={count} childrenChoices={safeUnitsPlusMyself}
        onChildChange={(n) => setChildId(selectedUnitId, childId, n)}
        onCountChange={(n) => {
          setChildCount(selectedUnitId, childId, n)
          if (ctrl) {
            setParent(selectedUnitId)
            setSelected(childId)
          }
        }}
        onRemoveButtonPressed={() => removeChildFully(selectedUnitId, childId)}
        upDownButton={true}
        onUpPressed={() => moveChild(selectedUnitId, childId, "top")}
        onDownPressed={() => moveChild(selectedUnitId, childId, "bottom")}
      />
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
      {childEdittingList}
      {eqList}
    </div>
  )
  
}
