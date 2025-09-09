import { useEchelonStore } from "../../../hooks/useEchelonStore";

interface EchelonEditorProps {
  echelonLevel: number,
  onChange: Function,
  additionalStartingOption?: number
  id: string
  className?: string
}

export function EchelonEditor({echelonLevel, onChange, additionalStartingOption = undefined, id, className = undefined}: EchelonEditorProps) {
  const echelons = useEchelonStore(s => s.intToSymbol);
  
  const additionalOption = additionalStartingOption ? <option key={additionalStartingOption} value={additionalStartingOption}/> : null

  return ( <select
    id={id}
    className={"editor-element " + className}
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
