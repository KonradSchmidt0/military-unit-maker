import { useGlobalStore } from "../../../hooks/useGlobalStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { CommentsFromParentEditorSegment } from "./CommentsFromParentEditorSegment";
import { FlatChildrenEditor } from "./FlatChildrenEditor";
import { LargeTextInput } from "./LargeTextInput";

interface CommentsEditorSegmentProps {
  
}

export function CommentsEditorSegment(p: CommentsEditorSegmentProps) {
  const { setStaffComment, removeStaffComment, getStaffComment } = useGlobalStore(s => s)
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

  function handleInnerTexts(unitId: string, shortName: string | undefined, desc: string | undefined) {
    setInnerTexts(unitId, shortName, desc)
  }
  
  const path = slct as number[]
  

  return <div className="editor-segment">
    <LargeTextInput 
      topText="Unit Type Name:" 
      value={unit.shortName ?? ""} 
      onChange={(e) => handleInnerTexts(unitId, e.target.value, undefined)}
    />
    <LargeTextInput 
      topText="Unit Type Description:" 
      value={unit.desc ?? ""} 
      onChange={(e) => handleInnerTexts(unitId, undefined, e.target.value)}
    />
    <CommentsFromParentEditorSegment></CommentsFromParentEditorSegment>
    {unit.type === "org" ? <FlatChildrenEditor/> : null}
    {isInTree ? <LargeTextInput 
      topText="Staff Comment:" 
      value={getStaffComment(path)} 
      onChange={(e) => handleStaffComment(path, e.target.value)}
    /> : null}
  </div>
}