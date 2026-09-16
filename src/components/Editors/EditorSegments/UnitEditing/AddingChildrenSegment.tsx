import { useAdvanceChildManagingStore } from "../../../../hooks/useAdvanceChildManagingStore";
import { usePaletStore } from "../../../../hooks/usePaletStore";
import { useUnitDropdownStore } from "../../../../hooks/useUnitDropdownStore";
import { SelectionSignature } from "../../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../../hooks/useUnitStore";
import { getSafeChildOptions } from "../../../../logic/Units/getSafeChildOptions";
import { OrgUnit } from "../../../../logic/Units/logic";
import { MouseEvent } from "react";

interface props {
  parent: OrgUnit
  parentId: string
  parentSignature: SelectionSignature
}

export default function AddingChildrenSegment(p: props) {
  const { unitMap, creatNewChild, addNewChild, consolidateOrgUnit} = useUnitStore()
  const { addUnitToPalet } = usePaletStore()
  const { callDropDown } = useUnitDropdownStore()
  const { unitPalet } = usePaletStore()
  const { Open: OpenAdvanceEditor } = useAdvanceChildManagingStore()

  /// Problem: If given all units as a option its possible to choose yourself or other dangerous unit, 
  // and thus creating infinite loop
  /// Solution: We filter them
  const safeChildrenOptions = getSafeChildOptions(p.parentId, unitMap, unitPalet, p.parent.children)

  const handleAddingChild = (
    type: "org" | "raw" | "existing", 
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | undefined
  ) => {
    if (type === "existing") {
      if (!e) {
        console.warn("type == existing, but e is not given!")
        return
      }

      callDropDown(
        (choosenId: string) => addNewChild(p.parentId, choosenId),
        {top: e.clientY + 10, left: e?.clientX},
        safeChildrenOptions
      )
    } else {
      creatNewChild(p.parentId, type, addUnitToPalet); 
    }
  }

  return (<>
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
      <button onClick={() => consolidateOrgUnit(p.parentId)} className="btn-emoji">🤝Combine</button>
      <button onClick={() => OpenAdvanceEditor(p.parentSignature)} className="btn-emoji">📋Advance</button>
    </div>
  </>)
}