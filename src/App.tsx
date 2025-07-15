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

  const [selectedUnitCombine, setSelectedUnitCombine] = useState < {selectedId: string; parentId?: string; } | undefined> (undefined);
  function setSelected_NotTouchingParent(newSelectedId: string) {
    setSelectedUnitCombine((prev) => {
      if (prev === undefined) {
        return { selectedId: newSelectedId }; // no parentId to preserve
      }
      return {
        selectedId: newSelectedId,
        parentId: prev.parentId,
      };
    });
  }

  const unitMap = useUnitStore((state) => state.unitMap);

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
        <IndividualEditor selectedUnitId={selectedUnitCombine?.selectedId} setSelected_NotTouchingParent={setSelected_NotTouchingParent} selectedUnitParentId={selectedUnitCombine?.parentId}></IndividualEditor>
        <div className="editor-box !border-r-0">
          {/* Very WIP! */}
          <h2>All Units</h2>
          <ul>
            {Object.entries(unitMap).map(([id, unit]) => (
              <li key={id}>
                {unit.name} ({id})
              </li>
            ))}
          </ul>
        </div>
        <GlobalEditor></GlobalEditor>
      </div>
    </div>
    )
}

export default App;
