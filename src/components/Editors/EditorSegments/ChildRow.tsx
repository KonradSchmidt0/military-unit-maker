import { useEffect, useState } from "react"
import { UnitMap } from "../../../hooks/useUnitStore"

interface ChildRowProps {
  childId: string
  count: number
  childrenChoices: UnitMap
  onChildChange: (newId: string) => void
  onCountChange: (newCount: number) => void
  onRemoveButtonPressed: () => void
  upDownButton: boolean
  onUpPressed?: () => void
  onDownPressed?: () => void
}

export function ChildRow(p: ChildRowProps) {
  const [tempCount, setTempCount] = useState(p.count.toString());

  // Keep local input synced if parent updates count from outside
  useEffect(() => {
    if (p.count.toString() !== tempCount) {
      setTempCount(p.count.toString());
    }
  }, [p.count]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTempCount(val);

    // Parse and only call onCountChange if valid number
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      p.onCountChange(parsed);
    }
  };

  return (
    <div className="editor-segment-row">
      {p.upDownButton && <button className="btn-emoji !p-0" onClick={p.onUpPressed}>⬆️</button>}
      {p.upDownButton && <button className="btn-emoji !p-0" onClick={p.onDownPressed}>⬇️</button>}
      {/* Dropdown to change the child.unitId */}
      <select
        className="editor-element !w-[5.5rem]"
        value={p.childId}
        id={p.childId}
        onChange={(e) => p.onChildChange(e.target.value)}
      >
        {Object.entries(p.childrenChoices).map(([id, u]) => (
          <option key={id} value={id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* Input to change count */}
      <input
        type="number"
        className="editor-element !w-16"
        value={tempCount}
        onChange={handleChange}
      />

      {/* Button to remove this child entry */}
      <button
        className="btn-emoji !p-0"
        onClick={() => p.onRemoveButtonPressed()}
      >
        ❌
      </button>
    </div> 
  )
}