import { getEquipmentTable } from "../logic/logic";
import { useUnitStore } from "../hooks/useUnitStore";
import { processSelect, useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";


// Bugged curently. Needs to press to update. Not sure why, but happened when moved to useUnitInteractionStore
function HoverInspector() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const unitId = processSelect(useUnitInteractionStore(s => s.select), unitMap, trueRootId)

  
  if (!unitId) return <div className=" text-gray-500">Hover over a unit to inspect</div>;
  
  const unit = unitMap[unitId]
  const equipment = getEquipmentTable(unitId, unitMap);
  
  return (
    <div className="border rounded bg-slate-900 p-4">
      <h2 className="font-bold mb-2">{unit?.name}</h2>
      <ul className="list-disc pl-4">
        {Object.entries(equipment).map(([type, count]) => (
          <li key={type}>
            {type}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HoverInspector;
