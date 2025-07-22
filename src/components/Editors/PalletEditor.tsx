import { useState } from "react";
import { usePaletStore } from "../../hooks/usePaletStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import TreeNode from "../TreeNode";
import { Unit } from "../../logic/logic";

export default function PalletEditorSegment() {
  const rootUnitId = useUnitStore((s) => s.rootId)
  
  const [showHidden, setShowHidden] = useState<boolean>(false);

  const unitPalet = usePaletStore((state) => state.unitPalet);
  const unitMap = useUnitStore((state) => state.unitMap);
  const setUnitMap = useUnitStore((state) => state.setUnitMap);

  const addUnitToPalet = usePaletStore((state) => state.addUnitToPalet);
  const removeUnitFromPalet = usePaletStore((state) => state.removeUnitFromPalet);
  const handleRemovingFromMemory = (unitId: string) => {
    if (rootUnitId === unitId) { window.alert("Can't delete root unit"); return; }
    if (!window.confirm(`Are you sure you want to remove ${unitMap[unitId].name} from memory? It can't be undone`)) { return; }
    
    // Create a new copy of unitMap without the unitId
    const { [unitId]: _, ...newUnitMap } = unitMap;

    if (unitPalet.includes(unitId))
      removeUnitFromPalet(unitId)

    setUnitMap(newUnitMap);
  };

  const isInPalet = (unitId: string) => unitPalet.includes(unitId);

  const displayedList = showHidden
    ? Object.entries(unitMap) // show everything when "showHidden" is true
    : unitPalet.map((id) => [id, unitMap[id]]) as [string, Unit | undefined][]; // else show only units in palet
    

  const addToPalletButton = (unitId: string, inPalet: boolean) => 
    showHidden && !inPalet && (<button className="btn-emoji" onClick={() => addUnitToPalet(unitId)}> ➕🎨 </button> )
  const removeFromPalletButton = (unitId: string, inPalet: boolean) =>
    inPalet && (<button className="btn-emoji" onClick={() => removeUnitFromPalet(unitId)}> 🎨🚮 </button> )
  const buttonToRemoveUnitFromMemory = (unitId: string) =>
    showHidden && (<button className="btn-emoji" onClick={() => handleRemovingFromMemory(unitId)}> ➡️🗑️ </button> )

  return (
    <div className="!border-r-0 editor-box">
      <div className="editor-segment !font-bold">
        PALLET
        <button
          onClick={() => setShowHidden(!showHidden)}
          className="btn-emoji !ml-2 !py-0"
        >
          {showHidden ? "🪖💾" : "🪖🎨"}
        </button>
      </div>

      <div className="editor-segment flex flex-col gap-4 mt-2.5">
        {displayedList.length === 0 && <div className="text-primary/50">No units to display</div>}
        {displayedList.map(([unitId, unit]) => {
          const inPalet = isInPalet(unitId);
          return (
            <div key={unitId} className="editor-segment-row">
              {<TreeNode unitId={unitId}/>}
              {addToPalletButton(unitId, inPalet)}
              {removeFromPalletButton(unitId, inPalet)}
              {buttonToRemoveUnitFromMemory(unitId)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

