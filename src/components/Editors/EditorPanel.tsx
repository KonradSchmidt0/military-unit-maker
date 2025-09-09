import { useGlobalStore } from "../../hooks/useGlobalStore";
import EditorBoxSwitch from "./EditorBoxSwitch";
import GlobalEditor from "./GlobalEditor";
import IndividualEditor from "./IndividualEditor";
import PalletEditor from "./PalletEditor";

export function EditorPanel() {
  const { isPalletMini, setIsPalletMini, isGlobalMini, setIsGlobalMini } = useGlobalStore();

  // Handles that awkward edge when editorbox near the wall is empty, making border appear two times thicker
  const borderStyilling = !isPalletMini && !isGlobalMini ? "!border-1" : "!border-2"

  return (
  <div className="flex">
    <IndividualEditor/>
    {!isPalletMini && <PalletEditor/>}
    {!isGlobalMini && <GlobalEditor/>}
    <div className={`flex flex-col editor-box !w-fit ${borderStyilling}`}>
      {isPalletMini && <EditorBoxSwitch onClick={() => setIsPalletMini(false)}>🎨</EditorBoxSwitch>}
      {isGlobalMini && <EditorBoxSwitch onClick={() => setIsGlobalMini(false)}>⚙️</EditorBoxSwitch>}
    </div>
  </div>
  )
}