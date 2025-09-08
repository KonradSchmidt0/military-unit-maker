import { getEquipmentTable } from "../logic/logic";
import { useUnitStore } from "../hooks/useUnitStore";
import { useHoverStore } from "../hooks/useHoverStore";
import { useEffect, useState } from "react";

export function HoverInspector() {
  const unitMap = useUnitStore((s) => s.unitMap);
  const { id, pos, simple, setPos } = useHoverStore((s) => s); // add setPos in store!
  const [show, setShow] = useState(false);
  const [delayTimer, setDelayTimer] = useState<NodeJS.Timeout | null>(null);

  // Tooltip delay handling
  useEffect(() => {
    if (id || simple) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 300);
      setDelayTimer(timer);
    } else {
      setShow(false);
      if (delayTimer) clearTimeout(delayTimer);
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [id, simple]);

  // Track mouse position globally while hovering
  useEffect(() => {
    if (!id && !simple) return;

    function handleMouseMove(e: MouseEvent) {
      setPos({ top: e.clientY + 12, left: e.clientX + 12 }); // +12px offset
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [id, simple, setPos]);

  if ("ontouchstart" in window) return null;

  const header = simple?.header ?? unitMap[id ?? ""]?.name 
  const desc = simple?.desc ?? unitMap[id ?? ""]?.desc

  return (
    <div
      className={`editor-box pointer-events-none !max-w-md !w-fit !absolute !z-10 dark:!bg-bg !bg-white !border-r-2 rounded-lg duration-300 ${
        show ? "opacity-100 transition-opacity" : "opacity-0"
      }`}
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="flex flex-col px-2 gap-2">
        <h2 className="font-bold mb-2 text-center">{header}</h2>
        {desc && <h2 className="font mb-2">{desc}</h2>}
        <ul className="list-disc pl-4">
          {id &&
            Object.entries(getEquipmentTable(id, unitMap)).map(([type, count]) => (
              <li key={type}>
                {type}: {count}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
