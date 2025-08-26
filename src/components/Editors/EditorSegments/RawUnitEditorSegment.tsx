import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitQuick, useUnitStore } from "../../../hooks/useUnitStore";
import { EquipmentTable, RawUnit } from "../../../logic/logic";
import { SafeNumberInput } from "./SafeNumberInput";

export default function RawUnitEditorSegment() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const selectedId = processSelect(useUnitInteractionStore(s => s.select), unitMap, trueRootId) as string

  const unit = useUnitQuick(selectedId) as RawUnit
  const updateUnit = useUnitStore((s) => s.updateUnit);
  const splitUnit = useUnitStore(s => s.splitRawUnit)

  if (!unit || unit.type !== "raw") {
    throw Error(`Unit ID or type wrong ID = ${selectedId}, type = ${unit?.type}`)
  }

  const equipmentEntries = Object.entries(unit.equipment);

  const changeEquipment = (additionalEq: EquipmentTable) => {
    const newEquipment = { ...unit.equipment, ...additionalEq};
    updateUnit(selectedId, { ...unit, equipment: newEquipment });
  };

  const deleteEquipment = (type: string) => {
    const newEquipment = { ...unit.equipment };
    delete newEquipment[type];
    updateUnit(selectedId, { ...unit, equipment: newEquipment });
  };

  const handleAdding = () => {
    const p = "Enter new equipment type. Press double space to enter quantity (e.g. 'Rifle  30', 'Howitzer', 'MG42  6' , Stryker IFV  14 ). Enter commas (,) to add new type:"
    const inp = prompt(p);
    if (!inp) return;

    let eq: EquipmentTable = {}
    const pairs = inp.split(/\s*,\s*/) // Splits if theres comma between
    for (const pair of pairs) {
      const [left, right] = pair.split(/ {2,}/); // Split by double space or more
      const type = left.trim()
      const qty = parseInt(right, 10);
  
      if (!isNaN(qty)) {
        eq[type] = qty;
      } else {
        const qtyPrompt = prompt(`Enter quantity for "${left}":`);
        if (qtyPrompt && !isNaN(parseInt(qtyPrompt, 10))) {
          eq[type] = parseInt(qtyPrompt, 10);
        }
      }
    }

    changeEquipment(eq)
  };

  const handleSpliting = () => {
    const p = "Split unit into how many children? (enter not a number to cancel) : "
    const userInput = prompt(p)
    if (!userInput)
      return

    const childCount = parseInt(userInput, 10)
    if (isNaN(childCount)) {
      return
    }

    splitUnit(selectedId, childCount)
  }

  return (
    <div className="editor-segment-flex">
      <div className="editor-segment-row">
        <span className="text-lg font-bold">Equipment</span>
        <button onClick={handleAdding} className="btn-emoji">
          ➕Add
        </button>
        <button onClick={handleSpliting} className="btn-emoji">
          ➗Split
        </button>
      </div>

      {equipmentEntries.map(([type, value]) => (
        <div key={type} className="editor-segment-row">
          <span className="w-24">{type}</span>
          <SafeNumberInput
            key={type}
            count={value}
            onCountChange={nc => changeEquipment({[type]: nc})}
            className="!w-24"
          />
          <button onClick={() => deleteEquipment(type)} className="btn-emoji !p-0">
            ❌
          </button>
        </div>
      ))}
    </div> )
}