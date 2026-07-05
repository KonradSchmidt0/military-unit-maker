import { useEquipGroupingStore, toggleGroup, bumpGroup } from "../../../../hooks/useEquipGroupingStore";
import DraggableList from "../../EditorElements/DraggableLists/DraggableList";
import EquipGroupElement from "./EquipGroupElement";

//
// Logic part
//

export default function EquipGroupEditingList() {
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

  const changeColor = (groupKey: number, col: string) => {
    const updated = groups.map((g, i) =>
      i === groupKey ? { ...g, color: col } : g
    );
    setGroups(updated)
  }

  const onHandleDragEnter = (receiverIndex: number, giverIndex: number) => {
    const updated = bumpGroup(groups, giverIndex, receiverIndex);
    setGroups(updated);
  }

  return (
    <DraggableList
      childrenList={
        groups.map((group, i) => 
          (<EquipGroupElement 
            group={group} 
            toggleMinimalize={() => toggleMinimalize(i)} 
            removeItemInMyGroup={(eqItem: string) => removeEqItem(i, eqItem)} 
            addItemInMyGroup={() => addEqItem(i)} 
            removeMyGroup={() => removeGroup(i)}
            setColor={(col: string) => changeColor(i, col)}
          />)
        )
      }
      onHandleDragEnter={onHandleDragEnter}
    />
  )
}