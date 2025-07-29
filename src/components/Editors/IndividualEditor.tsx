import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { HowManyOfThisTypeInParent } from "../../logic/logic";
import CommonUnitEditorSegment from "./EditorSegments/CommonUnitEditorSegment";
import OrgUnitEditorSegment from "./EditorSegments/OrgUnitEditorSegment";
import RawUnitEditorSegment from "./EditorSegments/RawUnitEditorSegment";

export default function IndividualEditor() {
  const selectedId = useUnitInteractionStore((s) => s.selectedId)
  const resetSelected = useUnitInteractionStore(s => s.resetSelected)

  const rootUnitId = useUnitStore(s => s.trueRootId)

  const unitMap = useUnitStore((state) => state.unitMap)

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
        INDIVIDUAL {currentlySelectedDisplay}
        <button className="btn-emoji !p-0 !ml-2" onClick={resetSelected}>❌</button>
      </div>
      
      <div className="overflow-y-auto max-h-fit">
        {commonPart}
        {rawUnitPart}
        {orgUnitSegment}
      </div>
    </div>
  );
}
