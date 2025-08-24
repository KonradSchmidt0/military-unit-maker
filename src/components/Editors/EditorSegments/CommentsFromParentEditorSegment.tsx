import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { GetChildIdFromPath } from "../../../logic/childManaging"
import { changeTextInParent } from "../../../logic/designationPack"
import { OrgUnit } from "../../../logic/logic"

interface props {

}

export function CommentsFromParentEditorSegment(p: props) {
  const { unitMap, trueRootId, updateUnit } = useUnitStore(s => s)

  const slct = useUnitInteractionStore(s => s.select)

  if (!Array.isArray(slct))
    return null
  
  const parentId = GetChildIdFromPath(trueRootId, slct.slice(0, -1), unitMap) as string
  const parent = unitMap[parentId] as OrgUnit

  function handleTextsInParent(cs: string | undefined, desc: string | undefined) {
    const nParent = changeTextInParent(slct as number[], unitMap, trueRootId, cs, desc)
    updateUnit(parentId, nParent)
  }

  return <>
    {slct.length > 0 && <label className="editor-segment-row">
      <span className="font-bold">CS:</span>
      <input
        id="CallSignInputId"
        type="text"
        value={parent.flatCallSigns[slct[slct.length - 1]] ?? ""}
        onChange={(e) => handleTextsInParent(e.target.value, undefined)}
        className="editor-element"
        alt="Name given by parent (callsign)"
      />
    </label>}
    {slct.length > 0 && <label className="editor-segment-row">
      <span className="font-bold">DfP:</span>
      <input
        id="DescFromParentInputId"
        type="text"
        value={parent.flatDescriptions[slct[slct.length - 1]] ?? ""}
        onChange={(e) => handleTextsInParent(undefined, e.target.value)}
        className="editor-element"
        alt="Description given by parent"
      />
    </label>}
  </>
}