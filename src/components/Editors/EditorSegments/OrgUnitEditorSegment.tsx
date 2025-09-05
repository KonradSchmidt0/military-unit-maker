import { usePaletStore } from "../../../hooks/usePaletStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { OrgUnit } from "../../../logic/logic";
import { ChildRow } from "./ChildRow";
import { getSafeChildOptions } from "../../../logic/getSafeChildOptions";
import { getComplexChildList } from "../../../logic/childManaging";
import { FlatChildrenEditor } from "./FlatChildrenEditor";
import { useUnitDropdownStore } from "../../../hooks/useUnitDropdownStore";
import { MouseEvent } from "react";

export default function OrgUnitEditorSegment() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const select = useUnitInteractionStore(s => s.select) as string | number[]
  const selectedId = processSelect(select, unitMap, trueRootId) as string
  
  const createChild = useUnitStore(s => s.creatNewChild)
  const addChild = useUnitStore(s => s.addNewChild)
  const consolidateUnit = useUnitStore(s => s.consolidateOrgUnit)
  
  const unit = unitMap[selectedId] as OrgUnit

  const { callDropDown } = useUnitDropdownStore(s => s)

  // Problem: If given all units as a option its possible to choose yourself or other dangerous unit, and thus creating infinite loop
  // Solution: We filter them
  const safeChildrenOptions = getSafeChildOptions(selectedId, unitMap, usePaletStore(state => state.unitPalet), unit.children)

  const handleAddingChild = (type: "org" | "raw" | "existing", e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | undefined) => {
    if (type === "existing") {
      if (!e) {
        console.warn("type == existing, but e is not given!")
        return
      }

      callDropDown(
        (choosenId: string) => addChild(selectedId, choosenId),
        {top: e.clientY + 10, left: e?.clientX},
        safeChildrenOptions
      )
    } else {
      createChild(selectedId, type); 
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
      <button onClick={() => consolidateUnit(selectedId)} className="btn-emoji">🤝Consolidate</button>
    </div>
  </>)

  const childEdittingList = getComplexChildList(unit, false).map((entry, i) =>  {
    const childSignature = Array.isArray(select) ? [...select, entry.flatIndex] : entry.childId
    return <ChildRow key={i + "childEdittingList"}
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
