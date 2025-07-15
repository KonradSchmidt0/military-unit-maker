import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { useUnitQuick } from "../hooks/useUnitStore";

interface TreeNodeProps {
  unitId: string;
  indent: number;
  parentUnitId?: string;
}

function TreeNode({ unitId, indent, parentUnitId = undefined }: TreeNodeProps) {
  const padding = `${indent * 1}rem`;

  const isSelected = unitId === useUnitInteractionStore((s) => s.selectedId)

  const unit = useUnitQuick(unitId)

  const onHover = useUnitInteractionStore((s) => s.setHoveredId)
  
  const setSelected = useUnitInteractionStore((s) => s.setSelectedId)
  const setSelectedParent = useUnitInteractionStore((s) => s.setSelected_parentId)


  return (
    <div
      style={{ marginLeft: padding }} // Ussed style insted of Tailwind class cus' need for more flexibility
      onMouseEnter={() => onHover(unitId)}
      onMouseLeave={() => onHover(undefined)}
      onClick={() => { setSelected(unitId); setSelectedParent(parentUnitId) }}
      className="cursor-pointer hover:text-orange-400"
    >
      {unit?.name}{isSelected ? " <<<" : ""}
    </div>
  );
}

export default TreeNode;
