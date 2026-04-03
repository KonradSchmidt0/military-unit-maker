import { useGlobalStore } from "../../hooks/useGlobalStore"
import EquipGroupingManagerSegment from "./EditorSegments/EquipmentGrouping/EquipGroupingManagerSegment"
import RenamingItemSegment from "./EditorSegments/RenamingItemSegment"

export default function ItemManagerEditor() {
  const setIsItemManagerMini = useGlobalStore(s => s.setIsItemManagerMini)

  return (
    <div className="editor-box">
      <div className="editor-segment-header">
        <div className="w-56 absolute left-1/2 -translate-x-1/2">
          ITEM EDITOR 🗡️
        </div>
        <button className="btn-emoji !p-0 ml-auto" onClick={() => setIsItemManagerMini(true)}>❌</button>
      </div>

      <div className="overflow-y-auto max-h-fit">
        <RenamingItemSegment/>
        <EquipGroupingManagerSegment/>
      </div>
    </div>
  )
}