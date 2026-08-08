import { useEffect, useState } from "react";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { defaultUnitColor, SmartColor } from "../../../logic/Units/logic";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { GetTrueColor } from "../../../logic/Units/unitColorManaging";
import { useHoverStore } from "../../../hooks/useHoverStore";
import { useColorPalletStore } from "../../../hooks/useColorPalletStore";


export function UnitColorOptions() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const selectSignature = useUnitInteractionStore(s => s.selectSignature)
  const updateUnit = useUnitStore(s => s.updateUnit)
  const { callSimpleI, callOff } = useHoverStore(s => s)
  const { colorMap } = useColorPalletStore()
  
  const selectedId = processSelect(selectSignature, unitMap, trueRootId) as string
  const unit = unitMap[selectedId];
  
  const [color, setColor] = useState<SmartColor>(defaultUnitColor)

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
        let c = GetTrueColor(selectSignature, trueRootId, unitMap, colorMap)
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
      onclick: () => { updateUnit(selectedId, { ...unit, smartColor: 0}) }
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
      onMouseEnter={() => { callSimpleI("Selects color of the unit") }}
      onMouseLeave={() => callOff()}
    />)

  return <>
    {typeof unit.smartColor === "string" && unit.smartColor[0] === "#" ? colorPicker : null}
    {typeof unit.smartColor === "number" ? null : null} 
    <select className="editor-element" value={unitColorType} onChange={e => onUserChangingType(e.target.value)}>
      {colorOptions.map(e => (
        <option value={e.value} key={e.value}>
          {e.text}
        </option>
      ))}
    </select>
  </>
}