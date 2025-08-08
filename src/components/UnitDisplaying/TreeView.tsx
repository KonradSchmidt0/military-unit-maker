import TreeNode from "./TreeNode";
import { UnitMap, useUnitStore } from "../../hooks/useUnitStore";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { GetChildIdFromPath, GetFlatIds } from "../../logic/childManaging";
import { OrgUnit } from "../../logic/logic";

interface TreeViewProps {
  path: number[];
  leftDisplayDepth: number;
}

function TreeView(p : TreeViewProps) {
  const {unitMap, trueRootId} = useUnitStore(s => s)
  const unitId = useUnitInteractionStore((s) => s.getIdFromPath)(unitMap, trueRootId, p.path) as string
  const unit = unitMap[unitId]
  const {echelonFoldingLevel, stacking} = useGlobalStore(s => s)
  const parentBoxOn = useGlobalStore(s => s.displayParentBox)

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev 🥺 (konrad.m.schmidt@gmail.com)</>

  const classification = GetFoldingClassification(p.path, p.leftDisplayDepth, echelonFoldingLevel, unitMap, trueRootId)
  const box = (parentBoxOn && classification === "a") ? "border-slate-500" : "border-transparent"

  function getChildList(u: OrgUnit) {
    const flat = GetFlatIds(u.children).map((cid, i) => ({index: i, childId: cid}));
  
    if (!stacking) {
      return flat;
    }
  
    const seen = new Set();
    return flat.filter(entry => {
      if (seen.has(entry.childId)) return false;
      seen.add(entry.childId);
      return true;
    });
  }
  

  return (
    <div className={"border-dashed border-2 " + box + " flex flex-col"}>
      <TreeNode path={p.path}/>
      
      <div className={"tree-" + classification}>
        {unit.type === "org" && classification !== "c" && 
          getChildList(unit).map((o, i) => (
            <TreeView
              path={[...p.path, o.index]}
              leftDisplayDepth={p.leftDisplayDepth - 1}
              key={unitId + i}
            />
          ))}
      </div>
    </div>
  );
}

export default TreeView;

// memoize? Normaly i would do it, but not sure how will it react with (haha) react
export function GetFoldingClassification(
  path: number[], depthLeft: number, minEchelonLvl: number, unitMap: UnitMap, trueRootId: string
): "a" | "b" | "c" {
  if (depthLeft === 0) {
    return "c"
  }
  const id = GetChildIdFromPath(trueRootId, path, unitMap)
  const unit = unitMap[id]
  if (!unit) {
    console.warn("No unit with give id! " + id)
    return "c"
  }
  if (unit.type === "raw" || unit.echelonLevel <= minEchelonLvl) {
    return "c"
  }
  if (unit.children.count === 0) {
    return "c"
  }

  if (depthLeft === 1) {
    return "b"
  }
  let allChildrenAreC = true
  let i = 0
  for (const [_cId, cCount] of Object.entries(unit.children)) {
    if (GetFoldingClassification([...path, i], depthLeft - 1, minEchelonLvl, unitMap, trueRootId) !== "c") {
      allChildrenAreC = false
      break
    }
    i += cCount
  }
  if (allChildrenAreC) {
    return "b"
  }

  return "a"
}