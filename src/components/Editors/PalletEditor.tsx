import { useGlobalStore } from "../../hooks/useGlobalStore";
import ColorPalletSegment from "./EditorSegments/PalletSegments/ColorPalletSegment";
import UnitPalletSegment from "./EditorSegments/PalletSegments/UnitPalletSegment";

export default function PalletEditorSegment() {
  const setPalletMini = useGlobalStore(s => s.setIsPalletMini)

  return (
    <div className="editor-box">
      <div className="editor-segment-header">
        <div className="absolute left-1/2 -translate-x-1/2">
          PALLETS 🎨
        </div>
        <button className="btn-emoji !p-0 ml-auto" onClick={() => setPalletMini(true)}>❌</button>
      </div>

      <div className="overflow-auto">
        <UnitPalletSegment/>
        <ColorPalletSegment/>
      </div>
    </div>
  );
}

