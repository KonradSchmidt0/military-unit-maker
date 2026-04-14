import { useState } from "react";
import { bumpGroup, toggleGroup, useEquipGroupingStore } from "../../../../hooks/useEquipGroupingStore"
import DraggableGroup from "./DraggableGroup";

//
// Logic part
//

export default function EquipGroupingManagerSegment() {
  const {groups, setGroups} = useEquipGroupingStore(e => e)

  const toggleMinimalize = (key: number) => {
    setGroups(toggleGroup(groups, key));
  };

  const removeEqItem = (groupKey: number, eqItem: string) => {
    const updated = groups.map((g, i) =>
      i === groupKey ? { ...g, 
        entries: g.entries.filter( (entry) => entry !== eqItem )
      } : g
    );
    setGroups(updated);
  }

  const addEqItem = (groupKey: number) => {
    const p = "Enter new equipment type. Enter commas (,) to add new type:"
    const inp = prompt(p);
    if (!inp) return;

    const pairs = inp.split(/\s*,\s*/) // Splits if theres comma between

    const updated = groups.map((g, i) =>
      i === groupKey ? { ...g, 
        entries: [...g.entries, ...pairs ]
      } : g
    );
    setGroups(updated);
  }

  const removeGroup = (groupKey: number) => {
    if (!window.confirm(`Are you sure you wanna delete this group called ${groups[groupKey].name}? it can't be undone`)) return;

    const updated = groups.filter((g, i) => i !== groupKey);
    setGroups(updated);
  }

  const addNewGroup = () => {
    const p = "Enter item group name (ex. 'People', 'Small Arms', 'Strykers', 'Tanks'):"
    const inp = prompt(p);
    if (!inp) return;

    const updated = [...groups,
      {name: inp, entries: [], minimalized: false, color: "#aaaaaa"}
    ]
    setGroups(updated);
  }

  const changeColor = (groupKey: number, col: string) => {
    const updated = groups.map((g, i) =>
      i === groupKey ? { ...g, color: col } : g
    );
    setGroups(updated)
  }

  const [giverIndex, setGiverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setGiverIndex(index);
  };

  const handleDragEnter = (receiverIndex: number) => {
    if (giverIndex === null || giverIndex === receiverIndex) return;

    const updated = bumpGroup(groups, giverIndex, receiverIndex);

    // Update the groups in your store
    setGroups(updated);

    // IMPORTANT: update dragIndex to the new location!
    setGiverIndex(receiverIndex);
  };

  const handleDragEnd = () => {
    setGiverIndex(null);
  };

  return (
  <div className="editor-segment-flex">
    <div className="editor-segment-row">
      <h2 className="font-bold text-lg">Equipment Grouping</h2>
      <button className="btn-emoji" onClick={addNewGroup}>➕</button>
    </div>
    <div 
      className="flex flex-col gap-1 items-center"
    >
      {groups.map((group, i) => (
        <div 
          key={group.name}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragEnd={handleDragEnd}
        >
          <DraggableGroup 
            index={i} group={group} 
            toggleMinimalize={() => toggleMinimalize(i)} 
            removeItemInMyGroup={(eqItem: string) => removeEqItem(i, eqItem)} 
            addItemInMyGroup={() => addEqItem(i)} 
            removeMyGroup={() => removeGroup(i)}
            setColor={(col: string) => changeColor(i, col)}
          />
        </div>
      ))}
    </div>
  </div>
  )
}