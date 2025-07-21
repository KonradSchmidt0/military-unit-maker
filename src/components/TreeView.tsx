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
  const echelonFoldingLevel = useGlobalStore(s => s.echelonFoldingLevel)

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev 🥺 (konrad.m.schmidt@gmail.com)</>

  const myColor = unit.smartColor === "inheret" ? calculatedParentColor : unit.smartColor

  const echelonDif = unit.echelonLevel - echelonFoldingLevel
  const isFolded = leftDisplayDepth <= 0 || echelonDif <= 0
  const willChildBeFolded = leftDisplayDepth === 1 || echelonDif === 1

  return (
    <div className="mx-3 my-3">
      <TreeNode unitId={unitId} parentUnitId={parentUnitId} calculatedParentColor={myColor}/>

      <div className={`flex ${willChildBeFolded ? "flex-col gap-0" : "flex-row gap-2"}`}>
        {unit.type === "org" && !isFolded &&
          Object.entries(unit.children).map(([ childId, count ], i) =>
            Array.from({ length: count }).map((_, j) => (
              <TreeView
                key={`${i}-${j}`}
                unitId={childId}
                parentUnitId={unitId}
                calculatedParentColor={myColor}
                leftDisplayDepth={leftDisplayDepth - 1}
              />
            )
          )
        )}
      </div>
    </div>
  );
}

export default TreeView;
