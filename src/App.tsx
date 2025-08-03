import TreeView from './components/UnitDisplaying/TreeView';
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
import ArrowNavigation from './components/ArrowNavigation';

usePaletStore.getState().setUnitPalet(["rifle_e", "rifle_o", "infatry_oo"])
useUnitStore.getState().setUnitMap(initialUnits);
useUnitStore.getState().setTrueRootId("infatry_oo");
useUnitStore.temporal.getState().clear()

function App() {
  const { actingRootPath } = useUnitStore(s => s)
  const displayDepth = useGlobalStore(s => s.foldingDepth)

  const setIcons = useIconsStore(s => s.setIcons);
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/icons.csv`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch CSV');
        }
        const txt = response.text() 
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
    <div className={`flex dark:bg-bg dark:text-primary text-bg bg-primary ${disableSelection} transition-colors`}>
      {/* Systems */}
      <KeyboardWatcher />
      <ChangelogOverlay/>
      <ShortcutBox/>
      <IconDropdown/>
      <ArrowNavigation/>

      {/* Left */}
      <TransformWrapper minScale={0.1}>
        <TransformComponent wrapperClass='flex-1 min-h-screen max-h-screen'>
          <div className='pb-2 pt-8 px-6'>
            <TreeView path={actingRootPath} leftDisplayDepth={displayDepth}/>
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Right */}
      <EditorPanel/>
    </div>
    )
}

export default App;
