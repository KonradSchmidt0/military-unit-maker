import { processSignature } from "../../hooks/useUnitInteractionsStore"
import { UnitMap } from "../../hooks/useUnitStore"
import { GetTrueColor } from "../../logic/childManaging"

export function calculateUnitShadow(
  mySignature: number[] | string,
  selectedSignature: number[] | string | undefined,
  unitMap: UnitMap,
  rootId: string,
  hoveredId: string | undefined,
  isDarkMode: boolean
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

  if (!(isSelectedInstance || isSelectedType || isHovered)) {
    return undefined
  }
  
  const color = GetTrueColor(mySignature, rootId, unitMap)

  // Problem: If we're in lightmode the background is white, which if unit is white makes the shadow almost imposible to see
  // Solution: If the color is too bright we turn it gray
  let overrideUnitColorCusLightmode = undefined
  if (!isDarkMode) {
    const match = color.match(/\w\w/g);
    if (!match) throw new Error("Invalid color format");
    const [rC, gC, bC] = match.map(c => parseInt(c, 16));
    if (Math.min(rC, gC, bC) > 170) {
      overrideUnitColorCusLightmode = "#888888"
    }
  }
  
  // We use user choosen colors, so we're using raw styling, not .css/tailwind
  const shadowSize = isSelectedInstance ? "3.5px" : "2px"
  const shadowOpacityHex = isSelectedInstance ? "dd" : isSelectedType ? "cc" : isHovered ? "aa" : "00"
  const shadowColor = isHovered ? "#888888" : overrideUnitColorCusLightmode ?? color
  const boxShadow = `0 0 ${shadowSize} ${shadowSize} ${shadowColor}${shadowOpacityHex}`

  return boxShadow
}