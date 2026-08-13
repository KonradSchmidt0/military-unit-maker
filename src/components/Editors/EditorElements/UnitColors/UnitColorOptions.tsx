import { useRef } from "react"
import { useColorPalletDropdownStore } from "../../../../hooks/useColorPalletDropdownStore"
import { useColorPalletStore } from "../../../../hooks/useColorPalletStore"
import { useUnitInteractionStore, processSelect } from "../../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../../hooks/useUnitStore"
import { GetTrueColor } from "../../../../logic/Units/unitColorManaging"
import SafeColorInput from "../SafeInputs/SafeColorInput"

export function UnitColorOptions() {
  const { unitMap, trueRootId, updateUnit } = useUnitStore()
  const { selectSignature } = useUnitInteractionStore()
  const { colorMap } = useColorPalletStore()
  const { CallColorDropdown, onChosen } = useColorPalletDropdownStore()
  
  const selectedId = processSelect(selectSignature, unitMap, trueRootId) as string
  const unit = unitMap[selectedId];

  const mousePos = useRef({x: 0, y: 0})

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

  const colorPicker = (
    <SafeColorInput
      color={unit.smartColor as `#${string}`}
      update={(color) => updateUnit(selectedId, {...unit, smartColor: color})}
    />
  )

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
    >🎨</button>
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