import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { changeTextInParent } from "../../../logic/Designations/designationPack"
import { OrgUnit } from "../../../logic/Units/logic"
import { LabledInput } from "../EditorElements/TextInputs/LabledInput"
import { LargeTextInput } from "../EditorElements/TextInputs/LargeTextInput"
import { usePhaseStore } from "../../../hooks/usePhaseStore"
import { GetChildIdFromPath } from "../../../logic/Units/childGetting"

interface props {

}

export function CommentsFromParentEditorSegment(p: props) {
  const { unitMap, trueRootId, updateUnit } = useUnitStore(s => s)
  const slct = useUnitInteractionStore(s => s.selectSignature)
  const { phase } = usePhaseStore()

  if (!Array.isArray(slct))
    return null
  
  const parentId = GetChildIdFromPath(trueRootId, slct.slice(0, -1), unitMap, phase) as string
  const parent = unitMap[parentId] as OrgUnit

  function handleTextsInParent(cs: string | undefined, desc: string | undefined) {
    const nParent = changeTextInParent(slct as number[], unitMap, phase, trueRootId, cs, desc)
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