import { getPathAsString, useForceFoldingStore } from "../../../hooks/useForceFoldingStore"

interface props {
  path: number[]
}

export function ForceFoldingSegment(p: props) {
  const {add, remove, foldingUnfoldingMap} = useForceFoldingStore(s => s)

  const self = foldingUnfoldingMap[getPathAsString(p.path)]

  return (
    <div className="editor-segment-row">
      {self !== undefined && <button onClick={() => remove(p.path)} className="btn-emoji">Reset Folding</button>}
      {self !== "Fold" && <button onClick={() => add(p.path, "Fold")} className="btn-emoji">Force Fold</button>}
      {self !== "Unfold" && <button onClick={() => add(p.path, "Unfold")} className="btn-emoji">Force Unfold</button>}
    </div>
  )
}