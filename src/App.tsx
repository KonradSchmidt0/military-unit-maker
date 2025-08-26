import TreeView from './components/UnitDisplaying/TreeView';
import { useUnitStore } from './hooks/useUnitStore';
import { initialUnits } from './myUnits';
import { usePaletStore } from './hooks/usePaletStore';
import { KeyboardWatcher } from './systems/KeyboardWatcher';
import { useShortcutStore } from './hooks/shortcutStore';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useGlobalStore } from './hooks/useGlobalStore';
import ChangelogOverlay from './components/ChangeLog';
import ShortcutBox from './components/ShortcutBox';
import { EditorPanel } from './components/Editors/EditorPanel';
import IconDropdown from './components/IconDropdown';
import ArrowNavigation from './systems/ArrowNavigation';
import { HoverInspector } from './components/HoverInspector';
import { AutoSave } from './components/AutoSave';
import { LoadIconsCsv } from './systems/LoadIconsCsv';

usePaletStore.getState().setUnitPalet(["rifle_e", "rifle_o", "infatry_oo"])
useUnitStore.getState().setUnitMap(initialUnits);
useUnitStore.getState().setTrueRootId("infatry_oo");
useUnitStore.temporal.getState().clear()

function App() {
  const { actingRootPath } = useUnitStore(s => s)
  const displayDepth = useGlobalStore(s => s.foldingDepth)

  const disableSelection = useShortcutStore((s) => s.isShiftHeld) ? "select-none" : ""

  return (
    <div className={`flex dark:bg-bg dark:text-primary text-bg bg-primary ${disableSelection} transition-colors`}>
      {/* Systems */}
      <LoadIconsCsv/>
      <KeyboardWatcher />
      <AutoSave/>
      <ArrowNavigation/>

      {/* Overlays */}
      <HoverInspector/>
      <ChangelogOverlay/>
      <ShortcutBox/>
      <IconDropdown/>

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
