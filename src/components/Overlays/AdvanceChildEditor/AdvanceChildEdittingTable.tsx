import { useColorPalletStore } from "../../../hooks/useColorPalletStore"
import { usePhaseStore } from "../../../hooks/usePhaseStore"
import { SelectionSignature } from "../../../hooks/useUnitInteractionsStore"
import { useUnitStore } from "../../../hooks/useUnitStore"
import { ChildEntry, OrgUnit } from "../../../logic/Units/logic"
import { GetChildsColor } from "../../../logic/Units/unitColorManaging"
import { UnitClickableIdSwap } from "../../UnitDisplaying/UnitClickable/UnitClickableIdSwap"
import { UnitDisplay } from "../../UnitDisplaying/UnitDisplay"
import { UnitHoverable } from "../../UnitDisplaying/UnitHoverable"

interface props {
  parentSignature: SelectionSignature
  parentId: string
  parent: OrgUnit
}

export default function AdvanceChildEdittingTable(p:props) {
  const { allPhases, currentPhase, setCurrentPhase } = usePhaseStore()
  const { updateUnit } = useUnitStore()
  const { unitMap, trueRootId } = useUnitStore()
  const { colorMap } = useColorPalletStore()

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

  function phase2Td(phaseIndex: number, childId: string) {
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

  function child2Row(entry: ChildEntry, i: number, color: `#${string}`, childSignature: SelectionSignature) {
    return (<>
      <td className="ace-tb">
        <div className="py-3 px-8">
          <UnitClickableIdSwap 
            parentSignature={p.parentSignature} childSignature={entry.id} 
            whoSelectOnSelectClick={childSignature}
          >
            <UnitHoverable signature={childSignature}>
              <UnitDisplay unitId={entry.id} color={color}/>
            </UnitHoverable>
          </UnitClickableIdSwap>
        </div>
      </td>
      {allPhases.map((_, phaseIndex) => phase2Td(phaseIndex, entry.id))}
      <td className="ace-tb">
        <div className="py-3 px-2">
          <button className="btn-emoji">❌</button>
        </div>
      </td>
    </>)
  }

  const topRowHeader = (
    <tr>
      <td className="ace-tb"></td>
      {allPhases.map((phase, i) => 
        <td className="ace-tb px-1 py-1 text-center">
          <button 
            className="btn-emoji !px-2 !py-1"
            onClick={() => setCurrentPhase(i)}
          >
            {currentPhase === i ? "👑" : ""}{phase.name}
          </button>
        </td>
      )}
      <td className="ace-tb"></td>
    </tr>
  )

  const bodyRows = p.parent.children.map((entry, i) => {
    const color = GetChildsColor(p.parentSignature, entry.id, trueRootId, unitMap, colorMap, currentPhase)
    const childSignature = Array.isArray(p.parentSignature) ? [...p.parentSignature, i] : entry.id

    return (
    <tr key={entry.id}>
      {child2Row(entry, i, color, childSignature)}
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