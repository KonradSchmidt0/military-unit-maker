import { useEffect } from "react";
import { useShortcutStore } from "../../hooks/shortcutStore";
import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";
import { useUnitStore, UnitMap } from "../../hooks/useUnitStore";

export function KeyboardWatcher() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)

  const resetAllSelected = useUnitInteractionStore((s) => s.resetSelected);

  // React, so you have to render handlers, cant just call
  return <>{HandleModifiers()}{HandleEscape(resetAllSelected)}{HandleCtrlZ(unitMap, trueRootId)}</>; // It’s invisible, just for effect
}

function HandleModifiers() {
  const setModsInStore = useShortcutStore((s) => s.setModifiers)

  useEffect(() => {
    const updateModifiers = (e: KeyboardEvent) => {
        setModsInStore({
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
            meta: e.metaKey,
        });
    };

    window.addEventListener("keydown", updateModifiers);
    window.addEventListener("keyup", updateModifiers);
    window.addEventListener("blur", () => setModsInStore({
        shift: false,
        ctrl: false,
        alt: false,
        meta: false,
    })
    );

    return () => {
        window.removeEventListener("keydown", updateModifiers);
        window.removeEventListener("keyup", updateModifiers);
        window.removeEventListener("blur", () => setModsInStore({
            shift: false,
            ctrl: false,
            alt: false,
            meta: false,
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

function HandleCtrlZ(unitMap: UnitMap, trueRootId: string) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
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
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unitMap, trueRootId]);
  
}

