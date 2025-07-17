import TreeNode from "./TreeNode";
import { useUnitQuick } from "../hooks/useUnitStore";
import { defaultUnitColor } from "../logic/logic";

interface TreeViewProps {
  unitId: string;
  indent?: number;
  parentUnitId?: string;
  calculatedParentColor?: string;
}

function TreeView({unitId, indent = 0, parentUnitId = undefined, calculatedParentColor = defaultUnitColor }: TreeViewProps) {
  const unit = useUnitQuick(unitId)

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev 🥺 (konrad.m.schmidt@gmail.com)</>

  const myColor = unit.smartColor === "inheret" ? calculatedParentColor : unit.smartColor

  return (
    <div>
      <TreeNode unitId={unitId} indent={indent} parentUnitId={parentUnitId} calculatedParentColor={myColor}/>
      {unit.type === "org" &&
        Object.entries(unit.children).map(([ childId, count ], i) =>
          Array.from({ length: count }).map((_, j) => (
            <TreeView
              key={`${i}-${j}`}
              unitId={childId}
              indent={indent + 1}
              parentUnitId={unitId}
              calculatedParentColor={myColor}
            />
          ))
        )}
    </div>
  );
}

export default TreeView;
