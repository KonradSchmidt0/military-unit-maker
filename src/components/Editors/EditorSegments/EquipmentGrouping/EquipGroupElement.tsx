import { EquipGroup } from "../../../../hooks/useEquipGroupingStore"

//
// HTML part
//

interface props {
  group: EquipGroup;
  toggleMinimalize: () => void;
  removeItemInMyGroup: (eqItem: string) => void;
  addItemInMyGroup: () => void;
  removeMyGroup: () => void
  setColor: (col: string) => void
  renameGroup: () => void
}

export default function EquipGroupElement(p: props) {
  const style = {borderColor: p.group.color}

  return (
  <li className="editor-element flex flex-col min-w-40 gap-1 text-xs !px-1" key={p.index} id={"" + p.index}
    onDoubleClick={p.toggleMinimalize}
  >
    <div className="flex flex-row justify-between items-center w-full gap-1">
      <button className="btn-emoji !p-0" onClick={p.toggleMinimalize}>
        {p.group.minimalized ? "↔️" : "🤏"}
      </button>
      <div className="w-full text-center">
        <b className="text-pretty border-ridge rounded-sm border-[2px] px-1 py-0" style={style}>{p.group.name}</b>
      </div>
      <button className="btn-emoji !p-0" onClick={p.removeMyGroup}>❌</button>
    </div>
    {!p.group.minimalized && <div className="flex flex-row justify-between w-full gap-1">
      <button className="btn-emoji !p-0" onClick={p.addItemInMyGroup}>➕</button>
      <input
        id="ColorPickerInputId"
        type="color"
        className="editor-element !p-0 !h-6"
        value={p.group.color}
        onChange={(e) => p.setColor(e.target.value as string)}
      />
      <button className="btn-emoji !p-0" onClick={p.renameGroup}>📝</button>
    </div> }
    {!p.group.minimalized && <div className="flex flex-col gap-0.5">
      {p.group.entries.map(
        (equipment, i) => <GroupItem equipment={equipment} remove={() => p.removeItemInMyGroup(equipment)} i={i}/>
      )}
    </div>}
  </li>
)
}

function GroupItem(p: {equipment: string, remove: () => void, i: number}) {
  return (
    <div className="flex flex-row">
      <div className="text-xs">- {p.equipment}</div>
      <button className="btn-emoji !p-0" onClick={p.remove}>❌</button>
    </div>
  )
}