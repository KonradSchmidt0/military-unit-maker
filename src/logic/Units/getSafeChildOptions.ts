import { UnitMap } from "../../hooks/useUnitStore";
import { ChildEntry } from "./logic";

export function getSafeChildOptions(
  parentId: string,
  unitMap: UnitMap,
  palet: string[],
  alreadyChosenChildren: ChildEntry[]): UnitMap {
  const existingIds = new Set(Object.entries(alreadyChosenChildren).map((c) => c[0]));

  function createsCycle(candidateId: string): boolean {
    if (candidateId === parentId) return true;

    const candidate = unitMap[candidateId];
    if (!candidate || candidate.type !== "org") return false;

    for (const e of candidate.children) {
      if (createsCycle(e.id)) return true;
    }

    return false;
  }

  return Object.fromEntries(
    palet
      .filter((id) => !existingIds.has(id) && !createsCycle(id))
      .map((id) => [id, unitMap[id]])
  );
}
