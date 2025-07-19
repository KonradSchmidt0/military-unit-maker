import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitQuick, useUnitStore } from "../../hooks/useUnitStore";
import { HowManyOfThisTypeInParent, Unit } from "../../logic/logic";
import CommonUnitEditorSegment from "./EditorSegments/CommonUnitEditorSegment";
import OrgUnitEditorSegment from "./EditorSegments/OrgUnitEditorSegment";
import RawUnitEditorSegment from "./EditorSegments/RawUnitEditorSegment";

export default function IndividualEditor() {
  const selectedUnitId = useUnitInteractionStore((s) => s.selectedId)
  const rootUnitId = useUnitStore(s => s.rootId)

  const selectedUnit = useUnitQuick(selectedUnitId ? selectedUnitId : "") as Unit;
  const unitMap = useUnitStore((state) => state.unitMap)

  if (!selectedUnitId)
    return null

  const commonPart = <CommonUnitEditorSegment/>;

  const rawUnitPart = selectedUnit?.type === "raw" ?
    <RawUnitEditorSegment/> : null;

  const orgUnitSegment = selectedUnit?.type === "org" ?
    <OrgUnitEditorSegment/> : null;

  const currentlySelectedCount = rootUnitId !== selectedUnitId 
    ? HowManyOfThisTypeInParent(rootUnitId, selectedUnitId, unitMap)
    : 1
  const currentlySelectedDisplay = ( <>
      (cur. selected:{" "}
      <span className={currentlySelectedCount > 2 ? "text-warning" : ""}>
        {currentlySelectedCount}
      </span>
      )
    </> );

  
  return (
    <div className="!border-r-0 editor-box">
      <div className="editor-segment font-bold">
        INDIVIDUAL {currentlySelectedDisplay}
      </div>
      
      {commonPart}
      {rawUnitPart}
      {orgUnitSegment}

    </div>
  );
}
