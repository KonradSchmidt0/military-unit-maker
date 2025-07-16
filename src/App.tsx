import TreeView from './components/TreeView';
import HoverInspector from './components/HoverInspector';
import { updateUnit, useUnitStore } from './hooks/useUnitStore';
import { initialUnits } from './myUnits';
import { OrgUnit } from './logic/logic';
import { usePaletStore } from './hooks/usePaletStore';
import { useUnitInteractionStore } from './hooks/useUnitInteractionsStore';
import { KeyboardWatcher } from './components/KeyboardWatcher';
import { useShortcutStore } from './hooks/shortcutStore';
import IndividualEditor from './components/Editors/IndividualEditor';
import PalletEditor from './components/Editors/PalletEditor';
import GlobalEditor from './components/Editors/GlobalEditor';

usePaletStore.getState().setUnitPalet(["rifle_e", "rifle_o", "infatry_oo"])
useUnitStore.getState().setUnitMap(initialUnits);
useUnitInteractionStore.getState().setRootId("infatry_oo");

function App() {
  const rootUnitId = useUnitInteractionStore((s) => s.rootId)
  const setRootUnitId = useUnitInteractionStore((s) => s.setRootId)
  const unitMap = useUnitStore(s => s.unitMap)

  function popNewParentForRoot() {
    const oldRootUnit = unitMap[rootUnitId]
    const newRootId = crypto.randomUUID()
    const newRoot: OrgUnit = { 
      ...oldRootUnit,
      type: "org", name: "New Root Unit", echelonLevel: oldRootUnit.echelonLevel + 1,
      children: [ { unitId: rootUnitId, count: 1 }  ] 
    }
    updateUnit(newRootId, newRoot)
    setRootUnitId(newRootId)
  }

  const disableSelection = useShortcutStore((s) => s.isShiftHeld) ? "select-none" : ""

  return (
    <div className={`flex min-h-screen bg-bg text-primary ${disableSelection}`}>
      <KeyboardWatcher />

      {/* Left */}
      <div className="flex gap-4 p-4">
        <TreeView unitId={rootUnitId}/>
        <HoverInspector/>
      </div>

      {/* Right */}
      <div className="flex ml-auto">
        <IndividualEditor popNewParentForRoot={popNewParentForRoot} />
        <PalletEditor/>
        <GlobalEditor/>
      </div>
    </div>
    )
}

export default App;
