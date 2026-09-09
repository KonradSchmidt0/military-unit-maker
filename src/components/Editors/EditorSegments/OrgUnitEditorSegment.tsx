import { usePaletStore } from "../../../hooks/usePaletStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { ChildRow } from "./ChildRow";
import { getSafeChildOptions } from "../../../logic/Units/getSafeChildOptions";
import { FlatChildrenEditor } from "./FlatChildrenEditor";
import { useUnitDropdownStore } from "../../../hooks/useUnitDropdownStore";
import { MouseEvent } from "react";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { usePhaseStore } from "../../../hooks/usePhaseStore";
import { getComplexChildList } from "../../../logic/Units/childGetting";

export default function OrgUnitEditorSegment() {
  const { unitMap, trueRootId, creatNewChild, addNewChild, consolidateOrgUnit} = useUnitStore()
  const { addUnitToPalet } = usePaletStore()
  const { phase } = usePhaseStore()
  const { callDropDown } = useUnitDropdownStore()
  const { unitPalet } = usePaletStore()
  const select = useUnitInteractionStore(s => s.selectSignature)

  if (!select) return null
  
  const selectedId = processSelect(select, unitMap, trueRootId, phase)
  if (!selectedId) return null

  const unit = unitMap[selectedId]
  if (!unit || unit.type !== "org") return null

  // Problem: If given all units as a option its possible to choose yourself or other dangerous unit, and thus creating infinite loop
  // Solution: We filter them
  const safeChildrenOptions = getSafeChildOptions(selectedId, unitMap, unitPalet, unit.children)

  const handleAddingChild = (type: "org" | "raw" | "existing", e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | undefined) => {
    if (type === "existing") {
      if (!e) {
        console.warn("type == existing, but e is not given!")
        return
      }

      callDropDown(
        (choosenId: string) => addNewChild(selectedId, choosenId),
        {top: e.clientY + 10, left: e?.clientX},
        safeChildrenOptions
      )
    } else {
      creatNewChild(selectedId, type, addUnitToPalet); 
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
      <button onClick={(e) => handleAddingChild("existing", e)} className="btn-emoji">
        ➕
      </button>
    </div>
    <div className="editor-segment-row">
      <button onClick={() => consolidateOrgUnit(selectedId)} className="btn-emoji">🤝Combine</button>
    </div>
  </>)

  // TODO: Make draggable 
  const unmodedChildrenEntry = unit.children
  const moddedChildrenEntry = getComplexChildList(unit, false, phase)

  const childEdittingList = unmodedChildrenEntry.map((entry, _) =>  {
    const myFlatIndex = moddedChildrenEntry.find((e) => e.childId === entry.id)?.flatIndex
    const childSignature = Array.isArray(select) && myFlatIndex !== undefined ? [...select, myFlatIndex] : entry.id
    
    return <ChildRow key={entry.id + "childEdittingList"}
        parentSignature={select}
        childSignature={childSignature}
        whoSelectOnSelectClick={childSignature}
      />; 
  } );

  return (
    <div className="editor-segment-flex">
      {childrenHeader}
      <div className="!gap-3 flex flex-col">
        {childEdittingList}
      </div>
      <FlatChildrenEditor/>
    </div>
  )
  
}
