import TreeView from './components/TreeView';
import { useUnitStore } from './hooks/useUnitStore';
import { initialUnits } from './myUnits';
import { usePaletStore } from './hooks/usePaletStore';
import { KeyboardWatcher } from './components/KeyboardWatcher';
import { useShortcutStore } from './hooks/shortcutStore';
import IndividualEditor from './components/Editors/IndividualEditor';
import PalletEditor from './components/Editors/PalletEditor';
import GlobalEditor from './components/Editors/GlobalEditor';

usePaletStore.getState().setUnitPalet(["rifle_e", "rifle_o", "infatry_oo"])
useUnitStore.getState().setUnitMap(initialUnits);
useUnitStore.getState().setRootId("infatry_oo");
useUnitStore.temporal.getState().clear()

function App() {
  const rootUnitId = useUnitStore(s => s.rootId)

  const disableSelection = useShortcutStore((s) => s.isShiftHeld) ? "select-none" : ""

  return (
    <div className={`flex min-h-screen bg-bg text-primary ${disableSelection}`}>
      <KeyboardWatcher />

      {/* Left */}
      <div className="flex gap-4 p-4">
        <TreeView unitId={rootUnitId}/>
        {/* <HoverInspector/> */}
      </div>

      {/* Right */}
      <div className="flex ml-auto">
        <IndividualEditor/>
        <PalletEditor/>
        <GlobalEditor/>
      </div>
    </div>
    )
}

export default App;
