import TreeView from './components/TreeView';
import { useUnitStore } from './hooks/useUnitStore';
import { initialUnits } from './myUnits';
import { usePaletStore } from './hooks/usePaletStore';
import { KeyboardWatcher } from './components/KeyboardWatcher';
import { useShortcutStore } from './hooks/shortcutStore';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useGlobalStore } from './hooks/useGlobalStore';
import ChangelogOverlay from './components/ChangeLog';
import ShortcutBox from './components/ShortcutBox';
import { EditorPanel } from './components/Editors/EditorPanel';
import { useEffect } from 'react';
import { IconEntry, useIconsStore } from './hooks/useIcons';
import Papa from 'papaparse';
import IconDropdown from './components/IconDropdown';

usePaletStore.getState().setUnitPalet(["rifle_e", "rifle_o", "infatry_oo"])
useUnitStore.getState().setUnitMap(initialUnits);
useUnitStore.getState().setTrueRootId("infatry_oo");
useUnitStore.temporal.getState().clear()

function App() {
  const { trueRootId, actingRootId } = useUnitStore(s => s)
  const rootUnitId = useUnitStore(s => s.getCurrentRootId)(trueRootId, actingRootId)

  const displayDepth = useGlobalStore(s => s.foldingDepth)

  const setIcons = useIconsStore(s => s.setIcons);
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/icons.csv`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch CSV');
        }
        const txt = response.text() 
        console.log(txt)
        return txt;
      })
      .then((csvText) => {
        const result = Papa.parse<IconEntry>(csvText, { header: true });
        setIcons(result.data);
      })
      .catch((error) => {
        console.error('Error loading CSV:', error);
      });
  }, []);

  const disableSelection = useShortcutStore((s) => s.isShiftHeld) ? "select-none" : ""

  return (
    <div className={`flex bg-bg text-primary ${disableSelection}`}>
      {/* Systems */}
      <KeyboardWatcher />
      <ChangelogOverlay/>
      <ShortcutBox/>
      <IconDropdown/>

      {/* Left */}
      <TransformWrapper minScale={0.1}>
        <TransformComponent wrapperClass='flex-1 min-h-screen max-h-screen'>
          <TreeView unitId={rootUnitId} leftDisplayDepth={displayDepth}/>
        </TransformComponent>
      </TransformWrapper>

      {/* Right */}
      <EditorPanel/>
    </div>
    )
}

export default App;
