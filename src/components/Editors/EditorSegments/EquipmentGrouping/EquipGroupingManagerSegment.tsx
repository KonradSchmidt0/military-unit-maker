import { useEquipGroupingStore } from "../../../../hooks/useEquipGroupingStore"
import EquipGroupingSavingButtons from "./EquipGroupingSavingButtons";
import EquipGroupEditingList from "./EquipGroupEditingList";

export default function EquipGroupingManagerSegment() {
  const {groups, setGroups} = useEquipGroupingStore(e => e)

  const addNewGroup = () => {
    const p = "Enter item group name (ex. 'People', 'Small Arms', 'Strykers', 'Tanks'):"
    const inp = prompt(p);
    if (!inp) return;

    const updated = [...groups,
      {name: inp, entries: [], minimalized: false, color: "#888888"}
    ]
    setGroups(updated);
  }

  return (
  <div className="editor-segment-flex">
    <div className="editor-segment-row">
      <h2 className="font-bold text-lg">Equipment Grouping</h2>
      <button className="btn-emoji" onClick={addNewGroup}>➕</button>
    </div>
    <div className="editor-segment-row">
      <EquipGroupingSavingButtons/>
    </div>
    <EquipGroupEditingList/>
  </div>
  )
}