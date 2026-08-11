import { useEffect, useRef, useState } from "react";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { defaultUnitColor, SmartColor } from "../../../logic/Units/logic";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { GetTrueColor } from "../../../logic/Units/unitColorManaging";
import { useColorPalletStore } from "../../../hooks/useColorPalletStore";
import { useColorPalletDropdownStore } from "../../../hooks/useColorPalletDropdownStore";


export function UnitColorOptions() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const selectSignature = useUnitInteractionStore(s => s.selectSignature)
  const updateUnit = useUnitStore(s => s.updateUnit)
  const { colorMap } = useColorPalletStore()
  const { CallColorDropdown, onChosen } = useColorPalletDropdownStore()
  
  const selectedId = processSelect(selectSignature, unitMap, trueRootId) as string
  const unit = unitMap[selectedId];
  
  const [color, setColor] = useState<SmartColor>(defaultUnitColor)

  const mousePos = useRef({x: 0, y: 0})

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

  const unitSC = unit.smartColor
  const unitColorType = 
    unitSC === "inheret" ? "inheret" :
    typeof unitSC === "number" ? "pallet" :
    "manual"

  const colorOptions = [
    {
      text: "🕊️🖌️",
      value: "manual",
      onclick: () => { 
        const c = GetTrueColor(selectSignature, trueRootId, unitMap, colorMap)
        updateUnit(selectedId, { ...unit, smartColor: c})
      }
    },
    {
      text: "⬆️🖌️",
      value: "inheret",
      onclick: () => { updateUnit(selectedId, { ...unit, smartColor: "inheret"}) }
    },
    {
      text: "🎨🖌️",
      value: "pallet",
      onclick: () => { 
        CallColorDropdown( 
          (userChosenIndex) => updateUnit(selectedId, { ...unit, smartColor: userChosenIndex}),
          {top: mousePos.current.y, left: mousePos.current.x}
        ) 
      }
    },
  ]

  const onUserChangingType = (value: string) => {
    const selected = colorOptions.find((opt) => opt.value === value);
    selected?.onclick?.();
  };

  const colorPicker = 
    (<input
      id="ColorPickerInputId"
      type="color"
      value={color}
      onChange={(e) => {
        setColor(e.target.value as `#${string}`);
      }}
      className="editor-element !p-0 !h-8"
    />)
  const colorPalletCaller = (
    <button 
      className="btn-emoji" 
      onClick={ (e) =>{
        onChosen === undefined ? 
          CallColorDropdown(
            (chosenIndex) => updateUnit(selectedId, {...unit, smartColor: chosenIndex}),
            {top: e.clientY, left: e.clientX}
          ) : 
          CallColorDropdown(undefined)
      }}
    >🎨 </button>
  )

  return <>
    {typeof unit.smartColor === "string" && unit.smartColor[0] === "#" ? colorPicker : null}
    <select
      className="editor-element"
      value={unitColorType}
      onMouseDown={(e) => {
        mousePos.current = { x: e.clientX, y: e.clientY }
      }}
      onChange={e => onUserChangingType(e.target.value)}
      >
      {colorOptions.map(e => (
        <option value={e.value} key={e.value}>
          {e.text}
        </option>
      ))}
    </select>
    {typeof unit.smartColor === "number" ? colorPalletCaller : null} 
  </>
}