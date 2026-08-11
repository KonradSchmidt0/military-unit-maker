import { useState, useRef, useEffect } from "react";

interface props<T> {
  list: T[]
  OnExit: () => void
  GetEntrysTags: (entry: T) => string
  Entry2OptionNode: (entry: T, index: number) => React.ReactNode
  AdditionalOption?: React.ReactNode
  ConditionalOption?: (filteredList: T[], userInput: string) => React.ReactNode | undefined
  placeholder: string
}

export function DropdownTagFilteredList<T>(p: props<T>) {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current && !('ontouchstart' in window)) {
      inputRef.current.focus();
    }
  }, []);

  const filtered = p.list.filter(entry => TagSearchFilter(search, p.GetEntrysTags(entry)))

  return (<>
    <div className="flex flex-row px-2 gap-2">
      <input
        type="text"
        className="editor-element !w-full"
        placeholder={p.placeholder}
        value={search}
        onChange={e => setSearch(e.target.value)}
        ref={inputRef}
      />
      <button className="btn-emoji" onClick={p.OnExit}>❌</button>
    </div>

    <div className="max-h-60 overflow-y-auto">
      {filtered.map((entry, index) => (p.Entry2OptionNode(entry, index)))}
      {p.AdditionalOption}
      {p.ConditionalOption ? p.ConditionalOption(filtered, search) : null}
    </div>
  </>)
}

export function TagSearchFilter(userSearch: string, tags: string) {
  const search = userSearch.trim()

  if (search === "")
    return true

  return search
    .toLowerCase()
    .split(" ")
    .filter(word => word.length > 0) // We filter out any double spaces user may accidentaly place 
    .some(word => tags.toLowerCase().includes(word))
}