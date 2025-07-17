import { usePaletStore } from "../../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useDuplicateUnit, useUnitStore } from "../../../hooks/useUnitStore";
import { addChild, defaultUnitColor, OrgUnit, removeChild } from "../../../logic/logic";
import CountInParent from "./CountInParent";
import { EchelonEditor } from "./EchelonEditor";
import { VisualLayeringEditor } from "./VisualLayeringEditor";

interface CommonUnitEditorSegmentProps {
  popNewParentForRoot: Function
}

export default function CommonUnitEditorSegment({ popNewParentForRoot }: CommonUnitEditorSegmentProps) {
  const selectedId = useUnitInteractionStore((s) => s.selectedId) as string
  const selectedParentId = useUnitInteractionStore((s) => s.selected_parentId) as string
  const setSelectedId = useUnitInteractionStore((s) => s.setSelectedId)

  // We are getting whole map since later we will need to get other unit in a conditional, and u can only use hooks at top
  const unitMap = useUnitStore((state) => state.unitMap);
  const updateUnit = useUnitStore(s => s.updateUnit)
  const unitPalet = usePaletStore((state) => state.unitPalet)
  const addUnitToPalet = usePaletStore((state) => state.addUnitToPalet);
  const removeUnitFromPalet = usePaletStore((state) => state.removeUnitFromPalet);

  const selected = unitMap[selectedId]

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUnit(selectedId, {
      ...selected,
      name: e.target.value,
    });
  };

  const duplicateUnit = useDuplicateUnit()

  function handleUnlinking(id: string) {
    if (!selectedParentId)
      return

    const newId = duplicateUnit(id);
    let p = unitMap[selectedParentId] as OrgUnit // By definition parent is an OrgUnit
    p = removeChild(p, selectedId)
    p = addChild(p, newId)
    updateUnit(selectedParentId, p);
    setSelectedId(newId)
  }

  const colorPicker = 
    (<div>
      <input
        id="ColorPickerInputId"
        type="color"
        value={selected.smartColor}
        onChange={(e) => {
          updateUnit(selectedId, { ...selected, smartColor: e.target.value });
        }}
        className="h-full appearance-none border-0 outline-none cursor-pointer rounded"
      />
    </div>)
  const inheretColor = (
    <button className="btn-emoji" onClick={() => { updateUnit(selectedId, { ...selected, smartColor: "inheret"}) }}>Inheret ⬆️🖌️</button>
  )
  const uninheretColor = (
    <button className="btn-emoji" onClick={() => { 
      const color = selectedParentId 
        ? unitMap[selectedParentId].smartColor 
        : defaultUnitColor; updateUnit(selectedId, { ...selected, smartColor: color}) }
      }>Uninheret ❌🖌️</button>
  )

  return (
    <><div className="border-slate-400 border-b-2 border-dashed p-2 flex flex-col gap-2 items-center">
      <label className="flex flex-col gap-2 w-full ">
        <span className="font-bold">Name:</span>
        <input
          id="NameInputId"
          type="text"
          value={selected.name}
          onChange={handleNameChange}
          className="p-1 border border-slate-300 bg-slate-800 text-white"
        />
      </label>

      <div className="flex flex-row gap-2">
        {selectedParentId ? <button className="btn-editor" onClick={() => handleUnlinking(selectedId)}>Unlink</button> : null}
        {selectedParentId === undefined ? <button className="btn-editor" onClick={() => popNewParentForRoot()}>New Root</button> : null}
        {unitPalet.includes(selectedId) ? <button className="btn-emoji"
          onClick={() => removeUnitFromPalet(selectedId)}>🎨🚮</button> : null}
        {!unitPalet.includes(selectedId) ? <button className="btn-emoji"
          onClick={() => addUnitToPalet(selectedId)}>➕🎨</button> : null}
        {selectedId ? <CountInParent/> : null}
      </div>

      <div className="flex flex-row gap-2">
        {<EchelonEditor/>}
        {selected.smartColor !== "inheret" ? colorPicker : null}
        {selected.smartColor === "inheret" ? uninheretColor : inheretColor}
      </div>
    </div>
    <div className="border-slate-400 border-b-2 border-dashed p-2 flex flex-col gap-2 items-center">
      <VisualLayeringEditor/>
    </div></>
) }
