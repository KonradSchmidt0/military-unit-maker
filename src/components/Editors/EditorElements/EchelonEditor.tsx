import { useEchelonStore } from "../../../hooks/useEchelonStore";
import { simpleHover, useHoverStore } from "../../../hooks/useHoverStore";

interface EchelonEditorProps {
  echelonLevel: number,
  onChange: Function,
  additionalStartingOption?: number
  id: string
  className?: string
  hover?: simpleHover
}

export function EchelonEditor({echelonLevel, onChange, additionalStartingOption = undefined, id, className = undefined, hover = undefined}: EchelonEditorProps) {
  const echelons = useEchelonStore(s => s.intToSymbol);
  const { callSimpleI, callOff } = useHoverStore(s => s)
  
  const additionalOption = additionalStartingOption ? <option key={additionalStartingOption} value={additionalStartingOption}/> : null

  return ( <select
    id={id}
    className={"editor-element " + className}
    value={echelonLevel}
    onChange={(e) => {
      const newLevel = parseInt(e.target.value);
      onChange(newLevel)
    }}
    onMouseEnter={() => { if (hover) callSimpleI(hover) }}
    onMouseLeave={() => callOff()}
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
