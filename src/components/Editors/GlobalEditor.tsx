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
  const foldingDepth = useGlobalStore(s => s.foldingDepth)
  const setFoldingDepth = useGlobalStore(s => s.setFoldingDepth)
  const displayParentBox = useGlobalStore(s => s.displayParentBox)
  const setDisplayParentBox = useGlobalStore(s => s.setDisplayParentBox)

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
          <input className="editor-element !w-16" type="number" value={foldingDepth} onChange={(e) => setFoldingDepth(parseInt(e.target.value))}/>
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

          {!displayParentBox ? <button className="btn-emoji" onClick={() => setDisplayParentBox(true)}>➕🪟</button> : null}
          {displayParentBox ? <button className="btn-emoji" onClick={() => setDisplayParentBox(false)}>❌🪟</button> : null}
        </div>

      </div>
    </div>
  )
}