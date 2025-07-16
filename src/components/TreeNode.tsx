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

  const unit = useUnitQuick(unitId) as Unit

  const onHover = useUnitInteractionStore((s) => s.setHoveredId)
  
  const setSelected = useUnitInteractionStore((s) => s.setSelectedId)
  const setSelectedParent = useUnitInteractionStore((s) => s.setSelected_parentId)

  const shadowSize = "4px"
  // WIP
  const shadowOpacityHex = "ff"
  
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${unit.color}${shadowOpacityHex}`;
  const shadow = `hover:shadow-[0_0_${shadowSize}_${shadowSize}_theme(colors.primary)]`

  const echelon = useEchelonStore().intToSymbol[unit.echelonLevel];

  return (
    <div style={{marginLeft: padding}}  className="relative flex flex-col items-center">
      {/* Echelon symbol above the unit */}
      <div className=" text-primary text-xs">{echelon}</div>

      {/* Unit block */}
      <div
        style={{
          backgroundColor: unit.color,
          boxShadow: isSelected ? boxShadow : undefined,
        }}
        onMouseEnter={() => onHover(unitId)}
        onMouseLeave={() => onHover(undefined)}
        onClick={() => {
          setSelected(unitId);
          setSelectedParent(parentUnitId);
        }}
        className={`w-12 h-8 relative cursor-pointer border-2 border-black transition-shadow ${shadow}`}
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
