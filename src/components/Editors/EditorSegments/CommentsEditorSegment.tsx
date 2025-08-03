import { useGlobalStore } from "../../../hooks/useGlobalStore";
import { LargeTextInput } from "./LargeTextInput";

interface CommentsEditorSegmentProps {
  slct: string | number[]
}

export function CommentsEditorSegment(p: CommentsEditorSegmentProps) {
  const { setStaffComment, getStaffComment } = useGlobalStore(s => s)

  if (!Array.isArray(p.slct))
    return null

  const path = p.slct as number[]

  return <>
    <LargeTextInput topText="Staff Comment:" value={getStaffComment(path)} onChange={(e) => setStaffComment(path, e.target.value)}/>
  </>
}