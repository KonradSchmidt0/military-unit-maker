import { usePaletStore } from "./hooks/usePaletStore";
import { UnitMap, useUnitStore } from "./hooks/useUnitStore";

// saveSystemVersion can help with future migrations
const SAVE_SYSTEM_VERSION = 1;

interface SaveFile {
  version: number;
  unitMap: UnitMap;
  unitPalet: string[]
  rootUnitId: string;
}

export function saveToFile() {
  const unitMap = useUnitStore.getState().unitMap;
  const rootUnitId = useUnitStore.getState().rootId;
  const unitPalet = usePaletStore.getState().unitPalet;

  const saveData: SaveFile = {
    version: SAVE_SYSTEM_VERSION,
    unitMap,
    unitPalet,
    rootUnitId,
  };

  const blob = new Blob([JSON.stringify(saveData, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mysave.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function handleLoadFile(
  event: React.ChangeEvent<HTMLInputElement>, setUnitMap: Function, setUnitPalet: Function, setRootId: Function)
   {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result as string) as SaveFile;

      if (typeof json.version !== "number") {
        alert("Invalid save file: Missing version");
        return;
      }

      // Potentially in the future: handle migrations based on version here
      setUnitPalet(json.unitPalet)
      // Bundle these two babies up so when ctrl z they are rolled back together, insted of sepparate
      setUnitMap(json.unitMap)
      setRootId(json.rootUnitId)
    } catch (err) {
      alert("Failed to load file: " + (err as Error).message);
    }
  };

  reader.readAsText(file);
}