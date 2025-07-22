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
  return (
    <div className="editor-segment-row">
      {p.upDownButton && <button className="btn-emoji !p-0" onClick={p.onUpPressed}>⬆️</button>}
      {p.upDownButton && <button className="btn-emoji !p-0" onClick={p.onDownPressed}>⬇️</button>}
      {/* Dropdown to change the child.unitId */}
      <select
        className="editor-element !w-full !w-min-full"
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
        value={p.count}
        onChange={(e) => p.onCountChange(parseInt(e.target.value, 10))}
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