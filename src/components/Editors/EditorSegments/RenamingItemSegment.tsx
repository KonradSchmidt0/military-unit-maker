import { useState } from "react";
import { LabledInput } from "../EditorElements/LabledInput";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { renameItemInUnitMap } from "../../../logic/itemRenaming";

export default function RenamingItemSegment() {
  const [currentItemName, setCurrentItemName] = useState("");
  const [desiredItemName, setDesiredItemName] = useState("");

  const [resultsDisplay, setResultsDisplay] = useState("")

  const { unitMap, setUnitMap } = useUnitStore(e => e)

  const handleRenameAction = () => {
    const results = renameItemInUnitMap(unitMap, currentItemName, desiredItemName)
    setUnitMap(results.unitMap)
    setResultsDisplay("Changes implemented: " + results.changesCount + (results.changesCount == 0 ? " :(" : ""))
  }
  const swapCurrentAndDesired = () => {
    const a = currentItemName
    setCurrentItemName(desiredItemName)
    setDesiredItemName(a)
  }

  return (
    <div className="editor-segment-flex">
      <div className="editor-segment-row">
        <h2 className="font-bold text-lg">Equipment Renaming</h2>

      </div>
      <div className="editor-segment-row">
        <LabledInput 
          label="CIN" 
          value={currentItemName} 
          onChange={(e) => {setCurrentItemName(e.target.value)}}
          hover={{header: "Current Item Name", desc: "How currently equipment is named"}}
        />
      </div>
      <div className="editor-segment-row">
        <button className="btn-emoji" onClick={swapCurrentAndDesired}>🔄</button>
      </div>
      <div className="editor-segment-row">
        <LabledInput 
          label="DIN" 
          value={desiredItemName} 
          onChange={(e) => {setDesiredItemName(e.target.value)}}
          hover={{header: "Desired Item Name", desc: "What this equipment should be renamed to"}}
        />
      </div>
      <div className="editor-segment-row">
        <button className="btn-emoji" onClick={handleRenameAction}>✨Rename~!✨</button>
      </div>
      {resultsDisplay && 
        <div className="editor-segment-row text-sm text-opacity-25">
          {resultsDisplay}
        </div>
      }
    </div>
  )
}