import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePaletStore } from "../../../hooks/usePaletStore";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { getSafeChildOptions } from "../../../logic/getSafeChildOptions";
import { OrgUnit } from "../../../logic/logic";
import { ChildRow } from "./ChildRow";
import { UnitColorOptions } from "./UnitColorOptions";
import { EchelonEditor } from "./EchelonEditor";
import { VisualLayeringEditor } from "./VisualLayeringEditor";
import { GetFlatIds } from "../../../logic/childManaging";

export default function CommonUnitEditorSegment() {
  // Man, if propdrilling is one extreme, then this is the opposite one
  const { unitMap, trueRootId } = useUnitStore(s => s)
  const slctd = useUnitInteractionStore(s => s.select)
  const selectedId = processSelect(slctd, unitMap, trueRootId) as string
  const parentId = useUnitInteractionStore(s => s.getSelectedParent(unitMap, trueRootId))
  const selectPath = slctd as number[]
  
  const setSelected = useUnitInteractionStore(s => s.setSelect)
  const selectParent = useUnitInteractionStore(s => s.selectParent)
  const offsetSelect = useUnitInteractionStore(s => s.offsetSelect)
  const selectSister = useUnitInteractionStore(s => s.changeSelectedChild)

  const updateUnit = useUnitStore(s => s.updateUnit)
  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)
  const setChildCount = useUnitStore(s => s.changeChildCount)
  const setChildId = useUnitStore(s => s.changeChildId)
  const removeChildFully = useUnitStore(s => s.removeChildType)
  const moveChild = useUnitStore(s => s.moveChildPos)

  const unitPalet = usePaletStore((state) => state.unitPalet)
  const addUnitToPalet = usePaletStore((state) => state.addUnitToPalet);
  const removeUnitFromPalet = usePaletStore((state) => state.removeUnitFromPalet);
  
  const {getCurrentRootId, actingRootPath, setActingRootPath, popNewTrueRoot} = useUnitStore(s => s)
  const curRootId = getCurrentRootId(trueRootId, actingRootPath, unitMap)

  const [ctrl, alt] = [useShortcutStore(s => s.isCtrlHeld), useShortcutStore(s => s.isAltHeld)]

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
    <><div className="editor-segment-flex">
      <label className="editor-segment-row">
        <span className="font-bold">Name:</span>
        <input
          id="NameInputId"
          type="text"
          value={selected?.name}
          onChange={handleNameChange}
          className="editor-element"
        />
      </label>

      <div className="editor-segment-row">
        {parentId ? <button className="btn-editor" onClick={() => handleUnlinking(selectedId)}>Unlink</button> : null}
        {trueRootId === selectedId && 
          <button className="btn-emoji" onClick={() => popNewTrueRoot(setSelected, offsetSelect, !ctrl)}>⬆️➕🫚</button>}
        {curRootId !== selectedId && parentId &&
          <button className="btn-emoji" 
                  onClick={() => handleSelectingUnselectingActingRoot(true)}
                >📌🫚</button>}
        {curRootId === selectedId && trueRootId !== selectedId &&
          <button className="btn-emoji" onClick={() => handleSelectingUnselectingActingRoot(false)}>🦒🫚</button>}
        {unitPalet.includes(selectedId) ? <button className="btn-emoji"
          onClick={() => removeUnitFromPalet(selectedId)}>🎨🚮</button> : null}
        {!unitPalet.includes(selectedId) ? <button className="btn-emoji"
          onClick={() => addUnitToPalet(selectedId)}>➕🎨</button> : null}
      </div>

      {parentId && <ChildRow
        childId={selectedId}
        count={(parent as OrgUnit).children[selectedId]}
        childrenChoices={{[selectedId]: selected, ...getSafeChildOptions(parentId, unitMap, unitPalet, (parent as OrgUnit).children)}}
        onChildChange={(n) => {
          setChildId(parentId, selectedId, n);
          ctrl ? selectParent() : setSelected(n)
        }}
        onCountChange={(n) => { setChildCount(parentId, selectedId, n); if (ctrl) selectParent();}}
        onRemoveButtonPressed={ () => {
          removeChildFully(parentId, selectedId); 
          ctrl ? selectParent() : setSelected(undefined)
        } }
        
        upDownButton={true}
        onUpPressed={() => {moveChild(parentId, selectedId, "top"); if (ctrl) selectParent(); else selectSister("top", parent.children)}}
        onDownPressed={() => {moveChild(parentId, selectedId, "bottom"); if (ctrl) selectParent(); else selectSister("bottom", parent.children)}}
      />}

      <div className="editor-segment-row">
        <EchelonEditor echelonLevel={selected.echelonLevel} onChange={handleEchelonChange} id="select-echelon-editor"/>
        <UnitColorOptions/>
      </div>
    </div>
    <VisualLayeringEditor/>
  </>
) }
