import { useEffect } from 'react';
import { processSelect, useUnitInteractionStore } from '../hooks/useUnitInteractionsStore';
import { useUnitStore } from '../hooks/useUnitStore';
import { OrgUnit } from '../logic/logic';
import { GetFlatIds } from '../logic/childManaging';

export default function ArrowNavigation() {
  const { selectParent, selectSibling, selectChild } = useUnitInteractionStore(s => s)
  const slctd = useUnitInteractionStore(s => s.select)

  const {unitMap, trueRootId, actingRootPath} = useUnitStore(s => s)

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


      function handleSelectParent() {
        if (actingRootPath.toString() === path.toString())
          return
        selectParent()
      }
      function handleSelectChild() {
        if (unit.type !== "org"){
          return}
        if (Object.entries(unit.children).length === 0){
          return}
        //const flatChildrenLenght = GetFlatIds(unit.children).length
        //const i = Math.floor((flatChildrenLenght - 1) / 2)
        // ^ Will work better when the tree is in 'a' mode, but less intuitive when in 'b' mode.
        // | For now i see it as too much od a petty thing, but in future the teoretical best UX would determin if if child is
        //   stacked or not, and would choose which child to choose
        const i = 0 
        selectChild(i)
      }
      function handleLeftRight(d: 1 | -1) {
        if (actingRootPath.toString() === path.toString() || !parentId) {
          handleSelectChild()
          return
        }

        const flatChildrenLenght = GetFlatIds((unitMap[parentId] as OrgUnit).children).length 
        let o = path[path.length - 1] + d
        o = (flatChildrenLenght * 2 + o) % flatChildrenLenght
        selectSibling(o)
      }

      switch (e.key) {
        case 'ArrowUp':
          handleSelectParent()
          break;
        case 'ArrowDown':
          handleSelectChild()
          break;
        case 'ArrowLeft':
          handleLeftRight(-1)
          break;
        case 'ArrowRight':
          handleLeftRight(1)
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slctd, trueRootId, unitMap]);

  return null; // no UI
}
