import { useGlobalStore } from "../../hooks/useGlobalStore";
import { EchelonEditor } from "./EditorSegments/EchelonEditor";

export default function GlobalEditor() {
  const foldingLevel = useGlobalStore(s => s.echelonFoldingLevel)
  const setFoldingLevel = useGlobalStore(s => s.setEchelonFoldingLevel)

  return (
    <div className="editor-box">
      <div className="border-slate-400 border-b-2 border-dashed p-2 text-center font-bold">
        GLOBAL SETTINGS
      </div>
      <div className="border-slate-400 border-b-2 border-dashed p-2 flex flex-col gap-2 items-center">
        <div className="flex flex-row gap-2 items-center">
          Folding Level:
          <EchelonEditor echelonLevel={foldingLevel} onChange={setFoldingLevel} additionalStartingOption={-1}></EchelonEditor>
        </div>
      </div>
    </div>
  )
}