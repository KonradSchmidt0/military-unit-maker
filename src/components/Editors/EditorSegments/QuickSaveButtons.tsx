import { loadFromLocalStorage, saveToLocalStorage } from "../../AutoSave";

interface props {

}

export function QuickSaveButtons(p: props) {
  function handleLoadRequest() {
    if (window.confirm("⚠️ Quick load will overwrite your current progress. Continue?")) {
      loadFromLocalStorage();
    }
  }

  return (<>
    <button onClick={() => saveToLocalStorage} className="btn-emoji">Quick💾</button>
    <button onClick={handleLoadRequest} className="btn-emoji">Quick⬇️💾</button>
  </>)
}