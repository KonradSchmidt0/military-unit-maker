import { ChangeEvent } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { usePaletStore } from "../../hooks/usePaletStore";
import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../hooks/useUnitStore";
import { handleLoadFile, saveToFile } from "../../saveSystem";
import { EchelonEditor } from "./EditorSegments/EchelonEditor";
import { DebugSegment } from "./EditorSegments/DebugSegment";
import ThemeToggle from "./EditorSegments/ThemeToggle";

export default function GlobalEditor() {
  const { echelonFoldingLevel, setEchelonFoldingLevel } = useGlobalStore(s => s)
  const foldingDepth = useGlobalStore(s => s.foldingDepth)
  const setFoldingDepth = useGlobalStore(s => s.setFoldingDepth)
  const displayParentBox = useGlobalStore(s => s.displayParentBox)
  const setDisplayParentBox = useGlobalStore(s => s.setDisplayParentBox)
  const setGlobalMini = useGlobalStore(s => s.setIsGlobalMini)
  const setChangeLogMini = useGlobalStore(s => s.setIsChangeLogMini)
  const setStaffComments = useGlobalStore(s => s.setStaffComments)
  const { stacking, setStacking } = useGlobalStore(s => s)

  const setRootUnitId = useUnitStore(s => s.setTrueRootId)
  const resetSelect = useUnitInteractionStore(s => s.resetSelected)

  const setUnitMap = useUnitStore(s => s.setUnitMap)
  const setUnitPalet = usePaletStore(s => s.setUnitPalet)

  const handleLoading = (e: ChangeEvent<HTMLInputElement>) => { 
    handleLoadFile(e, setUnitMap, setUnitPalet, setRootUnitId, setStaffComments); 
    resetSelect()
  }

  return (
    <div className="editor-box">
      <div className="editor-segment-header">
        <div className="w-56 absolute left-1/2 -translate-x-1/2">
          GLOBAL SETTINGS ⚙️
        </div>
        <button className="btn-emoji !p-0 ml-auto" onClick={() => setGlobalMini(true)}>❌</button>
      </div>

      <div className="editor-segment-flex">
        <div className="editor-segment-row">
          Folding Level:
          <EchelonEditor echelonLevel={echelonFoldingLevel} onChange={setEchelonFoldingLevel} additionalStartingOption={-1} id="folding-echelon-editor"></EchelonEditor>
          <input className="editor-element !w-16" type="number" value={foldingDepth} onChange={(e) => setFoldingDepth(parseInt(e.target.value))}/>
        </div>

        <div className="editor-segment-row">
          <button className="btn-emoji" onClick={() => setStacking(!stacking)}>Stacking{stacking ? "✅" : "❌"}</button>
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

      <div className="editor-segment-flex">
        <div className="editor-segment-row">
          <button className="btn-emoji" onClick={() => setChangeLogMini(false)}>Changelog📣🛠️</button>
          <a href="https://github.com/KonradSchmidt0/military-unit-maker" target="_blank">Project Github</a>
        </div>
        <div>Project by <a href="https://github.com/KonradSchmidt0" target="_blank">Konrad Schmidt</a></div>
        <div>Most icons by one and only <a href="https://www.battleorder.org/" target="_blank">BattleOrder</a></div>
        <ThemeToggle/>
      </div>

      <DebugSegment></DebugSegment>
    </div>
  )
}