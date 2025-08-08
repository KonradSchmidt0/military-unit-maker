import { getEquipmentTable } from "../logic/logic";
import { useUnitStore } from "../hooks/useUnitStore";
import { useHoverStore } from "../hooks/useHoverStore";
import { useEffect, useState } from "react";

export function HoverInspector() {
  const unitMap = useUnitStore(s => s.unitMap)
  const {id, pos} = useHoverStore(s => s)
  const [show, setShow] = useState(false);
  const [delayTimer, setDelayTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 750);
      setDelayTimer(timer);
    } else {
      setShow(false);
      if (delayTimer) clearTimeout(delayTimer);
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [id]);

  if ('ontouchstart' in window) return null;

  return (
    <div 
      className={`editor-box pointer-events-none !w-fit !absolute !z-10 dark:!bg-bg !bg-white !border-r-2 rounded-lg duration-300 ${ show ? 'opacity-100 transition-opacity' : 'opacity-0'}`} 
      style={{ top: pos.top, left: pos.left }}>
      <div className="flex flex-col px-2 gap-2">
        <h2 className="font-bold mb-2 text-center">{unitMap[id ?? ""]?.name}</h2>
        <h2 className="font mb-2">{unitMap[id ?? ""]?.desc}</h2>
        <ul className="list-disc pl-4">
          {id && Object.entries(getEquipmentTable(id, unitMap)).map(([type, count]) => (
            <li key={type}>
              {type}: {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
