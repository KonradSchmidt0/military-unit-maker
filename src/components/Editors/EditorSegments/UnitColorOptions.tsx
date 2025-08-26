import { useEffect, useState } from "react";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { defaultUnitColor, SmartColor } from "../../../logic/logic";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { GetTrueColor } from "../../../logic/childManaging";


export function UnitColorOptions() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const selectSignature = useUnitInteractionStore(s => s.select)
  const selectedId = processSelect(selectSignature, unitMap, trueRootId) as string
  const unit = unitMap[selectedId];

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

  if (!selectSignature) {
    return null
  }

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
      let c = GetTrueColor(selectSignature, trueRootId, unitMap)
      updateUnit(selectedId, { ...unit, smartColor: c}) }
      }>🕊️🖌️</button>
  )

  return <>
    {unit.smartColor !== "inheret" ? colorPicker : null}
    {unit.smartColor === "inheret" ? uninheretColor : inheretColor}
  </>
}