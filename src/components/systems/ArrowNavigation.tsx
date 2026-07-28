import { useEffect } from 'react';
import { useUnitInteractionStore, processSelect } from '../../hooks/useUnitInteractionsStore';
import { useUnitStore } from '../../hooks/useUnitStore';
import { GetFlatIds } from '../../logic/Units/childManaging';
import { OrgUnit } from '../../logic/Units/logic';
import { GetFoldingClassification } from '../UnitDisplaying/TreeView';
import { useGlobalStore } from '../../hooks/useGlobalStore';
import { useForceFoldingStore } from '../../hooks/useForceFoldingStore';

export default function ArrowNavigation() {
  const { selectParent, selectSibling, selectChild } = useUnitInteractionStore()
  const slctd = useUnitInteractionStore(s => s.selectSignature)

  const {unitMap, trueRootId, actingRootPath} = useUnitStore()
  const { foldingDepth, echelonFoldingLevel, stacking: treeStacking } = useGlobalStore()
  const { foldingUnfoldingMap } = useForceFoldingStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!Array.isArray(slctd)) return;

      const el = document.activeElement;
      const isTyping =
        el && (
          el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          (el as HTMLElement).isContentEditable
        );

      if (isTyping) return;

      const path = (slctd as number[])
      const selectedId  = processSelect(path, unitMap, trueRootId)
      const unit = unitMap[selectedId ?? ""]
      const parentId = processSelect(path.slice(0, -1), unitMap, trueRootId)
      const parentsFoldingClass = GetFoldingClassification(
        path.slice(0, -1), 
        foldingDepth - path.length - 2, 
        echelonFoldingLevel,
        unitMap, trueRootId, foldingUnfoldingMap, actingRootPath, treeStacking
      )


      function handleSelectParent() {
        if (actingRootPath.toString() === path.toString())
          return
        selectParent()
      }
      function handleSelectChild() {
        if (unit.type !== "org")
          return
        if (Object.entries(unit.children).length === 0)
          return
        //const flatChildrenLenght = GetFlatIds(unit.children).length
        //const i = Math.floor((flatChildrenLenght - 1) / 2)
        selectChild(0)
      }
      function handleSelectSibling(d: 1 | -1) {
        if (actingRootPath.toString() === path.toString() || !parentId) {
          handleSelectChild()
          return
        }

        const flatChildrenLenght = GetFlatIds((unitMap[parentId] as OrgUnit).children).length 
        let o = path[path.length - 1] + d
        o = (flatChildrenLenght * 2 + o) % flatChildrenLenght
        selectSibling(o)
      }

      const bindings: Record<string, () => void> = 
        parentsFoldingClass !== "b" ? {
          ArrowUp: () => handleSelectParent(),
          ArrowDown: () => handleSelectChild(),
          ArrowLeft: () => handleSelectSibling(-1),
          ArrowRight: () => handleSelectSibling(1),
        } : {
          ArrowUp: () => handleSelectSibling(-1),
          ArrowDown: () => handleSelectSibling(1),
          ArrowLeft: () => handleSelectParent(),
          ArrowRight: () => handleSelectChild(),
        }

      bindings[e.key]?.()
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slctd, trueRootId, unitMap, actingRootPath, echelonFoldingLevel, foldingDepth, foldingUnfoldingMap, treeStacking,
    selectChild, selectParent, selectSibling]);

  return null; // no UI
}
