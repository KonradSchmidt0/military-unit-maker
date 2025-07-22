import { UnitMap } from "../hooks/useUnitStore";
import { ChildrenList } from "./logic";

export function getSafeChildOptions(
  parentId: string,
  unitMap: UnitMap,
  palet: string[],
  alreadyChosenChildren: ChildrenList): UnitMap {
  const existingIds = new Set(Object.entries(alreadyChosenChildren).map((c) => c[0]));

  function createsCycle(candidateId: string): boolean {
    if (candidateId === parentId) return true;

    const candidate = unitMap[candidateId];
    if (!candidate || candidate.type !== "org") return false;

    for (const [childId] of Object.entries(candidate.children)) {
      if (createsCycle(childId)) return true;
    }

    return false;
  }

  return Object.fromEntries(
    palet
      .filter((id) => !existingIds.has(id) && !createsCycle(id))
      .map((id) => [id, unitMap[id]])
  );
}
