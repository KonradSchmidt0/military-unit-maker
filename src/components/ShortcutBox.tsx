import { useShortcutStore } from "../hooks/shortcutStore";

export default function ShortcutBox() {
  const { isShiftHeld: shift, isCtrlHeld: ctrl, isAltHeld: alt } = useShortcutStore(s => s);

  const text = (
    <>
      {ctrl && !shift && <div>Select / Add key held</div>}
      {shift && !ctrl && <div>Remove key held</div>}
      {ctrl && shift && <div>Duplicate key held</div>}
      {alt && <div>Alt key held</div>}
    </>
  );

  const c = shift || ctrl || alt ? "bg-black/60" : "bg-black/0"

  return (
    <div className={"z-10 min-h-9 min-w-36 fixed bottom-4 left-4 text-white px-4 py-2 rounded-lg shadow-lg text-sm pointer-events-none select-none transition-colors " + c}>
      {text}
    </div>
  );
}

  