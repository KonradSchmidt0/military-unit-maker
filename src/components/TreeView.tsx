import TreeNode from "./TreeNode";
import { useUnitStore } from "../hooks/useUnitStore";
import { defaultUnitColor } from "../logic/logic";
import { useGlobalStore } from "../hooks/useGlobalStore";
import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { GetFlatIds } from "../logic/childManaging";

interface TreeViewProps {
  path: number[];
  calculatedParentColor?: `#${string}`;
  leftDisplayDepth: number;
}

function TreeView({path, calculatedParentColor = defaultUnitColor, leftDisplayDepth }: TreeViewProps) {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const unitId = useUnitInteractionStore((s) => s.getIdFromPath)(unitMap, trueRootId, path) as string
  const unit = unitMap[unitId]
  // const echelonFoldingLevel = useGlobalStore(s => s.echelonFoldingLevel)
  const parentBoxOn = useGlobalStore(s => s.displayParentBox)

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev 🥺 (konrad.m.schmidt@gmail.com)</>

  const myColor = unit.smartColor === "inheret" ? calculatedParentColor : unit.smartColor

  // TODO: Add back the echelon folding
  // const echelonDif = unit.echelonLevel - echelonFoldingLevel
  const isFolded = leftDisplayDepth <= 0
  const willChildBeFolded = (leftDisplayDepth === 1) && !isFolded
  
  // This definitlly needs a rework
  const displayParentBox = leftDisplayDepth >= 2 && unit.type === "org" && parentBoxOn
  const wrapperClass = leftDisplayDepth.toString() + " border-2 " + " " +
  (willChildBeFolded ? "" : "") + " " + 
  (isFolded ? "" : "p-2 pt-6 my-2") + " " + 
  (displayParentBox ? "border-slate-400 border-dashed" : "border-transparent") //"border-red-500 border-2 border-dashed")

  return (
    <div className={wrapperClass}>
      <TreeNode unitId={unitId} path={path} calculatedParentColor={myColor}/>

      <div className={`flex ${willChildBeFolded ? "flex-col gap-3.5 pt-8" : "flex-row gap-2"}`}>

        {unit.type === "org" && !isFolded &&
          GetFlatIds(unit.children).map((_childId, i) => (
            leftDisplayDepth >= 1 ? <TreeView
              key={`${i}-${i}`}
              path={[...path, i]}
              calculatedParentColor={myColor}
              leftDisplayDepth={leftDisplayDepth - 1}
            /> : null
          )
        )}
        
      </div>
    </div>
  );
}

export default TreeView;
