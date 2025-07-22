import TreeNode from "./TreeNode";
import { useUnitQuick } from "../hooks/useUnitStore";
import { defaultUnitColor } from "../logic/logic";
import { useGlobalStore } from "../hooks/useGlobalStore";

interface TreeViewProps {
  unitId: string;
  parentUnitId?: string;
  calculatedParentColor?: `#${string}`;
  leftDisplayDepth: number;
}

function TreeView({unitId, parentUnitId = undefined, calculatedParentColor = defaultUnitColor, leftDisplayDepth }: TreeViewProps) {
  const unit = useUnitQuick(unitId)
  // const echelonFoldingLevel = useGlobalStore(s => s.echelonFoldingLevel)
  const parentBoxSetting = useGlobalStore(s => s.displayParentBox)

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev 🥺 (konrad.m.schmidt@gmail.com)</>

  const myColor = unit.smartColor === "inheret" ? calculatedParentColor : unit.smartColor

  // TODO: Add back the echelon folding
  // const echelonDif = unit.echelonLevel - echelonFoldingLevel
  const isFolded = leftDisplayDepth <= 0
  const willChildBeFolded = (leftDisplayDepth === 1) && !isFolded
  
  // This definitlly needs a rework
  const displayParentBox = leftDisplayDepth >= 2 && unit.type === "org" && parentBoxSetting
  const wrapperClass = leftDisplayDepth + " border-2" + " " +
  (willChildBeFolded ? "" : "") + " " + 
  (isFolded ? "" : "p-2 pt-6 my-2") + " " + 
  (displayParentBox ? "border-slate-400 border-dashed" : "border-transparent") //"border-red-500 border-2 border-dashed")

  return (
    <div className={wrapperClass}>
      <TreeNode unitId={unitId} parentUnitId={parentUnitId} calculatedParentColor={myColor}/>

      <div className={`flex ${willChildBeFolded ? "flex-col gap-3.5 pt-8" : "flex-row gap-2"}`}>
        {unit.type === "org" && !isFolded &&
          Object.entries(unit.children).map(([ childId, count ], i) =>
            Array.from({ length: count }).map((_, j) => (
              leftDisplayDepth >= 1 ? <TreeView
                key={`${i}-${j}`}
                unitId={childId}
                parentUnitId={unitId}
                calculatedParentColor={myColor}
                leftDisplayDepth={leftDisplayDepth - 1}
              /> : <TreeNode unitId={childId} parentUnitId={unitId} calculatedParentColor={myColor}/>
            )
          )
        )}
      </div>
    </div>
  );
}

export default TreeView;
