import { useGlobalStore } from "../../../hooks/useGlobalStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { CommentsFromParentEditorSegment } from "./CommentsFromParentEditorSegment";
import { LargeTextInput } from "./LargeTextInput";

interface CommentsEditorSegmentProps {
  
}

export function CommentsEditorSegment(p: CommentsEditorSegmentProps) {
  const { setStaffComment, removeStaffComment, getStaffComment } = useGlobalStore(s => s)
  const { setStaffName, removeStaffName, getStaffName } = useGlobalStore(s => s)
  const { unitMap, trueRootId, setInnerTexts } = useUnitStore(s => s)

  const slct = useUnitInteractionStore(s => s.select)
  const unitId = processSelect(slct, unitMap, trueRootId) as string
  const unit = unitMap[unitId]

  const isInTree = Array.isArray(slct)
  
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
  
  const path = slct as number[]
  

  return <div className="editor-segment-flex">
    <div className="editor-segment-row">
      <h2 className="font-bold text-lg">Comments</h2>
    </div>
    <label className="editor-segment-row">
      <span className="font-bold">Name:</span>
      <input
        id="NameInputId"
        type="text"
        value={unit.name}
        onChange={(e) => handleInnerTexts(unitId, e.target.value, undefined)}
        className="editor-element"
      />
    </label>
    <label className="editor-segment-row">
      <span className="font-bold">Desc.:</span>
      <textarea
        id="NameInputId"
        value={unit.desc}
        onChange={(e) => handleInnerTexts(unitId, undefined, e.target.value)}
        className="editor-element"
      />
    </label>
    <CommentsFromParentEditorSegment></CommentsFromParentEditorSegment>
    {isInTree && 
      <label className="editor-segment-row">
        <span className="font-bold">SN:</span>
        <input
          id="StaffNameInputId"
          type="text"
          value={getStaffName(path)}
          onChange={(e) => handleStaffName(path, e.target.value)}
          className="editor-element"
          alt="Name given by staff"
        />
      </label>
    }
    {isInTree && 
      <label className="editor-segment-row">
        <span className="font-bold">SC:</span>
        <input
          id="StaffCommentInputId"
          type="text"
          value={getStaffComment(path)}
          onChange={(e) => handleStaffComment(path, e.target.value)}
          className="editor-element"
          alt="Description given by staff"
        />
      </label>
    }
  </div>
}