import { useStaffTextStore } from "../../../hooks/useStaffTextStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { SetTextsInParent, getDesignationPack, getTextsInParent } from "../../../logic/Designations/designationPack"
import { OrgUnit } from "../../../logic/Units/logic"
import TreeNode from "../../UnitDisplaying/TreeNode"
import { usePhaseStore } from "../../../hooks/usePhaseStore"
import { GetChildIdFromPath } from "../../../logic/Units/childGetting"

interface props {
  parentSignature: number[] | string
  childFlatIndex: number
}

export function ChildTextElement(p: props) {
  const {unitMap, updateUnit, trueRootId} = useUnitStore(s=>s)
  const { staffNames, staffComments } = useStaffTextStore(s => s)
  const { currentPhase: phase } = usePhaseStore()
  
  const parentId = (Array.isArray(p.parentSignature) ? GetChildIdFromPath(trueRootId, p.parentSignature, unitMap, phase) : p.parentSignature) as string
  const childId = GetChildIdFromPath(parentId, [p.childFlatIndex], unitMap, phase) as string

  const mySignature = Array.isArray(p.parentSignature) ? [...p.parentSignature, p.childFlatIndex] : childId
  const parent = unitMap[parentId] as OrgUnit

  const textsInParent = getTextsInParent([p.childFlatIndex], parentId, unitMap, phase)
  
  function ChangeCS(cs: string) {
    const nParent = SetTextsInParent(
      parent, [p.childFlatIndex], parentId,
      (prev) => prev !== undefined ? {...prev, callSign: cs} : {callSign: cs, desc: ""},
      unitMap, phase)
    updateUnit(parentId, nParent)
  }
  function ChangeDesc(desc: string) {
    const nParent = SetTextsInParent(
      parent, [p.childFlatIndex], parentId,
      (prev) => prev !== undefined ? {...prev, desc: desc} : {callSign: "", desc: desc},
      unitMap, phase)
    updateUnit(parentId, nParent)
  }

  const dp = Array.isArray(mySignature) ? getDesignationPack(mySignature, trueRootId, unitMap, staffNames, staffComments, phase) : {}

  return <div className="flex flex-row gap-2 h-[4.75rem]">
    <div className="flex flex-col items-center justify-center h-full">
      <TreeNode signature={mySignature} showRightText={false} overrideDisplayTextSetting={true} dp={dp}/>
    </div>
    <div className="flex flex-col gap-1">
      <input 
        key={mySignature + "cs editor"} 
        className="editor-element w-36" 
        type="text" 
        value={textsInParent?.callSign ?? ""} 
        onChange={(e) => ChangeCS(e.target.value)}
      />
      <input 
        key={mySignature + "parent desc editor"} 
        className="editor-element w-36" 
        type="text" 
        value={textsInParent?.desc ?? ""} 
        onChange={(e) => ChangeDesc(e.target.value)}
      />
    </div>
  </div>
}