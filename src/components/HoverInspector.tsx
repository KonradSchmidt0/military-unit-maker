import { getGroupedEquipmentTable } from "../logic/itemListing";
import { useUnitStore } from "../hooks/useUnitStore";
import { useHoverStore } from "../hooks/useHoverStore";
import { useEffect, useRef, useState } from "react";
import { useEquipGroupingStore } from "../hooks/useEquipGroupingStore";

export function HoverInspector() {
  const unitMap = useUnitStore((s) => s.unitMap);
  const itemGroups = useEquipGroupingStore((s) => s.groups)
  const { id, pos, simple, setPos } = useHoverStore((s) => s);
  const [show, setShow] = useState(false);
  const [delayTimer, setDelayTimer] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Tooltip delay handling
  useEffect(() => {
    if (id || simple) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 430);
      setDelayTimer(timer);
    } else {
      setShow(false);
      if (delayTimer) clearTimeout(delayTimer);
    }

    return () => {
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [id, simple]);

  function handleMouseMove(e: MouseEvent) {
    const padding = 12;
    const tooltip = tooltipRef.current;

    let top = e.clientY + padding;
    let left = e.clientX + padding;

    if (tooltip) {
      const { offsetWidth, offsetHeight } = tooltip;

      if (left + offsetWidth > window.innerWidth) {
        left = window.innerWidth - offsetWidth - padding;
      }
      if (top + offsetHeight > window.innerHeight) {
        top = window.innerHeight - offsetHeight - padding;
      }
    }

    setPos({ top, left });
  }

  // Track mouse position globally while hovering
  useEffect(() => {
    if (!id && !simple) return;

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [id, simple, setPos]);

  let header = undefined
  let desc = undefined
  if (typeof simple === "string") {
    header = simple
  } else {
    header = simple?.header ?? unitMap[id ?? ""]?.name 
    desc = simple?.desc ?? unitMap[id ?? ""]?.desc
  }

  return (
    <div
      ref={tooltipRef}
      className={`editor-box pointer-events-none !max-w-md !w-fit !absolute !z-10 dark:!bg-bg !bg-white !border-r-2 rounded-lg ${
        show ? " transition-opacity opacity-100 duration-300" : "opacity-0"
      }`}
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="flex flex-col px-2 gap-2 py-2">
        <h2 className="font-bold text-center">{header}</h2>
        {desc && <h2>{desc}</h2>}
        <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
          {id &&
            getGroupedEquipmentTable(id, unitMap, itemGroups).map(({name, count}) => (
              <li key={name} className="border border-bg/30 dark:border-white/20 rounded py-1 border-dashed px-2">
                <b>{name}</b>: {count}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
