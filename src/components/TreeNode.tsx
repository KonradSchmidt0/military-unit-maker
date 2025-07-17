import { useShortcutStore } from "../hooks/shortcutStore";
import { useEchelonStore } from "../hooks/useEchelonStore";
import { usePaletStore } from "../hooks/usePaletStore";
import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../hooks/useUnitStore";
import { defaultUnitColor, OrgUnit, removeChild, Unit } from "../logic/logic";

interface TreeNodeProps {
  unitId: string;
  indent: number;
  parentUnitId?: string;
  // Problem: If our color is 'inheret' and parents color is 'inheret' we would need extra hard way to search up the chain
  //   Also, node can appear without parent outside of a tree, or as a root. We have to handle those cases
  // Solution: Parent tree view calculates actual color, and sends it lower 
  calculatedParentColor?: string; 
}

function TreeNode({ unitId, indent, parentUnitId = undefined, calculatedParentColor = undefined }: TreeNodeProps) {
  const onHover = useUnitInteractionStore((s) => s.setHoveredId)
  const setSelected = useUnitInteractionStore((s) => s.setSelectedId)
  const setSelectedParent = useUnitInteractionStore((s) => s.setSelected_parentId)
  
  const isShiftHeld = useShortcutStore(s => s.isShiftHeld)

  const removeFromUnitPalet = usePaletStore(s => s.removeUnitFromPalet)
  
  const unitMap = useUnitStore(s => s.unitMap)
  const updateUnitMap = useUnitStore(s => s.updateUnit)

  const unit = unitMap[unitId] as Unit
  
  const isSelected = unitId === useUnitInteractionStore((s) => s.selectedId)
  const isHovered = unitId === useUnitInteractionStore(s => s.hoveredId)
  const echelon = useEchelonStore().intToSymbol[unit.echelonLevel];
  
  const padding = `${indent * 1}rem`;

  const color = unit.smartColor === "inheret" ? (calculatedParentColor ? calculatedParentColor : defaultUnitColor) : unit.smartColor
  
  const shadowSize = "3px"
  const shadowOpacityHex = isHovered || isSelected ? "bb" : "00"
  const shadowColor = isSelected ? color : "#bbbbbb"
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${shadowColor}${shadowOpacityHex}`
  
  return (
    <div style={{marginLeft: padding}}  className="relative flex flex-col items-center">
      {/* Echelon symbol above the unit */}
      <div className=" text-primary text-xs">{echelon}</div>

      {/* Unit block */}
      <div
        style={{
          backgroundColor: color,
          boxShadow: boxShadow,
        }}
        onMouseEnter={() => onHover(unitId)}
        onMouseLeave={() => onHover(undefined)}
        onClick={() => {
          if (isShiftHeld) {
            if (parentUnitId) {
              const parent = unitMap[parentUnitId] as OrgUnit
              const newParent = removeChild(parent, unitId)
              updateUnitMap(parentUnitId, newParent)
              return
            }

            removeFromUnitPalet(unitId)
            return
          }

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
