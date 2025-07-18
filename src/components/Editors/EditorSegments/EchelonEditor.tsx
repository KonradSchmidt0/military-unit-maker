import { useEchelonStore } from "../../../hooks/useEchelonStore";

interface EchelonEditorProps {
  echelonLevel: number,
  onChange: Function,
  additionalStartingOption?: number
}

export function EchelonEditor({echelonLevel, onChange, additionalStartingOption = undefined}: EchelonEditorProps) {
  const echelons = useEchelonStore(s => s.intToSymbol);
  
  const additionalOption = additionalStartingOption ? <option key={additionalStartingOption} value={additionalStartingOption}/> : null

  return ( <select
    className="editor-element"
    value={echelonLevel}
    onChange={(e) => {
      const newLevel = parseInt(e.target.value);
      onChange(newLevel)
    }}
  >
    {additionalOption}
    {Object.entries(echelons).map(([i, symbol]) => (
      <option key={i} value={i}>
        {symbol}
      </option>
    ))}
  </select>
  );
}
