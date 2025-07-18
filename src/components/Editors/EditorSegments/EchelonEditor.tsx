import { useEchelonStore } from "../../../hooks/useEchelonStore";

interface EchelonEditorProps {
  echelonLevel: number,
  onChange: Function,
}

export function EchelonEditor({echelonLevel, onChange}: EchelonEditorProps) {
  const echelons = useEchelonStore(s => s.intToSymbol);

  return ( <select
    className="editor-element"
    value={echelonLevel}
    onChange={(e) => {
      const newLevel = parseInt(e.target.value);
      onChange(newLevel)
    }}
  >
    {Object.entries(echelons).map(([i, symbol]) => (
      <option key={i} value={i}>
        {symbol}
      </option>
    ))}
  </select>
  );
}
