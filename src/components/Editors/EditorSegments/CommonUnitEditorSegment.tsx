import { useShortcutStore } from "../../../hooks/shortcutStore";
import { usePaletStore } from "../../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { defaultUnitColor } from "../../../logic/logic";
import CountInParent from "./CountInParent";
import { EchelonEditor } from "./EchelonEditor";
import { VisualLayeringEditor } from "./VisualLayeringEditor";

export default function CommonUnitEditorSegment() {
  // We are getting whole map since later we will need to get other unit in a conditional, and u can only use hooks at top
  const unitMap = useUnitStore(s => s.unitMap);
  const updateUnit = useUnitStore(s => s.updateUnit)
  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)

  const unitPalet = usePaletStore((state) => state.unitPalet)
  const addUnitToPalet = usePaletStore((state) => state.addUnitToPalet);
  const removeUnitFromPalet = usePaletStore((state) => state.removeUnitFromPalet);
  
  const selectedId = useUnitInteractionStore((s) => s.selectedId) as string
  const selectedParentId = useUnitInteractionStore((s) => s.selected_parentId) as string
  const rootId = useUnitInteractionStore(s => s.rootId)
  const setSelectedId = useUnitInteractionStore((s) => s.setSelectedId)
  const popNewRoot = useUnitInteractionStore(s => s.popNewRoot)

  const [ctrl, alt] = [useShortcutStore(s => s.isCtrlHeld), useShortcutStore(s => s.isAltHeld)]

  const selected = unitMap[selectedId]

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUnit(selectedId, {
      ...selected,
      name: e.target.value,
    });
  };

  function handleUnlinking(id: string) {
    if (!selectedParentId)
      return

    const newId = duplicateUnit(id);
    addChild(selectedParentId, selectedId, -1)
    addChild(selectedParentId, newId, 1)
    if (!alt)
      setSelectedId(newId)
  }

  function handleEchelonChange(newEchelonLevel: number) {
    updateUnit(selectedId, {...selected, echelonLevel: newEchelonLevel})
  }

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
    <button className="btn-emoji" onClick={() => { updateUnit(selectedId, { ...selected, smartColor: "inheret"}) }}>Inheret ⬆️🖌️</button>
  )
  const uninheretColor = (
    <button className="btn-emoji" onClick={() => { 
      let color = selectedParentId 
        ? unitMap[selectedParentId].smartColor 
        : defaultUnitColor; 
      color = color === "inheret" ? defaultUnitColor : color
      updateUnit(selectedId, { ...selected, smartColor: color}) }
      }>Uninheret ❌🖌️</button>
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
        {selectedParentId ? <button className="btn-editor" onClick={() => handleUnlinking(selectedId)}>Unlink</button> : null}
        {rootId === selectedId ? <button className="btn-editor" onClick={() => popNewRoot(unitMap, updateUnit, !ctrl)}>New Root</button> : null}
        {unitPalet.includes(selectedId) ? <button className="btn-emoji"
          onClick={() => removeUnitFromPalet(selectedId)}>🎨🚮</button> : null}
        {!unitPalet.includes(selectedId) ? <button className="btn-emoji"
          onClick={() => addUnitToPalet(selectedId)}>➕🎨</button> : null}
        {selectedId ? <CountInParent/> : null}
      </div>

      <div className="editor-segment-row">
        <EchelonEditor echelonLevel={selected.echelonLevel} onChange={handleEchelonChange} id="select-echelon-editor"/>
        {selected.smartColor !== "inheret" ? colorPicker : null}
        {selected.smartColor === "inheret" ? uninheretColor : inheretColor}
      </div>
    </div>
    <VisualLayeringEditor/></>
) }
