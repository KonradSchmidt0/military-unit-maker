import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { HowManyOfThisTypeInParent } from "../../logic/logic";
import CommonUnitEditorSegment from "./EditorSegments/CommonUnitEditorSegment";
import OrgUnitEditorSegment from "./EditorSegments/OrgUnitEditorSegment";
import RawUnitEditorSegment from "./EditorSegments/RawUnitEditorSegment";

export default function IndividualEditor() {
  const selectedUnitId = useUnitInteractionStore((s) => s.selectedId)
  const setSelected = useUnitInteractionStore(s => s.setSelectedId)
  const setParent = useUnitInteractionStore(s => s.setSelected_parentId)

  const rootUnitId = useUnitStore(s => s.trueRootId)

  const unitMap = useUnitStore((state) => state.unitMap)

  if (!selectedUnitId)
    return null

  const selectedUnit = unitMap[selectedUnitId]
  if (!selectedUnit)
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
        <button className="btn-emoji !p-0 !ml-2" onClick={() => {setSelected(undefined); setParent(undefined);}}>❌</button>
      </div>
      
      {commonPart}
      {rawUnitPart}
      {orgUnitSegment}

    </div>
  );
}
