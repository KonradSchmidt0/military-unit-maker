import { useEffect } from 'react';
import { useUnitInteractionStore, processSelect } from '../../hooks/useUnitInteractionsStore';
import { useUnitStore } from '../../hooks/useUnitStore';
import { GetChildren, OrgUnit } from '../../logic/Units/logic';
import { useGlobalStore } from '../../hooks/useGlobalStore';
import { useForceFoldingStore } from '../../hooks/useForceFoldingStore';
import { useShortcutStore } from '../../hooks/shortcutStore';
import { usePhaseStore } from '../../hooks/usePhaseStore';
import { getComplexChildList } from '../../logic/Units/childGetting';

export default function ArrowNavigation() {
  const { selectParent, selectSibling, selectChild } = useUnitInteractionStore()
  const slctd = useUnitInteractionStore(s => s.selectSignature)

  const {unitMap, trueRootId, actingRootPath} = useUnitStore()
  const { foldingDepth, echelonFoldingLevel, stacking: treeStacking } = useGlobalStore()
  const { foldingUnfoldingMap } = useForceFoldingStore()

  const { alt } = useShortcutStore()

  const { currentPhase: phase } = usePhaseStore()

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

      if (alt) return;

      e?.preventDefault()

      const path = (slctd as number[])
      const selectedId  = processSelect(path, unitMap, trueRootId, phase)
      const unit = unitMap[selectedId ?? ""]
      const parentId = processSelect(path.slice(0, -1), unitMap, trueRootId, phase)
      const parent = unitMap[parentId ?? ""] as OrgUnit


      function handleSelectParent() {
        if (actingRootPath.toString() === path.toString())
          return
        selectParent()
      }
      function handleSelectChild() {
        if (unit.type !== "org")
          return
        if (GetChildren(unit, phase).length === 0)
          return
        selectChild(0)
      }
      function handleSelectSibling(d: 1 | -1) {
        if (actingRootPath.toString() === path.toString() || !parentId) {
          handleSelectChild()
          return
        }

        const flatChildrenLenght = getComplexChildList(parent, true, phase).length
        const o = path[path.length - 1] + d
        selectSibling( (o + flatChildrenLenght * 2) % flatChildrenLenght )
      }

      const bindings: Record<string, () => void> = 
        //parentsFoldingClass !== "b" ? {
        true ? {
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
    selectChild, selectParent, selectSibling, alt]);

  return null; // no UI
}
