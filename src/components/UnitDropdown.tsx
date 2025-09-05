import { useEffect, useRef, useState } from "react";
import { UnitDisplay } from "./UnitDisplaying/UnitDisplay";
import { defaultUnitColor } from "../logic/logic";
import { useUnitDropdownStore } from "../hooks/useUnitDropdownStore";

export default function UnitDropdown() {
  const options = Object.entries(useUnitDropdownStore(s => s.options) ?? {}).map(entry => ({unit: entry[1], id: entry[0]}))
  const {onChosen, pos, callDropDown} = useUnitDropdownStore(s => s)
  
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (onChosen && inputRef.current && !('ontouchstart' in window)) {
      inputRef.current.focus();
    }
  }, [onChosen]);
   

  if (!onChosen)
    return null
  
  const restart = () => { setSearch(""); callDropDown(undefined) }
  
  const filtered = options.filter(entry =>
    entry.unit.name.toLowerCase().includes(search.toLowerCase()) // TODO split the search along the spaces, and loop for each word
  );

  return (
    <div className="editor-box !absolute !z-10  dark:!bg-bg !bg-white !border-r-2 rounded-lg transition-colors" style={{ top: pos.top, left: pos.left }}>
      <div className="flex flex-row px-2 gap-2">
        <input
          type="text"
          className="editor-element !w-full"
          placeholder="Search by unit name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          ref={inputRef}
        />
        <button className="btn-emoji" onClick={restart}>❌</button>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {filtered.map((entry, index) => (
          <div 
            key={index} 
            className="flex items-center gap-4 p-1 dark:hover:bg-bg_alt hover:bg-primary_alt cursor-pointer h-10"
            onClick={() => {onChosen(entry.id); restart()}}
          >
            <div className="w-20 flex justify-center">
              <UnitDisplay 
                unitId={entry.id} 
                color={entry.unit.smartColor !== "inheret" ? entry.unit.smartColor : defaultUnitColor}
                className="!w-8 !mt-1"
              />
            </div>
            <span className="text-sm max-w-44">{entry.unit.name}</span>
          </div>
        ))}

        {filtered.length === 0 &&
          <div className="text-white/90 text-xs m-1">
            <p className="font-semibold m-1 text-center">No safe units in palet!</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Some Units are not shown since they could cause infinite loop.</li>
              <li>If you think there is some unit that should be here, make sure you press the "➕🎨" on them.</li>
            </ul>
          </div>
        }
      </div>
    </div>
  );
}
