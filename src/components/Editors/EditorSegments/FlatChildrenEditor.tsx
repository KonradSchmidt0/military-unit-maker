import { usePhaseStore } from "../../../hooks/usePhaseStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { getComplexChildList } from "../../../logic/Units/childGetting";
import { OrgUnit } from "../../../logic/Units/logic";
import { ChildTextElement } from "./ChildTextElement";

export function FlatChildrenEditor() {
  const { trueRootId, unitMap } = useUnitStore(s => s)
  const select = useUnitInteractionStore(s => s.selectSignature)
  const { phase } = usePhaseStore()

  const parentId = processSelect(select, unitMap, trueRootId, phase)

  if (!parentId || !select)
    return null

  const parent = unitMap[parentId] as OrgUnit

  const flatChildren = getComplexChildList(parent, true, phase)

  const childEdittingList = flatChildren.map((childId, index) =>  {
    return <ChildTextElement key={childId + "" + index} parentSignature={select} childFlatIndex={index}/>; 
  } );

  return (<div className="flex flex-col gap-1.5">{childEdittingList}</div>)
}