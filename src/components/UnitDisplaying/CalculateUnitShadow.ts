import { processSignature } from "../../hooks/useUnitInteractionsStore"
import { UnitMap } from "../../hooks/useUnitStore"
import { GetTrueColor } from "../../logic/childManaging"

export function calculateUnitShadow(
  mySignature: number[] | string,
  selectedSignature: number[] | string | undefined,
  unitMap: UnitMap,
  rootId: string,
  hoveredId: string | undefined
) {
  const isAnythingSelected = selectedSignature !== undefined
  const isAnythingHovered = hoveredId !== undefined

  const myId = processSignature(mySignature, unitMap, rootId)
  const selectedId = isAnythingSelected ? processSignature(selectedSignature, unitMap, rootId) : undefined

  const isSelectedInstance = 
                          isAnythingSelected && 
                          Array.isArray(selectedSignature) &&
                          mySignature.toString() === selectedSignature.toString()
  const isSelectedType = myId === selectedId && isAnythingSelected && !isSelectedInstance
  const isHovered = myId === hoveredId && !(isSelectedInstance || isSelectedType) && isAnythingHovered
  
  const color = GetTrueColor(mySignature, rootId, unitMap)
  
  // We use user choosen colors, so we're using raw styling, not .css/tailwind
  const shadowSize = isSelectedInstance ? "4px" : "2px"
  const shadowOpacityHex = isHovered ? "cc" : (isSelectedType || isSelectedInstance ? "dd" : "00")
  const shadowColor = isHovered ? "#888888" : color
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${shadowColor}${shadowOpacityHex}`

  return boxShadow
}