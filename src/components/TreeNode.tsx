import { useEchelonStore } from "../hooks/useEchelonStore";
import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { useUnitQuick } from "../hooks/useUnitStore";
import { Unit } from "../logic/logic";

interface TreeNodeProps {
  unitId: string;
  indent: number;
  parentUnitId?: string;
}

function TreeNode({ unitId, indent, parentUnitId = undefined }: TreeNodeProps) {
  const padding = `${indent * 1}rem`;

  const isSelected = unitId === useUnitInteractionStore((s) => s.selectedId)
  const isHovered = unitId === useUnitInteractionStore(s => s.hoveredId)

  const unit = useUnitQuick(unitId) as Unit

  const onHover = useUnitInteractionStore((s) => s.setHoveredId)
  
  const setSelected = useUnitInteractionStore((s) => s.setSelectedId)
  const setSelectedParent = useUnitInteractionStore((s) => s.setSelected_parentId)
  
  const echelon = useEchelonStore().intToSymbol[unit.echelonLevel];
  
  const shadowSize = "3px"
  const shadowOpacityHex = isHovered || isSelected ? "bb" : "00"
  const shadowColor = isSelected ? unit.color : "#bbbbbb"
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${shadowColor}${shadowOpacityHex}`

  return (
    <div style={{marginLeft: padding}}  className="relative flex flex-col items-center">
      {/* Echelon symbol above the unit */}
      <div className=" text-primary text-xs">{echelon}</div>

      {/* Unit block */}
      <div
        style={{
          backgroundColor: unit.color,
          boxShadow: boxShadow,
        }}
        onMouseEnter={() => onHover(unitId)}
        onMouseLeave={() => onHover(undefined)}
        onClick={() => {
          setSelected(unitId);
          setSelectedParent(parentUnitId);
        }}
        className={`w-12 h-8 relative cursor-pointer border-2 border-black transition-shadow`}
      >
        {unit.layers.map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            className="absolute top-0 left-0 w-full h-full object-fill"
          />
        ))}
      </div>
    </div>
  );
}

export default TreeNode;
