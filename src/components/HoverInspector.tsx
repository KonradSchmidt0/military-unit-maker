import { getEquipmentTable } from "../logic/logic";
import { getUnitQuick } from "../hooks/useUnitStore";

interface HoverInspectorProps {
  unitId?: string;
}

function HoverInspector({ unitId }: HoverInspectorProps) {
  if (!unitId) return <div className=" text-gray-500">Hover over a unit to inspect</div>;

  const equipment = getEquipmentTable(unitId);

  return (
    <div className="border rounded bg-slate-900 p-4">
      <h2 className="font-bold mb-2">{getUnitQuick(unitId).name}</h2>
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
