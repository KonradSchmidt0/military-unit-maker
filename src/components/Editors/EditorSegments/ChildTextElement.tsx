import { useStaffTextStore } from "../../../hooks/useStaffTextStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { GetChildIdFromPath } from "../../../logic/childManaging"
import { getDesignationPack } from "../../../logic/designationPack"
import { OrgUnit } from "../../../logic/logic"
import TreeNode from "../../UnitDisplaying/TreeNode"

interface props {
  parentSignature: number[] | string
  childFlatIndex: number
}

export function ChildTextElement(p: props) {
  const {unitMap, updateUnit, trueRootId} = useUnitStore(s=>s)
  const parentId = (Array.isArray(p.parentSignature) ? GetChildIdFromPath(trueRootId, p.parentSignature, unitMap) : p.parentSignature) as string
  const childId = GetChildIdFromPath(parentId, [p.childFlatIndex], unitMap) as string
  const parent = unitMap[parentId] as OrgUnit
  const callSign = parent.flatCallSigns[p.childFlatIndex]
  const desc = parent.flatDescriptions[p.childFlatIndex]
  const mySignature = Array.isArray(p.parentSignature) ? [...p.parentSignature, p.childFlatIndex] : childId
  const { staffNames, staffComments } = useStaffTextStore(s => s)

  function handleCallSign(n: string) {
    updateUnit(parentId, {...parent, flatCallSigns: {...parent.flatCallSigns, [p.childFlatIndex]: n}})
  }
  
  function handleDesc(n: string) {
    updateUnit(parentId, {...parent, flatDescriptions: {...parent.flatDescriptions, [p.childFlatIndex]: n}})
  }

  const dp = Array.isArray(mySignature) ? getDesignationPack(mySignature, unitMap, trueRootId, staffNames, staffComments) : {}

  return <div className="flex flex-row gap-2 h-[4.75rem]">
    <div className="flex flex-col items-center justify-center h-full">
      <TreeNode signature={mySignature} showRightText={false} overrideDisplayTextSetting={true} dp={dp}/>
    </div>
    <div className="flex flex-col gap-1">
      <input id={mySignature + "cs editor"} className="editor-element w-36" type="text" value={callSign} onChange={(e) => handleCallSign(e.target.value)}/>
      <input id={mySignature + "parent desc editor"} className="editor-element w-36" type="text" value={desc} onChange={(e) => handleDesc(e.target.value)}/>
    </div>
  </div>
}