import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { GetChildIdFromPath } from "../../../logic/childManaging"
import { changeTextInParent } from "../../../logic/designationPack"
import { OrgUnit } from "../../../logic/logic"
import { LabledInput } from "../EditorElements/LabledInput"
import { LargeTextInput } from "../EditorElements/LargeTextInput"

interface props {

}

export function CommentsFromParentEditorSegment(p: props) {
  const { unitMap, trueRootId, updateUnit } = useUnitStore(s => s)

  const slct = useUnitInteractionStore(s => s.selectSignature)

  if (!Array.isArray(slct))
    return null
  
  const parentId = GetChildIdFromPath(trueRootId, slct.slice(0, -1), unitMap) as string
  const parent = unitMap[parentId] as OrgUnit

  function handleTextsInParent(cs: string | undefined, desc: string | undefined) {
    const nParent = changeTextInParent(slct as number[], unitMap, trueRootId, cs, desc)
    updateUnit(parentId, nParent)
  }

  if (slct.length === 0) {
    return null
  }

  return <>
    <LabledInput
      label="CS:"
      id="CallSignInputId"
      value={parent.flatCallSigns[slct[slct.length - 1]] ?? ""}
      onChange={(e) => handleTextsInParent(e.target.value, undefined)}
    />
    <LargeTextInput
      label="DfP:"
      id="DescFromParentInputId"
      value={parent.flatDescriptions[slct[slct.length - 1]] ?? ""}
      onChange={(e) => handleTextsInParent(undefined, e.target.value)}
    />
  </>
}