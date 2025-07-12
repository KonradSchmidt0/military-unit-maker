import CommonUnitEditorSegment from "./EditorSegments/CommonUnitEditorSegment";

interface IndividualEditorProps {
  selectedUnitId?: string;
  setSelected_NotTouchingParent: Function;
  selectedUnitParentId?: string
}

export default function IndividualEditor({ selectedUnitId, setSelected_NotTouchingParent, selectedUnitParentId }: IndividualEditorProps) {
  const namePart = selectedUnitId ? 
    <CommonUnitEditorSegment 
      selectedUnitId = {selectedUnitId} setSelected_NotTouchingParent={setSelected_NotTouchingParent} selectedUnitParentId={selectedUnitParentId}
    ></CommonUnitEditorSegment> : null;
  
  return (
    <div className="border-slate-400 border-2 w-64">
      <div className="border-slate-400 border-b-2 border-dashed p-2 text-center">
        INDIVIDUAL
      </div>
      
      {namePart}

    </div>
  );
}
