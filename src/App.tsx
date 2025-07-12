import { useState } from 'react';
import TreeView from './components/TreeView';
import HoverInspector from './components/HoverInspector';
import GlobalEditor from './components/GlobalEditor';
import IndividualEditor from './components/IndividualEditor';
import { useUnitStore } from './hooks/useUnitStore';
import { initialUnits } from './myUnits';

const baseUnitId = "infatry_oo"
useUnitStore.getState().setUnitMap(initialUnits);

function App() {
  const [hoveredUnitId, setHoveredUnit] = useState(undefined);

  const [selectedUnitCombine, setSelectedUnitCombine] = useState<{selectedId: string; parentId?: string; } | undefined>(undefined);
  // const setSelectedOnly = (unitId: string) => {
  //   setSelectedUnitCombine({selectedId: unitId, parentId: undefined});
  // };

  return (
    <div className="flex min-h-screen bg-slate-950 text-lime-200">
      {/* Left */}
      <div className="flex gap-4 p-4">
        <TreeView 
          unitId={baseUnitId}
          onHover={setHoveredUnit} 
          selectedUnitId={selectedUnitCombine?.selectedId} onNodeClick={setSelectedUnitCombine}
        />
        <HoverInspector unitId={hoveredUnitId}/>
      </div>

      {/* Right */}
      <div className="flex ml-auto">
        <IndividualEditor selectedUnitId={selectedUnitCombine?.selectedId}></IndividualEditor>
        <div className="border-slate-400 border-2 p-2">Pallet (WIP)</div>
        <GlobalEditor></GlobalEditor>
      </div>
    </div>
    )
}

export default App;
