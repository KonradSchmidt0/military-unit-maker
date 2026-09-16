import { usePhaseStore } from "../../../hooks/usePhaseStore"
import { SelectionSignature } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { ChildEntry, OrgUnit } from "../../../logic/Units/logic"
import { defaultUnitColor } from "../../../logic/Units/unitColorManaging"
import { UnitDisplay } from "../../UnitDisplaying/UnitDisplay"

interface props {
  parentSignature: SelectionSignature
  parentId: string
  parent: OrgUnit
}

export default function AdvanceChildEdittingTable(p:props) {
  const { allPhases } = usePhaseStore()
  const { updateUnit } = useUnitStore()

  function changeCount(phaseIndex: number, childId: string, change: number) {
    if (phaseIndex === 0) {
      updateUnit(p.parentId, 
        {...p.parent, children: p.parent.children.map(e => e.id === childId ? {...e, count: Math.max(0, e.count + change)} : e)}
      )
      return
    }

    const base = p.parent.children.find(e => e.id === childId) as ChildEntry
    const mod = p.parent.childrenMods.find(e => e.childId === childId && e.phase === phaseIndex)
    if (!mod) {
      if (base.count + change < 0)
        return

      updateUnit(p.parentId,
        {...p.parent, 
          childrenMods: [...p.parent.childrenMods, {phase: phaseIndex, childId: childId, mod: change}]
        }
      )
      return
    }

    updateUnit(p.parentId,
      {...p.parent,
        childrenMods: p.parent.childrenMods
          .map(e => e.childId === childId && e.phase === phaseIndex ? {...e, mod: Math.max(-base.count, e.mod + change)} : e)
          .filter(e => e.mod !== 0)
      }
    )
  }

  function phase2td(phaseIndex: number, childId: string) {
    const value = phaseIndex === 0 ?
      p.parent.children.find(e => e.id === childId)?.count ?? 0
      :
      p.parent.childrenMods.find(e => e.childId === childId && e.phase === phaseIndex)?.mod ?? 0
    const displayVal = phaseIndex !== 0 ?
      (value >= 0 ? "+" : "") + value
      :
      value

    return (
      <td className="ace-tb">
        <div className="flex flex-row justify-center text-center gap-1 p-1">
          <div className="flex flex-col justify-center">
            <span className="editor-element h-fit">{displayVal}</span>
          </div>
          <div className="flex flex-col gap-2">
            <button className="btn-emoji" onClick={() => changeCount(phaseIndex, childId, 1)}>➕</button>
            <button className="btn-emoji" onClick={() => changeCount(phaseIndex, childId, -1)}>➖</button>
          </div>
        </div>
      </td>
    )
  }

  const topRowHeader = (
    <tr>
      <td className="ace-tb"></td>
      {allPhases.map((phase) => <td className="ace-tb px-3 text-center">{phase.name}</td>)}
    </tr>
  )
  const bodyRows = p.parent.children.map((entry, i) => {
    const color = defaultUnitColor // WIP

    return (
    <tr key={entry.id}>
      <td className="ace-tb">
        <div className="py-3 px-8">
          <UnitDisplay unitId={entry.id} color={color}/>
        </div>
      </td>
      {allPhases.map((_, phaseIndex) => phase2td(phaseIndex, entry.id))}
    </tr>)
  })

  return (
    <div className="dark:bg-bg bg-primary">
      <table>
        <tbody>
          {topRowHeader}
          {bodyRows}
        </tbody>
      </table>
    </div>
  )
}