import { useUnitQuick } from "../hooks/useUnitStore";

interface TreeNodeProps {
  unitId: string;
  indent: number;
  onHover: Function;
  parentUnitId?: string; // WILL BE USED LATER IN SELECT MENU
  selectedUnitId?: string;
  onClick: Function;
}

function TreeNode({ unitId, indent, onHover, parentUnitId = undefined, selectedUnitId = undefined, onClick }: TreeNodeProps) {
  const padding = `${indent * 1}rem`;

  const isSelected = unitId === selectedUnitId

  const unit = useUnitQuick(unitId)

  return (
    <div
      style={{ marginLeft: padding }} // Ussed style insted of Tailwind class cus' need for more flexibility
      onMouseEnter={() => onHover(unitId)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick({selectedId: unitId, parentId: parentUnitId})}
      className="cursor-pointer hover:text-orange-400"
    >
      {unit?.name}{isSelected ? " <<<" : ""}
    </div>
  );
}

export default TreeNode;
