/// PROBLEM:
// User can't swap the root unit for other unit, since the ComplexChildNode used in children units for swapping 
// assumes that there is a parent
/// SOLUTION:
// Create a new special node just for it. You can play around with Complex Node to allow it to not take the parent but 
// i judge it as too much time, since everything that Complex is made of is already very modular

import { processSignature } from "../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../hooks/useUnitStore"
import { GetTrueColor } from "../../logic/childManaging"
import { UnitClickableIdSwapRoot } from "./UnitClickable/UnitClickableIdSwapRoot"
import { UnitDisplay } from "./UnitDisplay"
import { UnitHoverable } from "./UnitHoverable"

interface props {
  unitSignature: string | number[]
}

export function RootSwapIdNode(p: props) {

  const { unitMap, trueRootId } = useUnitStore(s => s)

  const unitId = processSignature(p.unitSignature, unitMap, trueRootId)
  if (!unitId) {
    console.warn("Unit with id: " + unitId + " processed from signature: " + p.unitSignature + " is undefined")
    return null
  }

  return <UnitClickableIdSwapRoot>
    <UnitHoverable signature={p.unitSignature} >
      <UnitDisplay unitId={unitId} color={GetTrueColor(p.unitSignature, trueRootId, unitMap)}/>
    </UnitHoverable> 
  </UnitClickableIdSwapRoot>
}