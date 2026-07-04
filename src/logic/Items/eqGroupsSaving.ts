import { EquipGroup, useEquipGroupingStore } from "../../hooks/useEquipGroupingStore";
import { SAVE_SYSTEM_VERSION } from "../ProjectSaving/saveSystem";

interface SaveFile {
  version: number;
  equipGroups: EquipGroup[];
}

function getSaveJSON(): string {
  const s: SaveFile = {
    // Version is kept the same as project, since user can load project files as eqGroups
    version: SAVE_SYSTEM_VERSION,
    equipGroups: useEquipGroupingStore.getState().groups
  }
  return JSON.stringify(s, null, 2)
}

function loadJSONObject(jsonString: string) {
  try {
    const json = JSON.parse(jsonString) as SaveFile;

    if (typeof json.version !== "number") {
      alert("Invalid save file: Missing version");
      return;
    }

    if (!json.equipGroups) {
      alert("File save does not include variable 'equipGroups'")
      return;
    }

    useEquipGroupingStore.setState({groups: json.equipGroups ?? []})
  } catch (err) {
    alert("Failed to load file: " + (err as Error).message);
  }
}

export function saveToFile(filename: string = "mysave.json") {
  const jsonString = getSaveJSON()
  const blob = new Blob([jsonString], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function loadUserSave(
  event: React.ChangeEvent<HTMLInputElement>,
) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      loadJSONObject(reader.result)
    }
  };

  reader.readAsText(file);
}