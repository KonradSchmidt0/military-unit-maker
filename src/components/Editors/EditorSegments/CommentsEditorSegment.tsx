import { useStaffTextStore } from "../../../hooks/useStaffTextStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { CommentsFromParentEditorSegment } from "./CommentsFromParentEditorSegment";
import { LabledInput } from "../EditorElements/LabledInput";
import { LargeTextInput } from "../EditorElements/LargeTextInput";

interface CommentsEditorSegmentProps {
  
}

export function CommentsEditorSegment(p: CommentsEditorSegmentProps) {
  const { setStaffComment, removeStaffComment, getStaffComment } = useStaffTextStore(s => s)
  const { setStaffName, removeStaffName, getStaffName } = useStaffTextStore(s => s)
  const { unitMap, trueRootId, setInnerTexts } = useUnitStore(s => s)

  const selectSignature = useUnitInteractionStore(s => s.selectSignature)
  const unitId = processSelect(selectSignature, unitMap, trueRootId) as string
  const unit = unitMap[unitId]
  
  function handleStaffComment(path: number[], comment: string) {
    if (comment === "") {
      removeStaffComment(path)
      return
    }
    setStaffComment(path, comment)
  }

  function handleStaffName(path: number[], name: string) {
    if (name === "") {
      removeStaffName(path)
      return
    }
    setStaffName(path, name)
  }

  function handleInnerTexts(unitId: string, shortName: string | undefined, desc: string | undefined) {
    setInnerTexts(unitId, shortName, desc)
  }
  

  return <div className="editor-segment-flex">
    <div className="editor-segment-row">
      <h2 className="font-bold text-lg">Comments</h2>
    </div>
    <LabledInput
      label="Name:"
      id="LowerNameInputId"
      value={unit.name}
      onChange={(e) => handleInnerTexts(unitId, e.target.value, undefined)}
    />
    <LargeTextInput
      label="Desc.:"
      id={"descInputId"}
      value={unit.desc ?? ""}
      onChange={(e) => handleInnerTexts(unitId, undefined, e.target.value)}
    />
    <CommentsFromParentEditorSegment></CommentsFromParentEditorSegment>
    {Array.isArray(selectSignature) && 
      <>
        <LabledInput
          label="SN:"
          id="StaffNameInputId"
          value={getStaffName(selectSignature)}
          onChange={(e) => handleStaffName(selectSignature, e.target.value)}
        />
        <LargeTextInput
          label="SC:"
          id="StaffCommentInputId"
          value={getStaffComment(selectSignature)}
          onChange={(e) => handleStaffComment(selectSignature, e.target.value)}
        />
      </>
    }
  </div>
}