import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { ChildRow } from "./ChildRow";
import { UnitColorOptions } from "../EditorElements/UnitColorOptions";
import { EchelonEditor } from "../EditorElements/EchelonEditor";
import { VisualLayeringEditor } from "./VisualLayeringEditor";
import { ForceFoldingSegment } from "./ForceFoldingSegment";
import { LabledInput } from "../EditorElements/LabledInput";
import { CommonEditorAlphaRow } from "./CommonEditorAlphaRow";
import { OrgUnit } from "../../../logic/logic";

export default function CommonUnitEditorSegment() {
  const { unitMap, trueRootId, updateUnit } = useUnitStore(s => s)
  const { selectSignature, changeSelectedChild} = useUnitInteractionStore(s => s)
  const parentId = useUnitInteractionStore(s => s.getSelectedParent(unitMap, trueRootId))
  
  const selectedId = processSelect(selectSignature, unitMap, trueRootId)

  if (!selectSignature || !selectedId)
    return null
    
  const selected = unitMap[selectedId]

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUnit(selectedId, {
      ...selected,
      name: e.target.value,
    });
  };

  function handleEchelonChange(newEchelonLevel: number) {
    updateUnit(selectedId as string, {...selected, echelonLevel: newEchelonLevel})
  }

  return ( 
  <>
    <div className="editor-segment-flex">

      <LabledInput
        label="Name:"
        value={selected?.name}
        onChange={handleNameChange}
        id="UnitNameInput"
        hover={{header: "Name of this unit type"}}
      />

      <CommonEditorAlphaRow/>

      {Array.isArray(selectSignature) && <ForceFoldingSegment path={selectSignature}></ForceFoldingSegment>}

      {parentId && Array.isArray(selectSignature) && <ChildRow
        parentSignature={selectSignature.slice(0, -1)}
        childSignature={selectSignature}
        whoSelectOnSelectClick={selectSignature.slice(0, -1)}
        key="top child row"
        disableShadow={true}
        onMoveMade={(d) => changeSelectedChild(d, (unitMap[parentId] as OrgUnit).children)}
      />}

      <div className="editor-segment-row">
        <EchelonEditor 
          echelonLevel={selected.echelonLevel} 
          onChange={handleEchelonChange} 
          id="select-echelon-editor"
          hover={"Changes the echelon (size indicator on top) of selected unit"}
        />
        <UnitColorOptions/>
      </div>
    </div>
    <VisualLayeringEditor/>
  </>
) }