import { useUnitQuick } from "../hooks/useUnitStore";
import CommonUnitEditorSegment from "./EditorSegments/CommonUnitEditorSegment";
import OrgUnitEditorSegment from "./EditorSegments/OrgUnitEditorSegment";
import RawUnitEditorSegment from "./EditorSegments/RawUnitEditorSegment";

interface IndividualEditorProps {
  selectedUnitId?: string;
  setSelected_NotTouchingParent: Function;
  selectedUnitParentId?: string
}

export default function IndividualEditor({ selectedUnitId, setSelected_NotTouchingParent, selectedUnitParentId }: IndividualEditorProps) {
  let selectedUnit = useUnitQuick(selectedUnitId ? selectedUnitId : "");

  if (!selectedUnitId)
    return null

  const namePart = <CommonUnitEditorSegment 
      selectedUnitId = {selectedUnitId} setSelected_NotTouchingParent={setSelected_NotTouchingParent} selectedUnitParentId={selectedUnitParentId}
    ></CommonUnitEditorSegment>;

  const rawUnitPart = selectedUnit?.type === "raw" ?
    <RawUnitEditorSegment selectedUnitId={selectedUnitId}></RawUnitEditorSegment> : null;

  const orgUnitSegment = selectedUnit?.type === "org" ?
    <OrgUnitEditorSegment selectedUnitId={selectedUnitId}></OrgUnitEditorSegment> : null;
  
  return (
    <div className="!border-r-0 editor-box">
      <div className="border-slate-400 border-b-2 border-dashed p-2 text-center font-bold">
        INDIVIDUAL
      </div>
      
      {namePart}
      {rawUnitPart}
      {orgUnitSegment}

    </div>
  );
}
