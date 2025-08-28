import { useRef, useEffect, useState } from "react";
import { UnitMap, useUnitStore } from "../../hooks/useUnitStore";
import { getEquipmentTable } from "../../logic/logic";
import { useDialogBoxStorage } from "../../hooks/useDialogBoxStore";
import { useUnitInteractionStore } from "../../hooks/useUnitInteractionsStore";

const REMINDER_TIME_MINUTES = 8.5

export function EmptyUnitsInTreeSystem() {
  const { trueRootId, unitMap } = useUnitStore(s => s)
  const { setSelect } = useUnitInteractionStore(s => s)
  const { open } = useDialogBoxStorage(s => s)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [active, setActive] = useState(true)

  const callDialog = (emptyUnitId: string) => {
    console.log("Warning! Empty unit in the tree with id: " + emptyUnitId)
    open(
      "⚠️Warning!", 
      "There is a empty unit (without any equipment) in the tree",
      [
        {text: "Thanks! Please remind me later (" + Math.floor(REMINDER_TIME_MINUTES) + " min.)", action: () => {}},
        {text: "Thanks! Please dont remind me", action: () => setActive(false)},
        {text: "Thanks! Please take me to it", action: () => setSelect(emptyUnitId)},
      ]
    )
  }

  useEffect(() => {
    if (!trueRootId) return

    if (!active) return

    const result = findEmptyUnitsInTree(trueRootId, unitMap)

    if (result) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          callDialog(result)
        }, REMINDER_TIME_MINUTES * 60 * 1000)
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [trueRootId, unitMap, active])

  return null
}

export function findEmptyUnitsInTree(unitId: string, unitMap: UnitMap): string | undefined {
  const eq = getEquipmentTable(unitId, unitMap)

  if (Object.entries(eq).length === 0) {
    return unitId
  }

  const unit = unitMap[unitId]

  if (unit.type !== "org") {
    return undefined
  }

  const childrenAsList = Object.entries(unit.children)
  let potentialEmptyChild = undefined
  for (const [childId, count] of childrenAsList) {
    const r = findEmptyUnitsInTree(childId, unitMap)
    if (r) {
      potentialEmptyChild = r
      break;
    }
  };

  return potentialEmptyChild ?? undefined
}