import TreeNode from "./TreeNode";
import { getUnitQuick } from "../hooks/useUnitStore";

interface TreeViewProps {
  unitId: string;
  indent?: number;
  onHover: Function;
  parentUnitId?: string;
  selectedUnitId?: string;
  onNodeClick: Function;
}

function TreeView({unitId, indent = 0, onHover, parentUnitId = undefined, selectedUnitId = undefined, onNodeClick }: TreeViewProps) {
  const unit = getUnitQuick(unitId)

  return (
    <div>
      <TreeNode unitId={unitId} indent={indent} onHover={onHover} parentUnitId={parentUnitId} selectedUnitId={selectedUnitId} onClick={onNodeClick} />
      {unit.type === "org" &&
        unit.children.map(({ unitId: childId, count }, i) =>
          Array.from({ length: count }).map((_, j) => (
            <TreeView
              key={`${i}-${j}`}
              unitId={childId}
              indent={indent + 1}
              onHover={onHover}
              parentUnitId={unitId}
              selectedUnitId={selectedUnitId}
              onNodeClick={onNodeClick}
            />
          ))
        )}
    </div>
  );
}

export default TreeView;
