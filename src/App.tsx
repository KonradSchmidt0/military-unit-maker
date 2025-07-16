import TreeView from './components/TreeView';
import { useUnitStore } from './hooks/useUnitStore';
import { initialUnits } from './myUnits';
import { ChildrenList, OrgUnit } from './logic/logic';
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
  const updateUnit = useUnitStore(s => s.updateUnit)
  const setSelected = useUnitInteractionStore(s => s.setSelectedId)

  function popNewParentForRoot() {
    const oldRootUnit = unitMap[rootUnitId]
    const newRootId = crypto.randomUUID()
    // No idea why, but when i do it as children: {rootUnitId : 1} it reads rootUnitId as a string of value "rootUnitId"
    // No idea why
    let c: ChildrenList = { }
    c[rootUnitId] = 1

    const newRoot: OrgUnit = { 
      ...oldRootUnit,
      type: "org", name: "New Root Unit", echelonLevel: oldRootUnit.echelonLevel + 1,
      children: c
    }
    
    setSelected(newRootId)
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
        {/* <HoverInspector/> */}
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
