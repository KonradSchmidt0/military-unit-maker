import { useEffect, useState } from "react"
import { useShortcutStore } from "../../../hooks/shortcutStore"
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore"
import { useDialogBoxStorage } from "../../../hooks/useDialogBoxStore"

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

  const { open } = useDialogBoxStorage(s => s)

  if (!dbg)
    return null

  return (
    <div className="editor-segment-flex min-h-40">
      <div className="editor-segment-row">
        {select === undefined ? "undefined" : ""}
        {Array.isArray(select) ? "root" + select.map((flatIndex) => "->" + flatIndex) : ""}
        {typeof select === 'string' ? select : ""}
      </div>

      <div className="editor-segment-row">
        <button 
          onClick={
            () => open(
              "dbg test header", 
              "dbg test desc", 
              [
                {text: "opt 1", action: () => console.log("opt 1")},
                {text: "opt 2", action: () => console.log("opt 2")},
              ]
            )
          }
        >
          Test dialog!
        </button>
      </div>
    </div>
  )
}