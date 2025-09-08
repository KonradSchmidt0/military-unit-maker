import TreeView from './components/UnitDisplaying/TreeView';
import { useUnitStore } from './hooks/useUnitStore';
import { usePaletStore } from './hooks/usePaletStore';
import { useShortcutStore } from './hooks/shortcutStore';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useGlobalStore } from './hooks/useGlobalStore';
import ChangelogOverlay from './components/ChangeLog';
import ShortcutBox from './components/ShortcutBox';
import { EditorPanel } from './components/Editors/EditorPanel';
import IconDropdown from './components/IconDropdown';
import { AutoSave } from './components/systems/AutoSave';
import ArrowNavigation from './components/systems/ArrowNavigation';
import { KeyboardWatcher } from './components/systems/KeyboardWatcher';
import { LoadIconsCsv } from './components/systems/LoadIconsCsv';
import { DialogBox } from './components/DialogBox';
import { EmptyUnitsInTreeSystem } from './components/systems/EmptyUnitsInTreeSystem';
import UnitDropdown from './components/UnitDropdown';
import { GenerateInitialUnits } from './myUnits';
import { HoverInspector } from './components/HoverInspector';

const ini = GenerateInitialUnits()

useUnitStore.getState().setTrueRootId(ini.rootId);
usePaletStore.getState().setUnitPalet(ini.palet)
useUnitStore.getState().setUnitMap(ini.unitMap);
useUnitStore.temporal.getState().clear()

function App() {
  const { actingRootPath } = useUnitStore(s => s)
  const displayDepth = useGlobalStore(s => s.foldingDepth)

  // Problem: User can hold shift to interact with units, but browser by default interprets shift as sign that you want to select text
  // Solution: We disable it, but only when shift is held, so user can still select text on page
  const disableSelection = useShortcutStore((s) => s.shift) ? "select-none" : ""

  return (
    <div className={`flex dark:bg-bg dark:text-primary text-bg bg-primary ${disableSelection} transition-colors`}>
      {/* Systems */}
      <LoadIconsCsv/>
      <KeyboardWatcher />
      <AutoSave/>
      <ArrowNavigation/>
      <EmptyUnitsInTreeSystem/>

      {/* Overlays */}
      <HoverInspector/>
      <ChangelogOverlay/>
      <ShortcutBox/>
      <IconDropdown/>
      <DialogBox/>
      <UnitDropdown/>

      {/* Left */}
      <TransformWrapper minScale={0.1}>
        <TransformComponent wrapperClass='flex-1 min-h-screen max-h-screen'>
          <div className='pb-2 pt-8 px-40'>
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
