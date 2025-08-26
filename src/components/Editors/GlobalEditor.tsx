import { useGlobalStore } from "../../hooks/useGlobalStore";
import { EchelonEditor } from "./EditorSegments/EchelonEditor";
import { DebugSegment } from "./EditorSegments/DebugSegment";
import ThemeToggle from "./EditorSegments/ThemeToggle";
import { EchelonSettingChanger } from "./EditorSegments/EchelonSettingChanger";
import { ExtrnlLink } from "../ExtrnlLink";
import { UnitTextsDisplaySwitches } from "./EditorSegments/UnitTextsDisplaySwitches";
import { ResetAllForceFoldingButton } from "./EditorSegments/ResetAllForceFoldingButton";
import { ResetRemporaryRootButton } from "./EditorSegments/ResetRemporaryRootButton";
import { QuickSaveButtons } from "./EditorSegments/QuickSaveButtons";
import { SaveButtons } from "./EditorSegments/SaveButtons";
import { SafeNumberInput } from "./EditorSegments/SafeNumberInput";

export default function GlobalEditor() {
  const { echelonFoldingLevel, setEchelonFoldingLevel } = useGlobalStore(s => s)
  const foldingDepth = useGlobalStore(s => s.foldingDepth)
  const setFoldingDepth = useGlobalStore(s => s.setFoldingDepth)
  const displayParentBox = useGlobalStore(s => s.displayParentBox)
  const setDisplayParentBox = useGlobalStore(s => s.setDisplayParentBox)
  const setGlobalMini = useGlobalStore(s => s.setIsGlobalMini)
  const setChangeLogMini = useGlobalStore(s => s.setIsChangeLogMini)
  const { stacking, setStacking } = useGlobalStore(s => s)

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
          <EchelonEditor echelonLevel={echelonFoldingLevel} onChange={setEchelonFoldingLevel} additionalStartingOption={-1} id="folding-echelon-editor"/>
          <SafeNumberInput count={foldingDepth} onCountChange={setFoldingDepth}/>
        </div>

        <div className="editor-segment-row">
          <button className="btn-emoji" onClick={() => setStacking(!stacking)}>Stacking{stacking ? "✅" : "❌"}</button>
          <EchelonSettingChanger/>
        </div>

        <div className="editor-segment-row">
          <ResetRemporaryRootButton/>
        </div>

        <div className="editor-segment-row">
          <UnitTextsDisplaySwitches/>
        </div>
      </div>

      <div className="editor-segment-flex">
        <div className="editor-segment-row">
          <QuickSaveButtons/>
        </div>

        <div className="editor-segment-row text">
          <SaveButtons/>

          {!displayParentBox ? <button className="btn-emoji" onClick={() => setDisplayParentBox(true)}>➕🖼️</button> : null}
          {displayParentBox ? <button className="btn-emoji" onClick={() => setDisplayParentBox(false)}>❌🖼️</button> : null}
        </div>
      </div>

      <div className="editor-segment-flex">
        <div className="editor-segment-row">
          <button className="btn-emoji" onClick={() => setChangeLogMini(false)}>Changelog📣🛠️</button>
          <ExtrnlLink href="https://github.com/KonradSchmidt0/military-unit-maker">Project Github</ExtrnlLink>
        </div>
        <div>Project by <ExtrnlLink href="https://github.com/KonradSchmidt0">Konrad Schmidt</ExtrnlLink></div>
        <div>Most icons by one and only <ExtrnlLink href="https://www.battleorder.org/">BattleOrder</ExtrnlLink></div>
        <div className="editor-segment-row">
          <ResetAllForceFoldingButton/>
          <ThemeToggle/>
        </div>
      </div>

      <DebugSegment></DebugSegment>
    </div>
  )
}