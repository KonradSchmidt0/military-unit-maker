import { useEffect, useRef, useState } from "react";
import { useIconsStore } from "../hooks/useIcons";

export default function IconDropdown() {
  const icons = useIconsStore(s => s.icons)
  const onChosen = useIconsStore(s => s.dropDown_onChosen)
  const pos = useIconsStore(s => s.dropdown_pos)
  const setOnChosen = useIconsStore(s => s.callDropDown)
  
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (onChosen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [onChosen]);
   

  if (!onChosen)
    return null
  
  const restart = () => { setSearch(""); setOnChosen(undefined) }
  
  const filtered = icons.filter(entry =>
    entry.tags.toLowerCase().includes(search.toLowerCase()) //TODO split the search along the spaces, and loop for each word
  );

  return (
    <div className="editor-box !absolute !z-10 !bg-bg !border-r-2 rounded-lg" style={{ top: pos.top, left: pos.left }}>
      <div className="flex flex-row px-2 gap-2">
        <input
          type="text"
          className="editor-element !w-full"
          placeholder="Search by tag..."
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
            className="flex items-center gap-2 p-1 hover:bg-bg_alt cursor-pointer h-10"
            onClick={() => {onChosen(entry.filename); restart()}}
          >
            <img src={`${process.env.PUBLIC_URL}/icons/${entry.filename}`} alt={entry.tags} className="w-8 unit object-contain bg-white" />
            <span className="text-sm">{entry.tags}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
