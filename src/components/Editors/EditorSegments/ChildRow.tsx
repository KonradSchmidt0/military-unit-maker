import { UnitMap } from "../../../hooks/useUnitStore"
import { SafeNumberInput } from "./SafeNumberInput"

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
  key: string
}

export function ChildRow(p: ChildRowProps) {
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

      <SafeNumberInput count={p.count} onCountChange={p.onCountChange} key={"sni" + p.key}/>

      <button
        className="btn-emoji !p-0"
        onClick={() => p.onRemoveButtonPressed()}
      >
        ❌
      </button>
    </div> 
  )
}