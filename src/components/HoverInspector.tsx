import { getEquipmentTable } from "../logic/logic";
import { useUnitQuick } from "../hooks/useUnitStore";
import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";


// Bugged curently. Needs to press to update. Not sure why, but happened when moved to useUnitInteractionStore
function HoverInspector() {
  const unitId = useUnitInteractionStore((s) => s.selectedId)
  const unit = useUnitQuick(unitId ? unitId : "")

  if (!unitId) return <div className=" text-gray-500">Hover over a unit to inspect</div>;

  const equipment = getEquipmentTable(unitId);

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
