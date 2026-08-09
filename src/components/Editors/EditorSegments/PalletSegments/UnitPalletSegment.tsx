import { useState } from "react";
import { usePaletStore } from "../../../../hooks/usePaletStore";
import { useUnitStore } from "../../../../hooks/useUnitStore";
import TreeNode from "../../../UnitDisplaying/TreeNode";

export default function UnitPalletSegment() {
  const [ mini, SetMini ] = useState(true)
  const [ showHidden, setShowHidden ] = useState(false);

  const { unitMap } = useUnitStore();
  const { unitPalet, addUnitToPalet, removeUnitFromPalet  } = usePaletStore();
  
  const isInPalet = (unitId: string) => unitPalet.includes(unitId);

  const unitList = showHidden
    ? Object.entries(unitMap).filter(([id, unit]) => !isInPalet(id))
    : Object.entries(unitMap).filter(([id, unit]) => isInPalet(id))
      

  const addToPalletButton = (unitId: string, inPalet: boolean) => 
    !inPalet && (<button className="btn-emoji" onClick={() => addUnitToPalet(unitId)}> ➕🎨 </button> )
  const removeFromPalletButton = (unitId: string, inPalet: boolean) =>
    inPalet && (<button className="btn-emoji" onClick={() => removeUnitFromPalet(unitId)}> 🎨🚮 </button> )

  const top = (<>
    <div className="w-full text-lg font-bold">
      Unit Pallet
    </div>
    <button
      onClick={() => SetMini(!mini)}
      className="btn-emoji !p-0 absolute right-0"
    >
      {mini ? "⬇️" : "❌"}
    </button>
    {!mini && <button
      onClick={() => setShowHidden(!showHidden)}
      className="btn-emoji !p-0 absolute left-0"
    >
      {showHidden ? "💾" : "🎨"}
    </button>}
  </>)

  const list = (<>
    {unitList.length === 0 && <div className="text-primary/50">
      {showHidden ?
        "No units that are not in pallet. Press 💾 to view them" : 
        "No units in pallet. Press 🎨 to view ones that are not in the pallet"
      }
    </div>}
    {unitList.map(([unitId, unit]) => {
      const inPalet = isInPalet(unitId);
      return (
        <div key={unitId} className="editor-segment-row !gap-6">
          {<TreeNode signature={unitId}/>}
          {addToPalletButton(unitId, inPalet)}
          {removeFromPalletButton(unitId, inPalet)}
        </div>
      );
    })}
  </>)

  return (
    <div className="editor-segment-flex">
      <div className="relative editor-segment-row !w-full">{top}</div>

      {!mini && <div className="flex flex-col gap-4 pt-2">{list}</div>}
    </div>
  )
}