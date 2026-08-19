import TreeView from '../components/UnitDisplaying/TreeView';
import { useUnitStore } from '../hooks/useUnitStore';
import { usePaletStore } from '../hooks/usePaletStore';
import { useShortcutStore } from '../hooks/shortcutStore';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useGlobalStore } from '../hooks/useGlobalStore';
import { EditorPanel } from '../components/Editors/EditorPanel';
import IconDropdown from '../components/Overlays/MouseDropdowns/Implementations/IconDropdown';
import { AutoSave } from '../components/systems/AutoSave';
import ArrowNavigation from '../components/systems/ArrowNavigation';
import { KeyboardWatcher } from '../components/systems/KeyboardWatcher';
import { LoadIconsCsv } from '../components/systems/LoadIconsCsv';
import { EmptyUnitsInTreeSystem } from '../components/systems/EmptyUnitsInTreeSystem';
import UnitDropdown from '../components/Overlays/MouseDropdowns/Implementations/UnitDropdown';
import { GenerateInitialUnits } from '../logic/Units/myUnits';
import { HoverInspector } from '../components/Overlays/HoverInspector';
import TreeLineDrawing from '../components/UnitDisplaying/UnitTree/TreeLineDrawing';
import { useTreeLineStore } from '../hooks/useTreeLineStore';
import { useEffect } from 'react';
import { useThemeStore } from '../hooks/useThemeStore';
import ChangelogOverlay from '../components/Overlays/ChangeLog';
import { DialogBox } from '../components/Overlays/DialogBox';
import ShortcutBox from '../components/Overlays/ShortcutBox';
import ColorPalletDropdown from '../components/Overlays/MouseDropdowns/Implementations/ColorPalletDropdown';

const ini = GenerateInitialUnits()

useUnitStore.getState().setTrueRootId(ini.rootId);
usePaletStore.getState().setUnitPalet(ini.palet)
useUnitStore.getState().setUnitMap(ini.unitMap);
useUnitStore.temporal.getState().clear()

function App() {
  const { actingRootPath } = useUnitStore()
  const displayDepth = useGlobalStore(s => s.foldingDepth)
  const { rootRef } = useTreeLineStore()
  const {isDark} = useThemeStore();

  // Problem: User can hold shift to interact with units, but browser by default interprets shift as sign that you want to select text
  // Solution: We disable it, but only when shift is held, so user can still select text on page
  const disableSelection = useShortcutStore((s) => s.shift) ? "select-none" : ""

  const isMobile = "ontouchstart" in window

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className={`flex dark:bg-bg dark:text-primary text-bg bg-primary ${disableSelection} transition-colors`}>
      {/* Systems */}
      <LoadIconsCsv/>
      <KeyboardWatcher />
      <AutoSave/>
      <ArrowNavigation/>
      <EmptyUnitsInTreeSystem/>

      {/* Overlays */}
      {!isMobile && <HoverInspector/>}
      {!isMobile && <ShortcutBox/>}
      <ChangelogOverlay/>
      <DialogBox/>
      <IconDropdown/>
      <UnitDropdown/>
      <ColorPalletDropdown/>

      {/* Left */}
      <TransformWrapper minScale={0.1}>
        <TransformComponent wrapperClass='flex-1 min-h-screen max-h-screen'>
          <TreeLineDrawing/>
          <div className='pb-2 pt-8 px-40' ref={rootRef}>
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
