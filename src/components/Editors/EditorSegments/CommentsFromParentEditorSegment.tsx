import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { SetTextsInParent, getTextsInParent } from "../../../logic/Designations/designationPack"
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
  const { currentPhase: phase } = usePhaseStore()

  if (!Array.isArray(slct))
    return null

  const path = slct
  
  const parentId = GetChildIdFromPath(trueRootId, path.slice(0, -1), unitMap, phase) as string
  const parent = unitMap[parentId] as OrgUnit

  function ChangeCS(cs: string) {
    const nParent = SetTextsInParent(
      parent, path, trueRootId,
      (prev) => prev !== undefined ? {...prev, callSign: cs} : {callSign: cs, desc: ""},
      unitMap, phase)
    updateUnit(parentId, nParent)
  }
  function ChangeDesc(desc: string) {
    const nParent = SetTextsInParent(
      parent, path, trueRootId,
      (prev) => prev !== undefined ? {...prev, desc: desc} : {callSign: "", desc: desc},
      unitMap, phase)
    updateUnit(parentId, nParent)
  }

  if (path.length === 0) {
    return null
  }

  const textsInParent = getTextsInParent(path, trueRootId, unitMap, phase)

  return <>
    <LabledInput
      label="CS:"
      id="CallSignInputId"
      value={textsInParent?.callSign}
      onChange={(e) => ChangeCS(e.target.value)}
    />
    <LargeTextInput
      label="DfP:"
      id="DescFromParentInputId"
      value={textsInParent?.desc}
      onChange={(e) => ChangeDesc(e.target.value)}
    />
  </>
}