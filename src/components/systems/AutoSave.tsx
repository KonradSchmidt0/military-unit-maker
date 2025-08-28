import { useEffect } from "react";
import { getSaveFileJson, loadSaveFile } from "../../logic/saveSystem";

export function loadFromLocalStorage(
  key: string = "autosave")
{
  const jsonString = localStorage.getItem(key);
  if (jsonString) {
    loadSaveFile(jsonString);
  }
}

export function saveToLocalStorage(key: string = "autosave") {
  const jsonString = getSaveFileJson();
  localStorage.setItem(key, jsonString);
}

export function AutoSave({ intervalMs = 80_000 }: { intervalMs?: number }) {
  useEffect(() => {
    // On mount: load autosave
    loadFromLocalStorage();

    const interval = setInterval(() => {
      saveToLocalStorage();
      console.log("Autosaved at", new Date().toLocaleTimeString());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return null;
}