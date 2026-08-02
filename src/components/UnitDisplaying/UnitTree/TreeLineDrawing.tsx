import { RefObject } from "react";
import { PathRefPair, useTreeLineStore } from "../../../hooks/useTreeLineStore";
import { useTransformContext } from "react-zoom-pan-pinch";

/// (!):
// If theres scrolling, scaling and or translating: this component should be place in the same root as unit tree 

/// OVERVIEW:
// While rendering the unit tree, child units assign TreeLineRefPoint to TreeLineStore based on rules
// This component procceses those points (getLinePairs(...)) and draws svg lines between them
// We draw only 1 line per parent
// We don't acctually draw lines from child to parent, insted we draw from the first child that given a point, 
//   to the last child's point. The justifying makes it so that line always crosses parent

/// [P] = parent, [c] = child, + = points created by children (TreeLineRefPoint), 
/// --- = line this component draws, | = part of the tree that is drawn using pure HTML/CSS
//     [P]
//      |
//    +---+
//    |   |
//   [c] [c]

export default function TreeLineDrawing() {
  // Problem: React won't update dependancies if changed value is a ref / ref list
  // Solution: Add a variable ("version" in our case) that will be always updated whenever ref is assigned, unassigned
  const {refs, rootRef, version: _} = useTreeLineStore(s => s)
  const { transformState: {scale} } = useTransformContext();
  
  const pathRefPairs = Array.from(refs.values())
  
  let lines = getLinePairs(pathRefPairs)
  
  // Problem: Root of the unit tree constantly translates and scales -> absolute position of ref's constantly changes, even when this 
  //   component doesn't update
  // Solution: Take the ref's position, subtract root's pos. Since this component - and therefore lines - are placed 
  //   in the root, root will apply all of the transformations during it's update
  const rootRect = rootRef.current?.getBoundingClientRect()

  if (!rootRect)
    return <>useTreeLineStore.rootRef is undefined!</>

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {lines.map((line, i) => {
        const aRect = line.a.current?.getBoundingClientRect();
        const bRect = line.b.current?.getBoundingClientRect();
        if (!aRect || !bRect) return null;

        // Problem: Using the root solution doesn't fully solve the problem
        // Solution: We divide by scale at the moment that update takes place, and this fixes the issue
        const x1 = (aRect.left + aRect.width / 2 - rootRect.left) / scale
        const y1 = (aRect.top + aRect.height / 2 - rootRect.top) / scale
        const x2 = (bRect.left + bRect.width / 2 - rootRect.left) / scale
        const y2 = (bRect.top + bRect.height / 2 - rootRect.top) / scale

        // if (i === 2) {
        //   const qqq = [x1, y1, x2, y2]
        //   console.log(qqq.map(n => Math.round(n * 10)/10).join("_"))
        // }

        return <line className="ln-tree" key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.5" />;
      })}
    </svg>
  );
}

// OVERVIEW:
// We march from the left looking for a parent we haven't met yet ->
// Then we march from the right looking for the last(!) point submited by the unit with the same parent
function getLinePairs(pathRefPairs: PathRefPair[]) {
  let lines: {a: RefObject<HTMLDivElement>, b:RefObject<HTMLDivElement>}[] = []

  let seen: string[] = []

  for (let leftI = 0; leftI < pathRefPairs.length; leftI++) {
    const a = pathRefPairs[leftI];
    if (a.ref.current === null) continue

    const a_parentPath = getParentsPath(a.path).toString()
    if (seen.includes(a_parentPath)) continue
    
    seen = [...seen, a_parentPath]

    loopFromRight(
      pathRefPairs, 
      leftI, 
      a_parentPath, 
      (b) => lines.push({a: a.ref as RefObject<HTMLDivElement>, b: b.ref as RefObject<HTMLDivElement>})
    )
  }

  return lines
}

function loopFromRight(pathRefPairs: PathRefPair[], leftI: number, a_parentPath: String, onSuccess: (b: PathRefPair) => void) {
  for (let rightI = pathRefPairs.length - 1; rightI >= 0; rightI--) {
    if (rightI === leftI) return

    const b = pathRefPairs[rightI]
    if (b.ref.current === null) continue

    const b_parentPath = getParentsPath(b.path).toString()
    if (a_parentPath !== b_parentPath) continue

    onSuccess(b)
    return
  }
}

function getParentsPath(path:number[]) {
  if (path.length === 0) return []

  return path.slice(0, -1)
}