import TreeView from './components/TreeView';
import { useUnitStore } from './hooks/useUnitStore';
import { initialUnits } from './myUnits';
import { usePaletStore } from './hooks/usePaletStore';
import { KeyboardWatcher } from './components/KeyboardWatcher';
import { useShortcutStore } from './hooks/shortcutStore';
import IndividualEditor from './components/Editors/IndividualEditor';
import PalletEditor from './components/Editors/PalletEditor';
import GlobalEditor from './components/Editors/GlobalEditor';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useGlobalStore } from './hooks/useGlobalStore';

usePaletStore.getState().setUnitPalet(["rifle_e", "rifle_o", "infatry_oo"])
useUnitStore.getState().setUnitMap(initialUnits);
useUnitStore.getState().setRootId("infatry_oo");
useUnitStore.temporal.getState().clear()

function App() {
  const rootUnitId = useUnitStore(s => s.rootId)
  const displayDepth = useGlobalStore(s => s.foldingDepth)

  const disableSelection = useShortcutStore((s) => s.isShiftHeld) ? "select-none" : ""

  return (
    <div className={`flex bg-bg text-primary ${disableSelection}`}>
      <KeyboardWatcher />

      {/* Left */}
      <TransformWrapper minScale={0.1}>
        <TransformComponent wrapperClass='flex-1 min-h-screen max-h-screen'>
          <TreeView unitId={rootUnitId} leftDisplayDepth={displayDepth}/>
        </TransformComponent>
      </TransformWrapper>

      {/* Right */}
      <div className="flex">
        <IndividualEditor/>
        <PalletEditor/>
        <GlobalEditor/>
      </div>
    </div>
    )
}

export default App;
