import TreeNode from "./TreeNode";
import { UnitMap, useUnitStore } from "../../hooks/useUnitStore";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { GetChildIdFromPath, getComplexChildList } from "../../logic/childManaging";
import { DesignationPack, getMergedDPFromChildren } from "../../logic/designationPack";
import { FoldingMap, getPathAsString, useForceFoldingStore } from "../../hooks/useForceFoldingStore";
import { useStaffTextStore } from "../../hooks/useStaffTextStore";

interface TreeViewProps {
  path: number[];
  leftDisplayDepth: number;
  stack?: number;
  dp?: DesignationPack
}

function TreeView(p : TreeViewProps) {
  const {unitMap, trueRootId, actingRootPath} = useUnitStore(s => s)
  const {echelonFoldingLevel, stacking, displayParentBox} = useGlobalStore(s => s)
  const { staffNames, staffComments } = useStaffTextStore(s => s)
  const foldingUnfoldingMap = useForceFoldingStore(s => s.foldingUnfoldingMap)
  const unitId = GetChildIdFromPath(trueRootId, p.path, unitMap) as string
  const unit = unitMap[unitId]

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev (konrad.m.schmidt@gmail.com)</>

  const classification = GetFoldingClassification(p.path, p.leftDisplayDepth, echelonFoldingLevel, unitMap, trueRootId, foldingUnfoldingMap, actingRootPath, stacking)
  const box = (displayParentBox && classification === "a") ? "border-slate-500" : "border-transparent"

  function getDP(path: number[], startingIndex: number, count: number) {
    return getMergedDPFromChildren(path, startingIndex, count, unitMap, trueRootId, staffNames, staffComments)
  }
  
  return (
    <div className={"border-dashed border-2 " + box + " flex flex-col"}>
      <div className="flex flex-row justify-center">
        <TreeNode signature={p.path} stack={p.stack} dp={p.dp}/>
      </div>
      
      <div className={"tree-" + classification}>
        {unit.type === "org" && classification !== "c" && 
          getComplexChildList(unit, !stacking).map((entry, i) => (
            <TreeView
              path={[...p.path, entry.flatIndex]}
              leftDisplayDepth={p.leftDisplayDepth - 1}
              key={unitId + p.path + i}
              stack={stacking ? entry.count : 1} dp={getDP(p.path, entry.flatIndex, stacking ? entry.count : 1)}
            />
          ))}
      </div>
    </div>
  );
}

export default TreeView;

// memoize? Normaly i would do it, but not sure how will it react with (haha) react
export function GetFoldingClassification(
  path: number[], depthLeft: number, minEchelonLvl: number, unitMap: UnitMap, trueRootId: string, foldingMap: FoldingMap, actingRootPath: number[], isTreeStacking: boolean
): "a" | "b" | "c" {
  const id = GetChildIdFromPath(trueRootId, path, unitMap) as string
  const unit = unitMap[id]
  // Err
  if (!unit) {
    console.warn("No unit with give id! " + id)
    return "c"
  }
  // Reached base value
  if (unit.type === "raw" || Object.entries(unit.children).length === 0) {
    return "c"
  }

  const overrideDesigner = (
    foldingMap[getPathAsString(path)] === "Fold" &&
    getPathAsString(actingRootPath) !== getPathAsString(path)
  )
  if (overrideDesigner) {
    return "c"
  }

  // if (overrideDesigner === "Unfold") {
  //   return "a"
  // }
  
  const cCusDesignerChoice = depthLeft <= 0 || unit.echelonLevel <= minEchelonLvl
  if (cCusDesignerChoice && !overrideDesigner) {
    return "c"
  }

  const childrenList = getComplexChildList(unit, !isTreeStacking)
  let allChildrenAreC = true
  for (const entry of childrenList) {
    if (GetFoldingClassification([...path, entry.flatIndex], depthLeft - 1, minEchelonLvl, unitMap, trueRootId, foldingMap, actingRootPath, isTreeStacking) !== "c") {
      allChildrenAreC = false
      break
    }
  }

  if (allChildrenAreC) {
    return "b"
  }

  return "a"
}