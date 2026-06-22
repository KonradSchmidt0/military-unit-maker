import { ChangeEvent } from "react";
import { loadUserSaveFile, saveToFile } from "../../../logic/saveSystem";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";

export function SaveButtons() {
  const resetSelect = useUnitInteractionStore(s => s.resetSelected)

  const handleLoading = (e: ChangeEvent<HTMLInputElement>) => { 
    loadUserSaveFile(e); 
    resetSelect()
  }

  const handleSaving = () => {
    const name = prompt("Name of the file:") ?? undefined
    if (name === undefined)
      return
    saveToFile(name)
  } 

  return (<>
    <button className="btn-emoji" onClick={handleSaving}>Save💾</button>
    <label className="btn-emoji">
      Load⬇️💾
      <input
        type="file"
        accept="application/json"
        onChange={(e) => { handleLoading(e); e.target.value = ""; }}
        className="hidden"
      />
    </label>
  </>)
}