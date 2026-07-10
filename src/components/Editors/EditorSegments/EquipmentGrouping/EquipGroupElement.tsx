import { useState } from "react";
import { EquipGroup } from "../../../../hooks/useEquipGroupingStore"

//
// HTML part
//

interface props {
  group: EquipGroup;
  toggleMinimalize: () => void;
  removeMyGroup: () => void
  setColor: (col: string) => void
  renameGroup: () => void
  setItems: (text: string) => void
}

export default function EquipGroupElement(p: props) {
  const style = {borderColor: p.group.color}

  return (
  <li className="editor-element flex flex-col min-w-40 gap-1 text-xs !px-1" key={p.group.name}
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
      <input
        id="ColorPickerInputId"
        type="color"
        className="editor-element !p-0 !h-6"
        value={p.group.color}
        onChange={(e) => p.setColor(e.target.value as string)}
      />
      <button className="btn-emoji !p-0" onClick={p.renameGroup}>📝</button>
    </div> }
    {!p.group.minimalized && EqEntriesList(p.group.entries, p.setItems)}
  </li>
)
}

function EqEntriesList(entries: string[], setItems: (text: string) => void) {
  const [cache, setCache] = useState(entries.join("\n"))

  return (<textarea
    className="editor-element !p-1 resize-none overflow-hidden"
    value={cache}
    rows={Math.max(entries.length, 1)}
    onChange={(e) => {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
      setCache(e.target.value)
    }}
    onBlur={() => setItems(cache)}
  />)
}