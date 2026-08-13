import { useEquipGroupingStore, toggleGroup, bumpGroup } from "../../../../hooks/useEquipGroupingStore";
import DraggableList from "../../../BehaviouralElements/DraggableLists/DraggableList";
import EquipGroupElement from "./EquipGroupElement";

//
// Logic part
//

export default function EquipGroupEditingList() {
  const {groups, setGroups} = useEquipGroupingStore(e => e)

  const toggleMinimalize = (key: number) => {
    setGroups(toggleGroup(groups, key));
  };

  const onHandleDragEnter = (receiverIndex: number, giverIndex: number) => {
    const updated = bumpGroup(groups, giverIndex, receiverIndex);
    setGroups(updated);
  }

  const removeGroup = (groupKey: number) => {
    if (!window.confirm(`Are you sure you wanna delete this group called ${groups[groupKey].name}? it can't be undone`)) return;

    const updated = groups.filter((g, i) => i !== groupKey);
    setGroups(updated);
  }

  const changeColor = (groupKey: number, col: string) => {
    const updated = groups.map((g, i) =>
      i === groupKey ? { ...g, color: col } : g
    );
    setGroups(updated)
  }

  const renameGroup = (groupKey: number) => {
    const p = "Rename Group:"
    const inp = prompt(p, groups[groupKey].name);
    if (!inp) return;

    const updated = groups.map((g, i) =>
      i === groupKey ? { ...g, 
        name: inp.trim()
      } : g
    );
    setGroups(updated);
  }

  const setEqListFromString = (groupKey: number, text: string) => {
    // We don't filter out the empty spaces on purpose to enable user to add empty spaces in the list, if they so desire 
    const newItems = text
      .split(/\r?\n/)
      .map((line) => line.trim())
    
    setGroups(
      groups.map((g, i) =>
        i === groupKey ? {
          ...g, entries: newItems 
        } : g
      )
    )
  }

  return (
    <DraggableList
      childrenList={
        groups.map((group, i) => 
          (<EquipGroupElement 
            group={group} 
            toggleMinimalize={() => toggleMinimalize(i)} 
            removeMyGroup={() => removeGroup(i)}
            setColor={(col: string) => changeColor(i, col)}
            renameGroup={() => renameGroup(i)}
            setItems={(text: string) => setEqListFromString(i, text)}
          />)
        )
      }
      onHandleDragEnter={onHandleDragEnter}
    />
  )
}