import { useGlobalStore } from "../../hooks/useGlobalStore";
import EditorBoxSwitch from "./EditorBoxSwitch";
import GlobalEditor from "./GlobalEditor";
import IndividualEditor from "./IndividualEditor";
import PalletEditor from "./PalletEditor";

export function EditorPanel() {
  const isPalletMini = useGlobalStore(s => s.isPalletMini)
  const setPalletMini = useGlobalStore(s => s.setIsPalletMini)
  const isGlobalMini = useGlobalStore(s => s.isGlobalMini)
  const setGlobalMini = useGlobalStore(s => s.setIsGlobalMini)

  // Handles that awkward edge when editorbox near the wall is empty, making border appear two times thicker
  const borderStyilling = !isPalletMini && !isGlobalMini ? "!border-1" : "!border-2"

  return (
  <div className="flex">
    <IndividualEditor/>
    {!isPalletMini && <PalletEditor/>}
    {!isGlobalMini && <GlobalEditor/>}
    <div className={`flex flex-col editor-box !w-fit ${borderStyilling}`}>
      {isPalletMini && <EditorBoxSwitch onClick={() => setPalletMini(false)}>🎨</EditorBoxSwitch>}
      {isGlobalMini && <EditorBoxSwitch onClick={() => setGlobalMini(false)}>⚙️</EditorBoxSwitch>}
    </div>
  </div>
  )
}