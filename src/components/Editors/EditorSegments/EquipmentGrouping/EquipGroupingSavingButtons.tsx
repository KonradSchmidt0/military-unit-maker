import { ChangeEvent } from "react"
import { loadUserSave, saveToFile } from "../../../../logic/Items/eqGroupsSaving"
import { useEquipGroupingStore } from "../../../../hooks/useEquipGroupingStore"

export default function EquipGroupingSavingButtons() {
  const {setGroups} = useEquipGroupingStore(e => e)

  const handleSaving = () => {
    const name = prompt("Name of the file:") ?? undefined
    if (name === undefined) {
      return
    }
    saveToFile(name)
  }

  const handleLoading = (e: ChangeEvent<HTMLInputElement>) => {
    loadUserSave(e)
  }

  const handleReset = () => {
    const consent = window.confirm("Are you sure you want to reset Equipment Groups? Have you considered saving them before?")
    if (!consent) {
      return
    }
    setGroups([])
  }

  return (<>
    <button className="btn-emoji" onClick={handleSaving}>💾</button>
    <label className="btn-emoji hover:cursor-pointer">
      ⬇️💾
      <input
        type="file"
        accept="application/json"
        onChange={(e) => { handleLoading(e); e.target.value = ""; }}
        className="hidden"
      />
    </label>
    <button className="btn-emoji" onClick={handleReset}>🆕</button>
  </>)
}