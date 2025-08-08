import { useEffect, useState } from "react"
import { useShortcutStore } from "../../../hooks/shortcutStore"
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"

export function DebugSegment() {
  const [dbg, setDbg] = useState(false)

  const alt = useShortcutStore(s => s.isAltHeld)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (alt && e.key.toLowerCase() === 'p') {
        e.preventDefault(); // optional: prevent browser behavior
        setDbg(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [alt]);

  const select = useUnitInteractionStore(s => s.select)

  if (!dbg)
    return null

  return (
    <div className="editor-segment-flex min-h-40">
      <div className="editor-segment-row">
        {select === undefined ? "undefined" : ""}
        {Array.isArray(select) ? "root" + select.map((flatIndex) => "->" + flatIndex) : ""}
        {typeof select === 'string' ? select : ""}
      </div>
    </div>
  )
}