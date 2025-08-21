import { useForceFoldingStore } from "../../../hooks/useForceFoldingStore";

interface props {

}

export function ResetAllForceFoldingButton(p: props) {
  const { foldingUnfoldingMap, resetMap } = useForceFoldingStore(s => s)

  const disable = Object.keys(foldingUnfoldingMap).length === 0

  return <button onClick={resetMap} disabled={disable} className="btn-emoji">Reset All Force Folding</button>
}