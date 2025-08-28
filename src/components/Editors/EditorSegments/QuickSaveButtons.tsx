import { loadFromLocalStorage, saveToLocalStorage } from "../../systems/AutoSave";

interface props {

}

export function QuickSaveButtons(p: props) {
  function handleLoadRequest() {
    if (window.confirm("⚠️ Quick restoring has potential to overwrite your current progress. Continue?")) {
      loadFromLocalStorage();
    }
  }

  return (<>
    <button onClick={() => saveToLocalStorage()} className="btn-emoji">Quick💾</button>
    <button onClick={handleLoadRequest} className="btn-emoji">Quick⬇️💾</button>
  </>)
}