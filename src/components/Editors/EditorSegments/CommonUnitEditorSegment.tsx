import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePaletStore } from "../../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { getSafeChildOptions } from "../../../logic/getSafeChildOptions";
import { defaultUnitColor, OrgUnit } from "../../../logic/logic";
import { ChildRow } from "./ChildRow";
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
  const rootId = useUnitStore(s => s.rootId)
  const popNewRoot = useUnitStore(s => s.popNewRoot)

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

  const selectParent = () => { setSelected(parentId); setParent(undefined) }

  const colorPicker = 
    (<input
      id="ColorPickerInputId"
      type="color"
      value={selected.smartColor}
      onChange={(e) => {
        updateUnit(selectedId, { ...selected, smartColor: e.target.value as `#${string}` });
      }}
      className="editor-element !p-0 !h-8"
    />)
  const inheretColor = (
    <button className="btn-emoji" onClick={() => { updateUnit(selectedId, { ...selected, smartColor: "inheret"}) }}>⬆️🖌️</button>
  )
  const uninheretColor = (
    <button className="btn-emoji" onClick={() => { 
      let color = parentId 
        ? unitMap[parentId].smartColor 
        : defaultUnitColor; 
      color = color === "inheret" ? defaultUnitColor : color
      updateUnit(selectedId, { ...selected, smartColor: color}) }
      }>🦋🖌️</button>
  )

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
        {rootId === selectedId ? <button className="btn-editor" onClick={() => popNewRoot(setSelected, setParent, !ctrl)}>New Root</button> : null}
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
        {selected.smartColor !== "inheret" ? colorPicker : null}
        {selected.smartColor === "inheret" ? uninheretColor : inheretColor}
      </div>
    </div>
    <VisualLayeringEditor/></>
) }
