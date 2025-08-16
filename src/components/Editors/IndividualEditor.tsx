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

  const rootUnitId = useUnitStore(s => s.trueRootId)

  if (!selectedId)
    return null

  const selectedUnit = unitMap[selectedId]
  if (!selectedUnit)
    return null

  const commonPart = <CommonUnitEditorSegment/>;

  const rawUnitPart = selectedUnit?.type === "raw" ?
    <RawUnitEditorSegment/> : null;

  const orgUnitSegment = selectedUnit?.type === "org" ?
    <OrgUnitEditorSegment/> : null;

  const currentlySelectedCount = rootUnitId !== selectedId 
    ? HowManyOfThisTypeInParent(rootUnitId, selectedId, unitMap)
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
        {commonPart}
        {rawUnitPart}
        {orgUnitSegment}
        <CommentsEditorSegment/>
        {selectedUnit.type === "org" && <EQListAndRemover/>}
      </div>
    </div>
  );
}
