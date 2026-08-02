import TreeNode from "./TreeNode";
import { UnitMap, useUnitStore } from "../../hooks/useUnitStore";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { GetChildIdFromPath, getComplexChildList } from "../../logic/Units/childManaging";
import { DesignationPack, getMergedDPFromChildren } from "../../logic/Designations/designationPack";
import { FoldingMap, getPathAsString, useForceFoldingStore } from "../../hooks/useForceFoldingStore";
import { useStaffTextStore } from "../../hooks/useStaffTextStore";
import TreeLineRefPoint from "./UnitTree/TreeLineRefPoint";

interface TreeViewProps {
  path: number[];
  leftDisplayDepth: number;
  stack?: number;
  dp?: DesignationPack
  parentClassification?: "a" | "b" | "c"
}

function TreeView(p : TreeViewProps) {
  const {unitMap, trueRootId, actingRootPath} = useUnitStore(s => s)
  const {echelonFoldingLevel, stacking} = useGlobalStore(s => s)
  const { staffNames, staffComments } = useStaffTextStore(s => s)
  const foldingUnfoldingMap = useForceFoldingStore(s => s.foldingUnfoldingMap)
  const unitId = GetChildIdFromPath(trueRootId, p.path, unitMap) as string
  const unit = unitMap[unitId]

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev (konrad.m.schmidt@gmail.com)</>

  const classification = GetFoldingClassification(p.path, p.leftDisplayDepth, echelonFoldingLevel, unitMap, trueRootId, foldingUnfoldingMap, actingRootPath, stacking)

  function getDP(path: number[], startingIndex: number, count: number) {
    return getMergedDPFromChildren(path, startingIndex, count, unitMap, trueRootId, staffNames, staffComments)
  }

  const treeLineHeight = 12
  const bottomPadding = 16
  const topPadding = 6
  
  const UNIT_WIDHT = 54
  const treeLineLenght = 8
  const rightPadding = 4
  
  return (
    <div className={p.parentClassification === "b" ? "relative flex flex-row" : "relative flex flex-col"}>

      {p.parentClassification === "a" &&
        <div className="flex flex-col min-w-3 items-center bg-blue-500/ 25">
          <div style={{height: topPadding + treeLineHeight}}/>
          <TreeLineRefPoint path={p.path}/>
          <div className="w-fit" style={{height: treeLineHeight + bottomPadding, paddingBottom: bottomPadding}}>
            <svg width="4" height={treeLineHeight} xmlns="http://www.w3.org/2000/svg">
              <line 
                className="ln-tree" 
                x1="2" y1="-2" x2="2" y2={treeLineHeight+2} 
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      }

      {p.parentClassification === "b" &&
        <div className=" bg-blue-500/ 25 items-center flex flex-row">
          <TreeLineRefPoint path={p.path}/>
          <div className="w-fit" style={{paddingRight: rightPadding}}>
            <svg width={treeLineLenght} height="4" xmlns="http://www.w3.org/2000/svg">
              <line 
                className="ln-tree" 
                x1="-2" y1="2" x2={treeLineLenght+2} y2="2"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      }

      <div className="flex flex-row justify-center">
        <TreeNode signature={p.path} stack={p.stack} dp={p.dp}/>
      </div>

      {classification === "a" &&
        <div className="relative">
          <div className="absolute justify-center w-full flex flex-col min-w-3 items-center bg-green-500/ 25">
            <div className="w-fit h-fit" style={{height: treeLineHeight, paddingTop: topPadding}} >
              <svg width="2" height="12" xmlns="http://www.w3.org/2000/svg">
                <line className="ln-tree" x1="1" y1="0" x2="1" y2={treeLineHeight} strokeWidth="1.5"/>
              </svg>
            </div>
          </div>
        </div>
      }

      {classification === "b" &&
        <div className="relative items-end w-full bg-green-500/25">
          <div 
            className="w-fit absolute top-2"
            style={{right: rightPadding + UNIT_WIDHT + treeLineLenght}}
          >
            <svg width={4} height={36} xmlns="http://www.w3.org/2000/svg">
              <line 
                className="ln-tree" 
                x1="2" y1="-2" x2="2" y2="37"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
      }
      
      <div className={"tree-" + classification}>
        {unit.type === "org" && classification !== "c" && 
          getComplexChildList(unit, !stacking).map((entry, i) => (
            <TreeView
              path={[...p.path, entry.flatIndex]}
              leftDisplayDepth={p.leftDisplayDepth - 1}
              key={unitId + p.path + i}
              stack={stacking ? entry.count : 1} dp={getDP(p.path, entry.flatIndex, stacking ? entry.count : 1)}
              parentClassification={classification}
            />
          ))}
      </div>
    </div>
  );
}

export default TreeView;

// A = proper tree, B = vertical list, C = properly folded
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

  const myPathAsStr = getPathAsString(path)
  const overrideUserSettings = foldingMap[myPathAsStr]
  
  const isActingRoot = getPathAsString(actingRootPath) === myPathAsStr
  if (overrideUserSettings === "Fold" && !isActingRoot) {
    return "c"
  }
  
  const cCusUserSettingsChoice = depthLeft <= 0 || unit.echelonLevel <= minEchelonLvl
  if (cCusUserSettingsChoice && overrideUserSettings !== "Unfold") {
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