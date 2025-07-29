import { useEffect, useState } from "react";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { defaultUnitColor, SmartColor, Unit } from "../../../logic/logic";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";


export function UnitColorOptions() {
  const selectedId = useUnitInteractionStore(s => s.selectedId) as string
  const selected_ParentId = useUnitInteractionStore(s => s.selected_parentId)

  const unitMap = useUnitStore(s => s.unitMap)
  const unit = unitMap[selectedId] as Unit
  const updateUnit = useUnitStore(s => s.updateUnit)

  const [color, setColor] = useState<SmartColor>(unit?.smartColor === "inheret" ? defaultUnitColor : unit?.smartColor)

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateUnit(selectedId, { ...unit, smartColor: color});
    }, 120);

    return () => clearTimeout(timeout);
    }, [color]); // If you add more things to dependencies it will break the ctrl z 

  useEffect(() =>  {
    setColor(unit.smartColor)
  }, [unit.smartColor])

  const colorPicker = 
    (<input
      id="ColorPickerInputId"
      type="color"
      value={color}
      onChange={(e) => {
        setColor(e.target.value as SmartColor);
      }}
      className="editor-element !p-0 !h-8"
    />)
  const inheretColor = (
    <button className="btn-emoji" onClick={() => { updateUnit(selectedId, { ...unit, smartColor: "inheret"}) }}>⬆️🖌️</button>
  )
  const uninheretColor = (
    <button className="btn-emoji" onClick={() => { 
      let c = selected_ParentId 
        ? unitMap[selected_ParentId].smartColor 
        : defaultUnitColor; 
      c = c === "inheret" ? defaultUnitColor : c
      updateUnit(selectedId, { ...unit, smartColor: c}) }
      }>🦋🖌️</button>
  )

  return <>
    {unit.smartColor !== "inheret" ? colorPicker : null}
    {unit.smartColor === "inheret" ? uninheretColor : inheretColor}
  </>
}