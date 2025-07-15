import TreeNode from "./TreeNode";
import { useUnitQuick } from "../hooks/useUnitStore";
import { Unit } from "../logic/logic";

interface TreeViewProps {
  unitId: string;
  indent?: number;
  parentUnitId?: string;
}

function TreeView({unitId, indent = 0, parentUnitId = undefined }: TreeViewProps) {
  const unit = useUnitQuick(unitId) as Unit

  return (
    <div>
      <TreeNode unitId={unitId} indent={indent} parentUnitId={parentUnitId}/>
      {unit.type === "org" &&
        unit.children.map(({ unitId: childId, count }, i) =>
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
