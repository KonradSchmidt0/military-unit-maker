import { usePhaseStore } from "../../../../hooks/usePhaseStore";

export default function PhaseEditorSegment() {
  const { currentPhase, setCurrentPhase, allPhases, changePhaseAtIndex, removePhaseAtIndex } = usePhaseStore()

  if (!allPhases[currentPhase]) {
    setCurrentPhase(0)
  }
  
  return (<>
    <div className="editor-segmant-row">
      Current Attachments Phase: {allPhases[currentPhase]?.name}
    </div>

    {allPhases.map((entry, i) => (
      <div className="editor-segment-row" key={entry.uuid}>
        <button
          onClick={() => setCurrentPhase(i)}
          className="btn-emoji"
        >
          {currentPhase === i ? "👑" : "✋"}
        </button>
        <input
          type="string"
          value={entry.name}
          onChange={(e) => {
            const newName = e.target.value
            changePhaseAtIndex(i, (prev) => prev ? {...prev, name: newName} : {name: newName, uuid: crypto.randomUUID()});
          }}
          className="editor-element !w-40"
        />
        <button
          onClick={() => removePhaseAtIndex(i)}
          className="btn-emoji"
          disabled={i === 0}
        >❌</button>
      </div>
    ))}
    
    <div className="editor-segment-row" key="Addnew">
      <button
        onClick={() => changePhaseAtIndex(
          allPhases.length, 
          (_) => ({name: (allPhases.length + 1).toString(), uuid: crypto.randomUUID()})
        )}
        className="btn-emoji"
      >➕</button>
    </div>
  </>)
}