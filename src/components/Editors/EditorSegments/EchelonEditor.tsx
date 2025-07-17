import { useEchelonStore } from "../../../hooks/useEchelonStore";
import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore, useUnitQuick } from "../../../hooks/useUnitStore";

export function EchelonEditor() {
  const unitId = useUnitInteractionStore(s => s.selectedId) as string;
  const unit = useUnitQuick(unitId);
  const echelons = useEchelonStore(s => s.intToSymbol);
  const setUnit = useUnitStore(s => s.updateUnit);

  if (!unit) return null;

  return ( <select
    className="editor-element"
    value={unit.echelonLevel}
    onChange={(e) => {
      const newLevel = parseInt(e.target.value);
      setUnit(unitId, { ...unit, echelonLevel: newLevel });
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
