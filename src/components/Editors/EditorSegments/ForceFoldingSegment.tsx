import { getPathAsString, useForceFoldingStore } from "../../../hooks/useForceFoldingStore"
import { useHoverStore } from "../../../hooks/useHoverStore"

interface props {
  path: number[]
}

export function ForceFoldingSegment(p: props) {
  const {add, remove, foldingUnfoldingMap} = useForceFoldingStore(s => s)
  const { callSimple, callOff } = useHoverStore(s => s)

  const self = foldingUnfoldingMap[getPathAsString(p.path)]

  const foldingRulesPlaceExpl = "Check the top of ⚙️Global Editor for those settings"
  const resetFoldingExpl = "You can reset all the force folding/unfolding on the bottom of the ⚙️Global Editor"

  return (
    <div className="editor-segment-row">

      {self !== undefined && <button 
        onClick={() => remove(p.path)} 
        className="btn-emoji"
        onMouseEnter={() => callSimple("Make this unit follow the normal folding options", "Folding options allow to fold - HIDE children, not delete - of a unit, based on echelon, or how 'deep'/far it is from acting root unit (unit on the tippy top). " + foldingRulesPlaceExpl)}
        onMouseLeave={() => callOff()}
      >Reset Folding</button>}

      {self !== "Fold" && <button 
        onClick={() => add(p.path, "Fold")} 
        className="btn-emoji"
        onMouseEnter={() => callSimple("Force folds this unit - HIDES its children", "Meaning even if folding rules (" + foldingRulesPlaceExpl + ") make this unit unfold, it will be folded anyway. Great for when you have especially boring unit that you don't want someone to focus on. " + resetFoldingExpl)}
        onMouseLeave={() => callOff()}
      >Force Fold</button>}

      {self !== "Unfold" && <button 
        onClick={() => add(p.path, "Unfold")} 
        className="btn-emoji"
        onMouseEnter={() => callSimple("Force unfolds this unit", "Meaning even if folding rules (" + foldingRulesPlaceExpl + ") make this unit fold, it will be unfolded anyway. Great for when you want manual control over which unit are unfolded. " + resetFoldingExpl)}
        onMouseLeave={() => callOff()}
      >Force Unfold</button>}

    </div>
  )
}