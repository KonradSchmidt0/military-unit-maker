import { useGlobalStore } from "../../../hooks/useGlobalStore"
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { GetChildIdFromPath } from "../../../logic/childManaging"
import { changeTextInParent } from "../../../logic/designationPack"
import { OrgUnit } from "../../../logic/logic"
import { LargeTextInput } from "./LargeTextInput"

interface props {

}

export function CommentsFromParentEditorSegment(p: props) {
  const { unitMap, trueRootId, updateUnit } = useUnitStore(s => s)

  const slct = useUnitInteractionStore(s => s.select)

  if (!Array.isArray(slct))
    return null
  
  const parentId = GetChildIdFromPath(trueRootId, slct.slice(0, -1), unitMap)
  const parent = unitMap[parentId] as OrgUnit

  function handleTextsInParent(cs: string | undefined, desc: string | undefined) {
    const nParent = changeTextInParent(slct as number[], unitMap, trueRootId, cs, desc)
    updateUnit(parentId, nParent)
  }

  return <>
    {slct.length > 0 ? <LargeTextInput 
      topText="Name from parent:" 
      value={parent.flatCallSigns[slct[slct.length - 1]] ?? ""} 
      onChange={(e) => handleTextsInParent(e.target.value, undefined)}
    /> : ""}
    {slct.length > 0 ? <LargeTextInput 
      topText="Desc. from parent:" 
      value={parent.flatDescriptions[slct[slct.length - 1]] ?? ""} 
      onChange={(e) => handleTextsInParent(undefined, e.target.value)}
    /> : ""}
  </>
}