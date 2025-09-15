import { useEffect, useState } from "react";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { defaultUnitColor, SmartColor } from "../../../logic/logic";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { GetTrueColor } from "../../../logic/childManaging";
import { useHoverStore } from "../../../hooks/useHoverStore";


export function UnitColorOptions() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const selectSignature = useUnitInteractionStore(s => s.selectSignature)
  const updateUnit = useUnitStore(s => s.updateUnit)
  const { callSimpleI, callOff } = useHoverStore(s => s)
  
  const selectedId = processSelect(selectSignature, unitMap, trueRootId) as string
  const unit = unitMap[selectedId];
  
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
      onMouseEnter={() => { callSimpleI("Selects color of the unit") }}
      onMouseLeave={() => callOff()}
    />)
  const inheretColor = (
    <button 
      className="btn-emoji" 
      onClick={() => { updateUnit(selectedId, { ...unit, smartColor: "inheret"}) }}
      onMouseEnter={() => { callSimpleI("Inherits color from parent") }}
      onMouseLeave={() => callOff()}
    >⬆️🖌️</button>
  )
  const uninheretColor = (
    <button 
      className="btn-emoji" 
      onClick={() => { 
        let c = GetTrueColor(selectSignature, trueRootId, unitMap)
        updateUnit(selectedId, { ...unit, smartColor: c}) }
      }
      onMouseEnter={() => { callSimpleI("Allows to manually set color of the unit") }}
      onMouseLeave={() => callOff()}
    >🕊️🖌️</button>
  )

  return <>
    {unit.smartColor !== "inheret" ? colorPicker : null}
    {unit.smartColor === "inheret" ? uninheretColor : inheretColor}
  </>
}