import { ChangeEvent } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { usePaletStore } from "../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { handleLoadFile, saveToFile } from "../../saveSystem";
import { EchelonEditor } from "./EditorSegments/EchelonEditor";

export default function GlobalEditor() {
  const foldingLevel = useGlobalStore(s => s.echelonFoldingLevel)
  const setFoldingLevel = useGlobalStore(s => s.setEchelonFoldingLevel)

  const setRootUnitId = useUnitStore(s => s.setRootId)
  const setSelected = useUnitInteractionStore(s => s.setSelectedId)
  const setSelectedParent = useUnitInteractionStore(s => s.setSelected_parentId)

  const setUnitMap = useUnitStore(s => s.setUnitMap)
  const setUnitPalet = usePaletStore(s => s.setUnitPalet)

  const handleLoading = (e: ChangeEvent<HTMLInputElement>) => { 
    handleLoadFile(e, setUnitMap, setUnitPalet, setRootUnitId); 
    setSelected(undefined); 
    setSelectedParent(undefined)
  }

  return (
    <div className="editor-box">
      <div className="editor-segment !font-bold">
        GLOBAL SETTINGS
      </div>
      <div className="editor-segment-flex">
        <div className="editor-segment-row">
          Folding Level:
          <EchelonEditor echelonLevel={foldingLevel} onChange={setFoldingLevel} additionalStartingOption={-1} id="folding-echelon-editor"></EchelonEditor>
        </div>
        <div className="editor-segment-row">
          <button className="btn-emoji" onClick={() => saveToFile()}>Save ⬆️💾</button>
          <label className="btn-emoji">
            Load ⬇️💾
            <input
              type="file"
              accept="application/json"
              onChange={(e) => { handleLoading(e); e.target.value = ""; }}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  )
}