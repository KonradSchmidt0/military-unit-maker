import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { GetChildIdFromPath, GetTrueColorRecursively } from "../../../logic/childManaging"
import { OrgUnit } from "../../../logic/logic"
import { UnitClickable } from "../../UnitClickable"
import { UnitDisplay } from "../../UnitDisplaying/UnitDisplay"

interface props {
  parentSignature: number[] | string
  childFlatIndex: number
}

export function ChildTextElement(p: props) {
  const {unitMap, updateUnit, trueRootId} = useUnitStore(s=>s)
  const parentId = Array.isArray(p.parentSignature) ? GetChildIdFromPath(trueRootId, p.parentSignature, unitMap) : p.parentSignature
  const childId = GetChildIdFromPath(parentId, [p.childFlatIndex], unitMap)
  const parent = unitMap[parentId] as OrgUnit
  const callSign = parent.flatCallSigns[p.childFlatIndex]
  const desc = parent.flatDescriptions[p.childFlatIndex]
  const mySignature = Array.isArray(p.parentSignature) ? [...p.parentSignature, p.childFlatIndex] : childId

  function handleCallSign(n: string) {
    updateUnit(parentId, {...parent, flatCallSigns: {...parent.flatCallSigns, [p.childFlatIndex]: n}})
  }
  
  function handleDesc(n: string) {
    updateUnit(parentId, {...parent, flatDescriptions: {...parent.flatDescriptions, [p.childFlatIndex]: n}})
  }

  const color = 
    Array.isArray(p.parentSignature) ? GetTrueColorRecursively(trueRootId, p.parentSignature, unitMap) 
    :
    GetTrueColorRecursively(parentId, [p.childFlatIndex], unitMap)

  return <div className="flex flex-row gap-2 justify-center">
    <UnitClickable signature={mySignature}>
      <UnitDisplay className="!mt-3.5" unitId={childId} color={color} showText={false}/>
    </UnitClickable>
    <div className="flex flex-col gap-1">
      <input className="editor-element w-40" type="text" value={callSign} onChange={(e) => handleCallSign(e.target.value)}/>
      <input className="editor-element w-40" type="text" value={desc} onChange={(e) => handleDesc(e.target.value)}/>
    </div>
  </div>
}