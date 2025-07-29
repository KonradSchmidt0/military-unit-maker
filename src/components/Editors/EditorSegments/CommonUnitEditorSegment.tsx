import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePaletStore } from "../../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { getSafeChildOptions } from "../../../logic/getSafeChildOptions";
import { OrgUnit } from "../../../logic/logic";
import { ChildRow } from "./ChildRow";
import { UnitColorOptions } from "./UnitColorOptions";
import { EchelonEditor } from "./EchelonEditor";
import { VisualLayeringEditor } from "./VisualLayeringEditor";

export default function CommonUnitEditorSegment() {
  // We are getting whole map since later we will need to get other unit in a conditional, and u can only use hooks at top
  const unitMap = useUnitStore(s => s.unitMap);
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
  
  const selectedId = useUnitInteractionStore((s) => s.selectedId) as string
  const setSelected = useUnitInteractionStore((s) => s.setSelectedId)
  const parentId = useUnitInteractionStore((s) => s.selected_parentId)
  const setParent = useUnitInteractionStore((s) => s.setSelected_parentId)
  const {getCurrentRootId, trueRootId, actingRootId, setActingRootId, popNewTrueRoot} = useUnitStore(s => s)
  const curRootId = getCurrentRootId(trueRootId, actingRootId)

  const [ctrl, alt] = [useShortcutStore(s => s.isCtrlHeld), useShortcutStore(s => s.isAltHeld)]

  const selected = unitMap[selectedId]
  const parent = unitMap[parentId ? parentId : ""]

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
    addChild(parentId, selectedId, -1)
    addChild(parentId, newId, 1)
    if (!alt)
      setSelected(newId)
  }

  function handleEchelonChange(newEchelonLevel: number) {
    updateUnit(selectedId, {...selected, echelonLevel: newEchelonLevel})
  }

  function handleSelectingUnselectingActingRoot(n: string | undefined) {
    setActingRootId(n)
    if (ctrl && !n) {
      setSelected(trueRootId)
    }
  }

  const selectParent = () => { setSelected(parentId); setParent(undefined) }

  return (
    <><div className="editor-segment-flex">
      <label className="editor-segment-row">
        <span className="font-bold">Name:</span>
        <input
          id="NameInputId"
          type="text"
          value={selected.name}
          onChange={handleNameChange}
          className="editor-element"
        />
      </label>

      <div className="editor-segment-row">
        {parentId ? <button className="btn-editor" onClick={() => handleUnlinking(selectedId)}>Unlink</button> : null}
        {trueRootId === selectedId && 
          <button className="btn-emoji" onClick={() => popNewTrueRoot(setSelected, setParent, !ctrl)}>⬆️➕🫚</button>}
        {curRootId !== selectedId &&
          <button className="btn-emoji" onClick={() => handleSelectingUnselectingActingRoot(selectedId)}>📌🫚</button>}
        {curRootId === selectedId && trueRootId !== selectedId &&
          <button className="btn-emoji" onClick={() => handleSelectingUnselectingActingRoot(undefined)}>🦒🫚</button>}
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
          ctrl ? selectParent() : (() => {setSelected(undefined); setParent(undefined);})()
        } }
        
        upDownButton={true}
        onUpPressed={() => {moveChild(parentId, selectedId, "top"); if (ctrl) selectParent();}}
        onDownPressed={() => {moveChild(parentId, selectedId, "bottom"); if (ctrl) selectParent();}}
      />}

      <div className="editor-segment-row">
        <EchelonEditor echelonLevel={selected.echelonLevel} onChange={handleEchelonChange} id="select-echelon-editor"/>
        <UnitColorOptions/>
      </div>
    </div>
    <VisualLayeringEditor/></>
) }
