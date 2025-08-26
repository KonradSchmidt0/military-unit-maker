import { processSelect, useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { HowManyOfThisTypeInParent } from "../../logic/logic";
import { CommentsEditorSegment } from "./EditorSegments/CommentsEditorSegment";
import CommonUnitEditorSegment from "./EditorSegments/CommonUnitEditorSegment";
import { EQListAndRemover } from "./EditorSegments/EQListAndRemover";
import OrgUnitEditorSegment from "./EditorSegments/OrgUnitEditorSegment";
import RawUnitEditorSegment from "./EditorSegments/RawUnitEditorSegment";
import { SelectParent } from "./EditorSegments/SelectParent";

export default function IndividualEditor() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const selected = useUnitInteractionStore(s => s.select)
  const selectedId = processSelect(selected, unitMap, trueRootId)
  const resetSelected = useUnitInteractionStore(s => s.resetSelected)

  if (!selectedId)
    return null

  const selectedUnit = unitMap[selectedId]
  if (!selectedUnit)
    return null

  const currentlySelectedCount = trueRootId !== selectedId 
    ? HowManyOfThisTypeInParent(trueRootId, selectedId, unitMap)
    : 1
  const currentlySelectedDisplay = ( <>
      (cur. selected:{" "}
      <span className={currentlySelectedCount > 2 ? "text-warning" : ""}>
        {currentlySelectedCount}
      </span>
      )
    </> );

  return (
    <div className="editor-box">
      <div className="editor-segment font-bold">
        INDIV {currentlySelectedDisplay}
        {Array.isArray(selected) && selected.length > 0 && <SelectParent myPath={selected}/>}
        <button className="btn-emoji !p-0 !ml-2" onClick={resetSelected}>❌</button>
      </div>
      
      <div className="overflow-y-auto max-h-fit">
        <CommonUnitEditorSegment/>
        {selectedUnit.type === "raw" && <RawUnitEditorSegment/>}
        {selectedUnit.type === "org" && <OrgUnitEditorSegment/>}
        <CommentsEditorSegment/>
        {selectedUnit.type === "org" && <EQListAndRemover/>}
      </div>
    </div>
  );
}
