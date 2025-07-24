import TreeNode from "./TreeNode";
import { useUnitStore } from "../hooks/useUnitStore";
import { useGlobalStore } from "../hooks/useGlobalStore";
import { GetRealColorRecusivelly, getUnitIdAtPath } from "../logic/unitPath";
import { TreeSplit } from "./TreeSplit";

interface TreeViewProps {
  leftDisplayDepth: number;
  unitPath?: number[];
}

function TreeView(p: TreeViewProps) {
  const trueRootId =useUnitStore(s => s.trueRootId)
  const actingRootId =useUnitStore(s => s.actingRootId)
  const rootId = useUnitStore(s => s.getCurrentRootId(trueRootId, actingRootId))
  const unitMap = useUnitStore(s => s.unitMap)
  const myPath = p.unitPath ?? []
  const unitId = getUnitIdAtPath(rootId, myPath, unitMap)
  const unit = unitMap[unitId]
  // const echelonFoldingLevel = useGlobalStore(s => s.echelonFoldingLevel)
  const parentBoxSetting = useGlobalStore(s => s.displayParentBox)

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev 🥺 (konrad.m.schmidt@gmail.com)</>

  // TODO: Add back the echelon folding
  // const echelonDif = unit.echelonLevel - echelonFoldingLevel
  const isFolded = p.leftDisplayDepth <= 0
  const willChildBeFolded = (p.leftDisplayDepth === 1) && !isFolded
  
  // This definitlly needs a rework
  const displayParentBox = p.leftDisplayDepth >= 2 && unit.type === "org" && parentBoxSetting
  const wrapperClass = p.leftDisplayDepth + " border-2" + " " +
  (willChildBeFolded ? "" : "") + " " + 
  (isFolded ? "" : "p-2 pt-6 my-2") + " " + 
  (displayParentBox ? "border-slate-400 border-dashed" : "border-transparent") //"border-red-500 border-2 border-dashed")

  return (
    <div className={wrapperClass}>
      <TreeNode myPath={myPath} />

      <div className={`flex ${willChildBeFolded ? "flex-col gap-3.5 pt-8" : "flex-row gap-2"}`}>
        {unit.type === "org" && !isFolded &&
          <TreeSplit parent={unit} parentPath={myPath} leftDisplayDepth={p.leftDisplayDepth}/>
        }
      </div>
    </div>
  );
}

export default TreeView;
