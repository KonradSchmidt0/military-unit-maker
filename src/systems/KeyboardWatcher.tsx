import { useEffect } from "react";
import { useShortcutStore } from "../hooks/shortcutStore";
import { processSelect, useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { UnitMap, useUnitStore } from "../hooks/useUnitStore";
import { hoverStore, useHoverStore } from "../hooks/useHoverStore";

export function KeyboardWatcher() {
  const selectBundle: hoverStore = useHoverStore(s => s)
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)

  const resetAllSelected = useUnitInteractionStore((s) => s.resetSelected);

  // React, so you have to render handlers, cant just call
  return <>{HandleModifiers()}{HandleEscape(resetAllSelected)}{HandleCtrlZ(selectBundle, unitMap, trueRootId)}</>; // It’s invisible, just for effect
}

function HandleModifiers() {
  const setModsInStore = useShortcutStore((s) => s.setModifiers)

  useEffect(() => {
    const updateModifiers = (e: KeyboardEvent) => {
        setModsInStore({
            isShiftHeld: e.shiftKey,
            isCtrlHeld: e.ctrlKey,
            isAltHeld: e.altKey,
            isMetaHeld: e.metaKey,
        });
    };

    window.addEventListener("keydown", updateModifiers);
    window.addEventListener("keyup", updateModifiers);
    window.addEventListener("blur", () => setModsInStore({
        isShiftHeld: false,
        isCtrlHeld: false,
        isAltHeld: false,
        isMetaHeld: false,
    })
    );

    return () => {
        window.removeEventListener("keydown", updateModifiers);
        window.removeEventListener("keyup", updateModifiers);
        window.removeEventListener("blur", () => setModsInStore({
            isShiftHeld: false,
            isCtrlHeld: false,
            isAltHeld: false,
            isMetaHeld: false,
        })
        );
    };
  }, [setModsInStore]);

  return null
}

function HandleEscape(resetAllSelected: Function) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetAllSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetAllSelected]);

  return null
}

function HandleCtrlZ(selectBundle: hoverStore, unitMap: UnitMap, trueRootId: string) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey; // metaKey for Mac
      const isShift = e.shiftKey;
      const key = e.key.toLowerCase();
  
      const { undo, redo } = useUnitStore.temporal.getState();
  
      if (isCtrl && key === 'z') {
        e.preventDefault();
        isShift ? redo() : undo();
      } else if (isCtrl && key === 'y') {
        e.preventDefault();
        redo();
      } else {
        return
      }

      const selectedId = processSelect(selectBundle.id, unitMap, trueRootId)
      if (!selectedId)
        selectBundle.call(undefined)
      else if (!unitMap[selectedId])
        selectBundle.call(undefined)
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unitMap, selectBundle, trueRootId]);
  
}

