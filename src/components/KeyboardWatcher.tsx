import { useEffect } from "react";
import { useShortcutStore } from "../hooks/shortcutStore";
import { SelectUnitBundle, useSelectUnitBundle, useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";
import { UnitMap, useUnitStore } from "../hooks/useUnitStore";

export function KeyboardWatcher() {
  const selectBundle = useSelectUnitBundle()
  const unitMap = useUnitStore(s => s.unitMap)

  // Kill me
  // React, so you have to render handlers, cant just call
  return <>{HandleModifiers()}{HandleEscape()}{HandleCtrlZ(selectBundle, unitMap)}</>; // It’s invisible, just for effect
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

function HandleEscape() {
  const resetAllSelected = useUnitInteractionStore((s) => s.resetSelected);
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

function HandleCtrlZ(selectBundle: SelectUnitBundle, unitMap: UnitMap) {
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

      if (!unitMap[selectBundle.selectedId ?? ""])
        selectBundle.resetSelected()
      else if (!unitMap[selectBundle.selected_parentId ?? ""])
        selectBundle.setOnlySelectedId(selectBundle.selectedId as string)
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unitMap, selectBundle]);
  
}

