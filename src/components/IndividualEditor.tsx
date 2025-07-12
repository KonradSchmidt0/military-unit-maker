import CommonUnitEditorSegment from "./EditorSegments/CommonUnitEditorSegment";

interface IndividualEditorProps {
  selectedUnitId?: string;
}

export default function IndividualEditor({ selectedUnitId }: IndividualEditorProps) {
  // TODO: Divide this editor into some neet way
  // Current implementation is messy since editor should be visible all the time, 
  // and only it's subcomponents should apear depending on selection

  const namePart = selectedUnitId ? <CommonUnitEditorSegment selectedUnitId = {selectedUnitId}></CommonUnitEditorSegment> : null;
  
  return (
    <div className="border-slate-400 border-2 w-64">
      <div className="border-slate-400 border-b-2 border-dashed p-2 text-center">
        INDIVIDUAL
      </div>
      
      {namePart}

    </div>
  );
}
