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
          <b className='text-base'>Idk man im tired (2025 8 )</b><br/>
          - Diffrent echelon styles<br/>
          - Minor UX improvements<br/>
          - Minor visual bugs fixed<br/>
          - Added abillity to hide unit texts<br/>
          <br/>

          <b className='text-base'>Parent Comments (2025 8 12)</b><br/>
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
