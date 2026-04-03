import { EquipGroup } from "../../../../hooks/useEquipGroupingStore"

//
// HTML part
//

interface props {
  index: number;
  group: EquipGroup;
  toggleMinimalize: () => void;
  removeItemInMyGroup: (eqItem: string) => void;
  addItemInMyGroup: () => void;
  removeMyGroup: () => void
}

export default function DraggableGroup(p: props) {
  return (
  <li className="editor-element flex flex-col" key={p.index} id={"" + p.index}>
    <div className="flex flex-row">
      <b className="text-pretty">{p.group.name}</b>
      <button className="btn-emoji !p-0" onClick={p.removeMyGroup}>❌</button>
      <button className="btn-emoji !p-0" onClick={p.addItemInMyGroup}>➕</button>
      <button className="btn-emoji !p-0" onClick={p.toggleMinimalize}>
        {p.group.minimalized ? "↔️" : "🤏"}
      </button>
    </div>
    {!p.group.minimalized && p.group.entries.map(
      (equipment) => <GroupItem equipment={equipment} group={p.group} remove={() => p.removeItemInMyGroup(equipment)}/>
    )}
  </li>
)
}

function GroupItem(p: {equipment: string, group: EquipGroup, remove: () => void}) {
  return (
    <div className="flex flex-row items-center">
      <div className="text-xs" key={p.group.name + p.equipment}>{p.equipment}</div>
      <button className="btn-emoji !p-0" onClick={p.remove}>❌</button>
    </div>
  )
}