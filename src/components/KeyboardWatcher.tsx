import { useEffect } from "react";
import { useShortcutStore } from "../hooks/shortcutStore";
import { useUnitInteractionStore } from "../hooks/useUnitInteractionsStore";

export function KeyboardWatcher() {
  // Kill me
  // React, so you have to render handlers, cant just call
  return <>{HandleModifiers()}{HandleEscape()}</>; // It’s invisible, just for effect
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

