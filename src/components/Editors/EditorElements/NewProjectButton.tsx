import { usePaletStore } from "../../../hooks/usePaletStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { createNewOrgUnit } from "../../../logic/logic";

interface props {

}

export function NewProjectButton(p: props) {
  function handleClick() {
    if (!window.confirm("⚠️Warning! Creating a new project without saving will remove all of your progress. Remeber to save if youre working on something important!")) {
      return
    }

    const newRoot = createNewOrgUnit({echelonLevel: 3})
    const newRootId = crypto.randomUUID()

    useUnitStore.getState().setTrueRootId(newRootId);
    usePaletStore.getState().setUnitPalet([])
    useUnitStore.getState().setUnitMap({[newRootId]: newRoot});
  }

  return <button className="btn-emoji" onClick={handleClick}>🆕Project!</button>
}