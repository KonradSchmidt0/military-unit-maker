import { useShortcutStore } from "../hooks/shortcutStore";
import { useEchelonStore } from "../hooks/useEchelonStore";
import { usePaletStore } from "../hooks/usePaletStore";
import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../hooks/useUnitStore";
import { defaultUnitColor, Unit } from "../logic/logic";

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
  
  const [shift, ctrl] = [useShortcutStore((s) => s.isShiftHeld), useShortcutStore((s) => s.isCtrlHeld)]
  
  const addToUnitPalet = usePaletStore(s => s.addUnitToPalet)
  const removeFromUnitPalet = usePaletStore(s => s.removeUnitFromPalet)
  
  const unitMap = useUnitStore(s => s.unitMap)
  const duplicateUnit = useUnitStore(s => s.duplicateUnit)
  const addChild = useUnitStore(s => s.addOrSubtractChild)

  const unit = unitMap[unitId] as Unit

  const isSelected = unitId === useUnitInteractionStore((s) => s.selectedId)
  const isHovered = unitId === useUnitInteractionStore(s => s.hoveredId)
  const echelon = useEchelonStore().intToSymbol[unit.echelonLevel];
  
  const padding = `${indent * 3}rem`;

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
          if (shift && ctrl) {
            const dupId = duplicateUnit(unitId)

            if (parentUnitId) {
              addChild(parentUnitId, dupId, 1)
              return
            }

            addToUnitPalet(dupId)
            return
          }

          if (shift || ctrl) {
            if (parentUnitId) {
              addChild(parentUnitId, unitId, shift ? -1 : 1)
              return
            }

            const paletAction = () => shift ? removeFromUnitPalet(unitId) : addToUnitPalet(unitId)
            paletAction()
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
