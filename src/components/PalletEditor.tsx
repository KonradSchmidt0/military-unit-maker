import { useState } from "react";
import { usePaletStore } from "../hooks/usePaletStore";
import { useUnitStore } from "../hooks/useUnitStore";
import { Unit } from "../logic/logic";
import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import TreeNode from "./TreeNode";

export default function PalletEditorSegment() {
  const rootUnitId = useUnitInteractionStore((s) => s.rootId)
  
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

  const displayedUnits = showHidden
    ? Object.entries(unitMap) // show everything when "showHidden" is true
    : unitPalet.map((id) => [id, unitMap[id]]) as [string, Unit][]; // else show only units in palet

  const addToPalletButton = (unitId: string, inPalet: boolean) => 
    showHidden && !inPalet && (<button onClick={() => addUnitToPalet(unitId)}> 🎨 </button> )
  const removeFromPalletButton = (unitId: string, inPalet: boolean) =>
    inPalet && (<button onClick={() => removeUnitFromPalet(unitId)}> ❌ </button> )
  const buttonToRemoveUnitFromMemory = (unitId: string) =>
    showHidden && (<button className="!text-opacity-50" onClick={() => handleRemovingFromMemory(unitId)}> 🗑️ </button> )

  return (
    <div className="!border-r-0 editor-box">
      <div className="border-slate-400 border-b-2 border-dashed p-2 text-center font-bold">
        PALLET
        <button
          onClick={() => setShowHidden(!showHidden)}
          className="ml-2 hover:border-2 hover:border-red-500"
        >
          {showHidden ? "💾" : "🎨"}
        </button>
      </div>

      <div className=" border-slate-400 border-b-2 border-dashed p-2">
        {displayedUnits.length === 0 && <div className="text-primary/50">No units to display</div>}
        {displayedUnits.map(([unitId, unit]) => {
          const inPalet = isInPalet(unitId);
          return (
            <div key={unitId} className="flex items-center gap-2">
              {<TreeNode unitId={unitId} indent={0}/>}
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

