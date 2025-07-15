import { useEffect } from 'react';
import TreeView from './components/TreeView';
import HoverInspector from './components/HoverInspector';
import GlobalEditor from './components/GlobalEditor';
import IndividualEditor from './components/IndividualEditor';
import { updateUnit, useUnitStore } from './hooks/useUnitStore';
import { initialUnits } from './myUnits';
import { OrgUnit } from './logic/logic';
import PalletEditor from './components/PalletEditor';
import { usePaletStore } from './hooks/usePaletStore';
import { useUnitInteractionStore } from './hooks/useUnitInteractionsStore';

usePaletStore.getState().setUnitPalet(["rifle_e", "rifle_o", "infatry_oo"])
useUnitStore.getState().setUnitMap(initialUnits);
useUnitInteractionStore.getState().setRootId("infatry_oo");

function App() {
  // Event Handler
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

  // Actual Stuff
  const rootUnitId = useUnitInteractionStore((s) => s.rootId)
  const setRootUnitId = useUnitInteractionStore((s) => s.setRootId)

  function popNewParentForRoot() {
    const newRootId = crypto.randomUUID()
    const newRoot: OrgUnit = { type: "org", name: "New Root Unit", children: [ { unitId: rootUnitId, count: 1 }  ] }
    updateUnit(newRootId, newRoot)
    setRootUnitId(newRootId)
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-lime-200">
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
