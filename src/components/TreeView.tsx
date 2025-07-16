import TreeNode from "./TreeNode";
import { useUnitQuick } from "../hooks/useUnitStore";

interface TreeViewProps {
  unitId: string;
  indent?: number;
  parentUnitId?: string;
}

function TreeView({unitId, indent = 0, parentUnitId = undefined }: TreeViewProps) {
  const unit = useUnitQuick(unitId)

  if (!unit)
    return <>Unit is not a unit! ({unitId} {unit})
    Please screenshot and send this to dev 🥺 (konrad.m.schmidt@gmail.com)</>

  return (
    <div>
      <TreeNode unitId={unitId} indent={indent} parentUnitId={parentUnitId}/>
      {unit.type === "org" &&
        Object.entries(unit.children).map(([ childId, count ], i) =>
          Array.from({ length: count }).map((_, j) => (
            <TreeView
              key={`${i}-${j}`}
              unitId={childId}
              indent={indent + 1}
              parentUnitId={unitId}
            />
          ))
        )}
    </div>
  );
}

export default TreeView;
