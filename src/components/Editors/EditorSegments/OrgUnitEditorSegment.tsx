import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { ChildRow } from "./ChildRow";
import { FlatChildrenEditor } from "./FlatChildrenEditor";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { usePhaseStore } from "../../../hooks/usePhaseStore";
import { getComplexChildList } from "../../../logic/Units/childGetting";
import AddingChildrenSegment from "./UnitEditing/AddingChildrenSegment";

export default function OrgUnitEditorSegment() {
  const { unitMap, trueRootId } = useUnitStore()
  const { currentPhase: phase } = usePhaseStore()
  const select = useUnitInteractionStore(s => s.selectSignature)

  if (!select) return null
  
  const selectedId = processSelect(select, unitMap, trueRootId, phase)
  if (!selectedId) return null

  const unit = unitMap[selectedId]
  if (!unit || unit.type !== "org") return null

  // TODO: Make draggable 
  const unmodedChildrenEntry = unit.children
  const moddedChildrenEntry = getComplexChildList(unit, false, phase)

  const childEdittingList = unmodedChildrenEntry.map((entry, _) =>  {
    const myFlatIndex = moddedChildrenEntry.find((e) => e.childId === entry.id)?.flatIndex
    const childSignature = Array.isArray(select) && myFlatIndex !== undefined ? [...select, myFlatIndex] : entry.id
    
    return <ChildRow key={entry.id + "childEdittingList"}
        parentSignature={select}
        childSignature={childSignature}
        whoSelectOnSelectClick={childSignature}
      />; 
  } );

  return (
    <div className="editor-segment-flex">
      <AddingChildrenSegment parent={unit} parentId={selectedId} parentSignature={select}/>
      <div className="!gap-3 flex flex-col">
        {childEdittingList}
      </div>
      <FlatChildrenEditor/>
    </div>
  )
}