import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePaletStore } from "../../../hooks/usePaletStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { OrgUnit } from "../../../logic/logic";
import { ChildRow } from "./ChildRow";
import { UnitColorOptions } from "./UnitColorOptions";
import { EchelonEditor } from "./EchelonEditor";
import { VisualLayeringEditor } from "./VisualLayeringEditor";
import { GetFlatIds } from "../../../logic/childManaging";
import { ForceFoldingSegment } from "./ForceFoldingSegment";
import { LabledInput } from "./LabledInput";
import { useHoverStore } from "../../../hooks/useHoverStore";

export default function CommonUnitEditorSegment() {
  // Man, if propdrilling is one extreme, then this is the opposite one
  const { unitMap, trueRootId } = useUnitStore(s => s)
  const slctd = useUnitInteractionStore(s => s.selectSignature)
  const selectedId = processSelect(slctd, unitMap, trueRootId) as string
  const parentId = useUnitInteractionStore(s => s.getSelectedParent(unitMap, trueRootId))
  const selectPath = slctd as number[]
  
  const setSelected = useUnitInteractionStore(s => s.setSelect)
  const offsetSelect = useUnitInteractionStore(s => s.offsetSelect)

  const updateUnit = useUnitStore(s => s.updateUnit)
  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)

  const unitPalet = usePaletStore((state) => state.unitPalet)
  const addUnitToPalet = usePaletStore((state) => state.addUnitToPalet);
  const removeUnitFromPalet = usePaletStore((state) => state.removeUnitFromPalet);
  
  const {getCurrentRootId, actingRootPath, setActingRootPath, popNewTrueRoot} = useUnitStore(s => s)
  const curRootId = getCurrentRootId(trueRootId, actingRootPath, unitMap)
  
  const { callSimple, callOff } = useHoverStore(s => s)

  const {ctrl, alt} = useShortcutStore(s => s)

  if (!slctd)
    return null
    
  const selected = unitMap[selectedId]
  const parent = unitMap[parentId ? parentId : ""] as OrgUnit

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUnit(selectedId, {
      ...selected,
      name: e.target.value,
    });
  };

  function handleUnlinking(id: string) {
    if (!parentId)
      return

    const newId = duplicateUnit(id);
    addChild(parentId, selectedId as string, -1)
    addChild(parentId, newId, 1)
    if (!alt)
      setSelected([...selectPath.slice(0, -1), GetFlatIds(parent.children).length - 1])
  }

  function handleEchelonChange(newEchelonLevel: number) {
    updateUnit(selectedId as string, {...selected, echelonLevel: newEchelonLevel})
  }

  function handleSelectingUnselectingActingRoot(b: boolean) {
    if (!b) {
      setActingRootPath([])
      return
    }
    setActingRootPath(selectPath)
  }

  return ( 
  <>
    <div className="editor-segment-flex">

      <LabledInput
        label="Name:"
        value={selected?.name}
        onChange={handleNameChange}
        id="UnitNameInput"
      />

      <div className="editor-segment-row">
        {parentId ? <button 
          className="btn-emoji" 
          onClick={() => handleUnlinking(selectedId)}
          onMouseEnter={() => callSimple("Unlinks this unit, meaning makes so changes to this unit, don't affect units of previously the same type")}
          onMouseLeave={() => callOff()}
        >Unlink</button> : null}
        {trueRootId === selectedId && 
          <button className="btn-emoji" onClick={() => popNewTrueRoot(setSelected, offsetSelect, !ctrl)}>⬆️➕</button>}
        {curRootId !== selectedId && parentId &&
          <button className="btn-emoji" 
                  onClick={() => handleSelectingUnselectingActingRoot(true)}
                >📌🦒</button>}
        {curRootId === selectedId && trueRootId !== selectedId &&
          <button className="btn-emoji" onClick={() => handleSelectingUnselectingActingRoot(false)}>❌📌</button>}
        {unitPalet.includes(selectedId) ? <button className="btn-emoji"
          onClick={() => removeUnitFromPalet(selectedId)}>🎨🚮</button> : null}
        {!unitPalet.includes(selectedId) ? <button className="btn-emoji"
          onClick={() => addUnitToPalet(selectedId)}>➕🎨</button> : null}
      </div>

      {Array.isArray(slctd) && <ForceFoldingSegment path={slctd}></ForceFoldingSegment>}

      {parentId && <ChildRow
        parentSignature={selectPath.slice(0, -1)}
        childSignature={slctd}
        whoSelectOnSelectClick={selectPath.slice(0, -1)}
        key="top child row"
        disableShadow={true}
      />}

      <div className="editor-segment-row">
        <EchelonEditor echelonLevel={selected.echelonLevel} onChange={handleEchelonChange} id="select-echelon-editor"/>
        <UnitColorOptions/>
      </div>
    </div>
    <VisualLayeringEditor/>
  </>
) }
