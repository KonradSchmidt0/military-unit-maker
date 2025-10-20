import { useGlobalStore } from '../hooks/useGlobalStore';
import { ExtrnlLink } from './ExtrnlLink';

export default function ChangelogOverlay() {
  const isMini = useGlobalStore(s => s.isChangeLogMini)
  const setMini = useGlobalStore(s => s.setIsChangeLogMini)

  if (isMini) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="dark:bg-bg bg-primary w-full max-w-2xl max-h-[80vh] rounded-xl shadow-lg p-6 relative overflow-y-auto">
        <button
          className="absolute top-4 right-4 btn-emoji"
          onClick={() => setMini(true)}
        >
          ❌
        </button>

        <h2 className="text-2xl font-bold mb-4">Changelog 📣🛠️</h2>
        <div className="space-y-4 text-sm">
          <b className='text-base'>The project is not dead! (2025 10 20)</b><br/>
          I just had a lot of things to do outiside of it and also was reasearching a Stryker Brigade to show off the project!<br/>
          You can download it <ExtrnlLink link='https://github.com/KonradSchmidt0/military-unit-maker?tab=readme-ov-file'>here</ExtrnlLink>! (File called SBCT.json)<br/>
           - Added new icons (<ExtrnlLink link='https://www.battleorder.org/icons'>BattleOrder</ExtrnlLink>)<br/>
          <br/>

          <b className='text-base'>Small changes (2025 9 15)</b><br/>
           - Added more hoverables in unit editor, so user can better understand what elements do what<br/>
           - UX fix: When unit is force folded, but also is a temporary root, it dosen't fold now<br/>
           - UX fix: All descriptions are now large input fields<br/>
           - Other minor UX enhancements<br/>
           - Fix: If unit has zero children then it properlly gets classified as "c". Meaning the tree should collaps better now<br/>
           - Added new icons (BattleOrder)<br/>
          <br/>

          <b className='text-base'>Hovertool reborn (2025 9 09) </b> <br/>
           - New hovertool that dosent spill<br/> 
           - Begun implementing alts for buttons, so you can hover them and get description of what they do<br/>
           - Added: Options now autosave<br/>
           - Change: Units now automatically get added to pallet<br/>
           - Fixed: Dialog box now dosen't spill on mobile<br/>
          <br/>

          <b className='text-base'>Better unit picker! (2025 9 05) </b> <br/>
           - Temporally removed Hover Inspector (too much spilling)<br/>
           - Added unit dropdown, so no more dealing with just names, you can actully see the units now<br/>
           - Tidyup ux related to mod keys<br/>
           - <ExtrnlLink link='https://www.battleorder.org/icons'>Added few more icons</ExtrnlLink> mostly modifires<br/>
          <br/>

          <b className='text-base'>Empty units in tree warning (2025 8 28)</b><br/>
           - Added a system that detects and informs if theres a empty unit in the tree (can be turned off)<br/>
           - Added new project button<br/>
           - Minor UI changes (changed few emojis)<br/>
           - Fixed: Bug with previously selected unit description staying in editor<br/>
           - Fixed: Quick save now works correctly<br/>
           - Fixed: White units 'selection shadow' is now visible also in light mode<br/>
          <br/>

          <b className='text-base'>Mostly internal cleanup (2025 8 26)</b><br/>
           - Fixed bug with eq count being set to NaN when fully backspacing<br/>
           - EQ name now gets trimmed (removed spaces from front and end) when inputing its name<br/>
           - Added firefighting and pioneers icons (credits battleorder)<br/>
          <br/>
          
          <b className='text-base'>Autosaving (2025 8 24)</b><br/>
           - Added local save, stored in the browser. Mostly used for autosave<br/>
           - The local save automatically gets loaded when page is loaded<br/>
           - Added autosave system that saves automatically every 1.5 minute or so<br/>
           - Added abillity for user to manually do the autosave, and mannually load it<br/>
           - Added few new icon, mostly size (med, heavy, light, super heavy)<br/>
           - Fixed: Staff names are now saved and loaded<br/>
           - Fixed bug with program crashing when removing parent<br/>
           - Minor ui changes<br/>
          <br/>
          
          <b className='text-base'>Force folding/unfolding! (2025 8 21)</b><br/>
           - Added abillity to force some units to unfold/fold<br/>
           - Added abillity to reset temporary root from global editor<br/>
           - Minor visual bugs fixed<br/>
          <br/>
          
          <b className='text-base'>Unit Text Stacking (2025 8 17)</b><br/>
          - Texts now displays when units are stacked<br/>
          - Minor bugs fixed<br/>
          <br/>

          <b className='text-base'>Idk man im tired (2025 8 16)</b><br/>
          - Diffrent echelon styles<br/>
          - Minor UX improvements<br/>
          - Minor visual bugs fixed<br/>
          - Added abillity to hide unit texts<br/>
          <br/>

          <b className='text-base'>Staff Names (2025 8 12)</b><br/>
          - Added Staff Names. Very usefull if youre naming 'named' units (eg. 123rd infantry division), not just a alpha numeric designation from the parent<br/>
          - UX upgrades for mobile<br/>
          - Fixed bug with setting child count to not a number<br/>
          - UX upgrades for handling children in Editor window<br/>
          - Better UI for handling unit texts<br/>
          - Unit Text now truncates on display if too long<br/>
          <br/>

          <b className='text-base'>Parent Comments (2025 8 08)</b><br/>
           - Added abillity for parents to assign descriptions and callsigns to subunits<br/>
           - Fixed and reworked color changing for HQ icon<br/>
           - Added stacking<br/>
           - <ExtrnlLink link='https://www.battleorder.org/icons'>Added few more icons</ExtrnlLink><br/>
           - Unlinking now selects tree node, not just unit type<br/>
           - Added abillity to add multiple items in one promp by using commas<br/>
           - Fixed bug with entering item names ending with number<br/>
           - Fixed dark mode automatically turning on when opening global editor<br/>
          <br/>

          <b className='text-base'>Unit type texts (2025 8 04)</b><br/>
           - Added unit type names and descriptions<br/>
           - Added visual diffrence for when selecting a unit and a node<br/>
           - <ExtrnlLink href='https://www.battleorder.org/icons' txt="Added amphibious and costal modifire icons"/><br/>
          <br/>

          <b className='text-base'>Better Layer Picker (2025 8 03)</b><br/>
           - Added new dropdown for layers, which gives a preview and allows to search based on tags<br/>
           - <ExtrnlLink href='https://www.youtube.com/channel/UCn6_Kza6erL9GCAhOpQLfBg'>Added few new icons</ExtrnlLink> (some even original)<br/>
           - Added staff comments<br/>
           - Added arrow navigation<br/>
           - Added light mode<br/>
           - Added infrastructure for future parent comments, unit descriptions and parent given codenames<br/>
           - Readded folding by echelon<br/>
           - Tree display should be better now<br/>
          Still alive and kicking ;)<br/>
          <br/>

          <b className='text-base'>Temporary Roots (2025 7 24)</b><br/>
           - Added ActingRoot (temporary, for when you want to focus only on smaller unit)<br/>
           - Added shortcut highlight<br/>
           - Added org unit consolidation<br/>
          <br/>

          <b className='text-base'>Editor Boxes minimizing (2025 7 23)</b><br/>
           - Added Editor minimaiziziziataion<br/>
           - Added changelog<br/>
           - Abillity to add allready existing children from the pallet<br/>
           - Added preview of current unit visual<br/>
          <br/>

          <b className='text-base'>Echelon visualization reworked (2025 7 22)</b><br/>

           - Echelons are finally not an text, but actuall <ExtrnlLink href='https://www.battleorder.org/icons'>icons</ExtrnlLink><br/>
           - Lack of echelons dosent affect styling anymore!<br/>
           - Added new icons (Creddits <ExtrnlLink href='https://www.youtube.com/channel/UCn6_Kza6erL9GCAhOpQLfBg'>BattleOrder</ExtrnlLink>)<br/>
           - Kinda fixed TreeView while also accidentally in the proces removing echelon folding<br/>
           - Added abillity to split raw units into org with child, children inheret the eq<br/>
        </div>
      </div>
    </div>
  );
}
