import TreeNode from "./TreeNode";
import { UnitMap, useUnitStore } from "../../hooks/useUnitStore";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { GetChildIdFromPath, GetFlatIds } from "../../logic/childManaging";
import { OrgUnit } from "../../logic/logic";
import { DesignationPack, getMergedDPFromChildren } from "../../logic/designationPack";
import { FoldingMap, getPathAsString, useForceFoldingStore } from "../../hooks/useForceFoldingStore";

interface TreeViewProps {
  path: number[];
  leftDisplayDepth: number;
  stack?: number;
  dp?: DesignationPack
}

function TreeView(p : TreeViewProps) {
  const {unitMap, trueRootId} = useUnitStore(s => s)
  const {echelonFoldingLevel, stacking, staffNames, staffComments} = useGlobalStore(s => s)
  const parentBoxOn = useGlobalStore(s => s.displayParentBox)
  const foldingUnfoldingMap = useForceFoldingStore(s => s.foldingUnfoldingMap)
  const unitId = GetChildIdFromPath(trueRootId, p.path, unitMap) as string
  const unit = unitMap[unitId]

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev (konrad.m.schmidt@gmail.com)</>

  const classification = GetFoldingClassification(p.path, p.leftDisplayDepth, echelonFoldingLevel, unitMap, trueRootId, foldingUnfoldingMap)
  const box = (parentBoxOn && classification === "a") ? "border-slate-500" : "border-transparent"

  function getChildList(u: OrgUnit) {
    const flat = GetFlatIds(u.children).map((cid, i) => ({index: i, childId: cid, count: 1}));
  
    if (!stacking) {
      return flat;
    }
  
    const seen = new Set();
    const filtered = flat.filter(entry => {
      if (seen.has(entry.childId)) return false;
      seen.add(entry.childId);
      return true;
    });
    return filtered.map((entry, i) => { return { ...entry, count: u.children[entry.childId] } })
  }

  function getDP(path: number[], startingIndex: number, count: number) {
    //console.log(path, startingIndex, count)
    return getMergedDPFromChildren(path, startingIndex, count, unitMap, trueRootId, staffNames, staffComments)
  }
  

  return (
    <div className={"border-dashed border-2 " + box + " flex flex-col"}>
      <TreeNode path={p.path} stack={p.stack} dp={p.dp}/>
      
      <div className={"tree-" + classification}>
        {unit.type === "org" && classification !== "c" && 
          getChildList(unit).map((entry, i) => (
            <TreeView
              path={[...p.path, entry.index]}
              leftDisplayDepth={p.leftDisplayDepth - 1}
              key={unitId + p.path + i}
              stack={entry.count} dp={getDP(p.path, entry.index, entry.count)}
            />
          ))}
      </div>
    </div>
  );
}

export default TreeView;

// memoize? Normaly i would do it, but not sure how will it react with (haha) react
export function GetFoldingClassification(
  path: number[], depthLeft: number, minEchelonLvl: number, unitMap: UnitMap, trueRootId: string, foldingMap: FoldingMap
): "a" | "b" | "c" {
  const id = GetChildIdFromPath(trueRootId, path, unitMap) as string
  const unit = unitMap[id]
  // Err
  if (!unit) {
    console.warn("No unit with give id! " + id)
    return "c"
  }
  // Reached base value
  if (unit.type === "raw" || unit.children.count === 0) {
    return "c"
  }

  const overrideDesigner = foldingMap[getPathAsString(path)]
  if (overrideDesigner === "Fold") {
    return "c"
  }

  // if (overrideDesigner === "Unfold") {
  //   return "a"
  // }
  
  const cCusDesignerChoice = depthLeft <= 0 || unit.echelonLevel <= minEchelonLvl
  if (cCusDesignerChoice && !overrideDesigner) {
    return "c"
  }

  const flatChildren = GetFlatIds(unit.children)
  let allChildrenAreC = true
  for (let i = 0; i < flatChildren.length; i++) {
    if (GetFoldingClassification([...path, i], depthLeft - 1, minEchelonLvl, unitMap, trueRootId, foldingMap) !== "c") {
      allChildrenAreC = false
      break
    }
  }

  if (allChildrenAreC) {
    return "b"
  }

  return "a"
}