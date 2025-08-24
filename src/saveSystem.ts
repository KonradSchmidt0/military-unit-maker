import { StaffText, useGlobalStore } from "./hooks/useGlobalStore";
import { usePaletStore } from "./hooks/usePaletStore";
import { UnitMap, useUnitStore } from "./hooks/useUnitStore";

// saveSystemVersion can help with future migrations
const SAVE_SYSTEM_VERSION = 5;

interface SaveFile {
  version: number;
  unitMap: UnitMap;
  unitPalet: string[];
  rootUnitId: string;
  staffComments: StaffText[];
  staffNames: StaffText[];
}

export function getSaveFileJson(): string {
  const unitMap = useUnitStore.getState().unitMap;
  const rootUnitId = useUnitStore.getState().trueRootId;
  const unitPalet = usePaletStore.getState().unitPalet;
  const staffComments = useGlobalStore.getState().staffComments;
  const staffNames = useGlobalStore.getState().staffNames;

  const saveData: SaveFile = {
    version: SAVE_SYSTEM_VERSION,
    unitMap,
    unitPalet,
    rootUnitId,
    staffComments,
    staffNames
  };

  return JSON.stringify(saveData, null, 2);
}

export function saveToFile(filename: string = "mysave.json") {
  const jsonString = getSaveFileJson();
  const blob = new Blob([jsonString], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


export function loadSaveFile(
  jsonString: string,
) {
  try {
    const json = JSON.parse(jsonString) as SaveFile;

    if (typeof json.version !== "number") {
      alert("Invalid save file: Missing version");
      return;
    }

    let unitMap = { ...json.unitMap };
    if (json.version <= 2) {
      unitMap = swapLayerSubstrings(
        unitMap,
        "/icons/",
        `${process.env.PUBLIC_URL}/icons/`
      );
    }

    usePaletStore.setState({unitPalet: json.unitPalet})
    useUnitStore.setState({unitMap: unitMap, trueRootId: json.rootUnitId})
    useGlobalStore.setState({staffComments: json.staffComments ?? [], staffNames: json.staffNames ?? []})
  } catch (err) {
    alert("Failed to load file: " + (err as Error).message);
  }
}

export function loadUserSaveFile(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      loadSaveFile(reader.result);
    }
  };

  reader.readAsText(file);
}


function swapLayerSubstrings(unitMap: UnitMap, a: string, b: string): UnitMap {
  const updatedMap: UnitMap = {};

  for (const [unitId, unit] of Object.entries(unitMap)) {
    const newLayers = unit.layers.map(layer => layer.replaceAll(a, b));

    // Copy the rest of the unit data and overwrite layers
    updatedMap[unitId] = {
      ...unit,
      layers: newLayers,
    };
  }

  return updatedMap;
}