import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePaletStore } from "../../../hooks/usePaletStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { UnitMap, useUnitStore } from "../../../hooks/useUnitStore";
import { OrgUnit } from "../../../logic/logic";
import { ChildRow } from "./ChildRow";
import { getSafeChildOptions } from "../../../logic/getSafeChildOptions";
import { GetFlatIndexFromId } from "../../../logic/childManaging";

export default function OrgUnitEditorSegment() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const selectedId = processSelect(useUnitInteractionStore(s => s.select), unitMap, trueRootId) as string
  
  const selectChild = useUnitInteractionStore(s => s.selectChild)

  const createChild = useUnitStore(s => s.creatNewChild)
  const setChildCount = useUnitStore(s => s.changeChildCount)
  const setChildId = useUnitStore(s => s.changeChildId)
  const removeChildFully = useUnitStore(s => s.removeChildType)
  const moveChild = useUnitStore(s => s.moveChildPos)
  const addChild = useUnitStore(s => s.addNewChild)
  const consolidateUnit = useUnitStore(s => s.consolidateOrgUnit)
  
  const unit = unitMap[selectedId] as OrgUnit

  const addToPalet = usePaletStore(s => s.addUnitToPalet)

  const [ctrl, alt] = [useShortcutStore(s => s.isCtrlHeld), useShortcutStore(s => s.isAltHeld), useShortcutStore(s => s.isShiftHeld)]

  /// Children Manager
  // If given all units as a option its possible to choose yourself or other dangerous unit, and creating infinite loop
  // As such, we filter them
  const safeChildrenOptions = getSafeChildOptions(selectedId, unitMap, usePaletStore(state => state.unitPalet), unit.children)

  const handleAddingChild = (type: "org" | "raw" | "existing") => {
    let c;
    if (type === "existing") {
      c = Object.entries(safeChildrenOptions)[0][0]
      addChild(selectedId, c)
    } else {
      c = createChild(selectedId, type); 
    }
    if (ctrl) { 
      selectChild(GetFlatIndexFromId(unit.children, c))
    }
    if (alt) {
      addToPalet(c)
    }
  }

  const childrenHeader = (<>
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
    <div className="editor-segment-row">
      <button onClick={() => consolidateUnit(selectedId)} className="btn-emoji">🟰Consolidate</button>
    </div>
  </>)
  const childEdittingList = Object.entries(unit.children).map(([childId, count], index) =>  {
    /// Since the safe function retuns only the not used items, its necesary to add self to it, 
    // or else it breaks UI and potentialy logic
    const childUnit = unitMap[childId];
    const safeUnitsPlusMyself: UnitMap = { ...safeChildrenOptions, [childId]: childUnit, };
    return (
      <ChildRow key={childId + "childEdittingList"}
        childId={childId} count={count} childrenChoices={safeUnitsPlusMyself}
        onChildChange={(n) => setChildId(selectedId, childId, n)}
        onCountChange={(n) => {
          setChildCount(selectedId, childId, n)
          if (ctrl) {
            selectChild(GetFlatIndexFromId(unit.children, childId))
          }
        }}
        onRemoveButtonPressed={() => removeChildFully(selectedId, childId)}
        upDownButton={true}
        onUpPressed={() => moveChild(selectedId, childId, "top")}
        onDownPressed={() => moveChild(selectedId, childId, "bottom")}
      />
    ); 
  } );
  return (
    <div className="editor-segment-flex">
      {childrenHeader}
      {childEdittingList}
    </div>
  )
  
}
