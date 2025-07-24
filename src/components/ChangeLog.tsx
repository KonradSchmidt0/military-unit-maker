import { useGlobalStore } from '../hooks/useGlobalStore';

export default function ChangelogOverlay() {
  const isMini = useGlobalStore(s => s.isChangeLogMini)
  const setMini = useGlobalStore(s => s.setIsChangeLogMini)

  if (isMini) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-bg w-full max-w-2xl max-h-[80vh] rounded-xl shadow-lg p-6 relative overflow-y-auto">
        <button
          className="absolute top-4 right-4 btn-emoji"
          onClick={() => setMini(true)}
        >
          ❌
        </button>

        <h2 className="text-2xl font-bold mb-4">Changelog 📣🛠️</h2>

        <div className="space-y-4 text-sm">
          <b className='text-base'>Editor Boxes minimizing (25 july 23)</b><br/>
           - Added Editor minimaiziziziataion<br/>
           - Added changelog<br/>
           - Abillity to add allready existing children from the pallet<br/>
           - Added preview of current unit visual<br/>
          <br/>

          <b className='text-base'>Echelon visualization reworked (25 july 22)</b><br/>

           - Echelons are finally not an text, but actuall <a href='https://www.battleorder.org/icons' target='_blank'>icons</a><br/>
           - Lack of echelons dosent affect styling anymore!<br/>
           - Added new icons (Creddits <a href='https://www.youtube.com/channel/UCn6_Kza6erL9GCAhOpQLfBg' target='_blank'>BattleOrder</a>)<br/>
           - Kinda fixed TreeView while also accidentally in the proces removing echelon folding<br/>
           - Added abillity to split raw units into org with child, children inheret the eq<br/>
        </div>
      </div>
    </div>
  );
}
