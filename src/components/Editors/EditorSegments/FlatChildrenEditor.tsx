import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { GetFlatIds } from "../../../logic/childManaging";
import { OrgUnit } from "../../../logic/logic";
import { ChildTextElement } from "./ChildTextElement";

interface props {

}

export function FlatChildrenEditor(p: props) {
  const { trueRootId, unitMap } = useUnitStore(s => s)
  const select = useUnitInteractionStore(s => s.select)
  const parentId = processSelect(select, unitMap, trueRootId)

  if (!parentId || !select)
    return null

  const parent = unitMap[parentId] as OrgUnit

  const flatChildren = GetFlatIds(parent.children)

  const childEdittingList = flatChildren.map((childId, index) =>  {
    return <ChildTextElement key={childId + "" + index} parentSignature={select} childFlatIndex={index}/>; 
  } );

  return (<div>{childEdittingList}</div>)
}