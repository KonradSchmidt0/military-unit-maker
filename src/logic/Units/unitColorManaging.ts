import { ColorMap, getColorFromColorMap } from "../../hooks/useColorPalletStore"
import { UnitMap } from "../../hooks/useUnitStore"
import { GetChildIdFromPath } from "./childManaging"
import { SmartColor, defaultUnitColor } from "./logic"

export function getColorInVoid(sc: SmartColor, colorMap: ColorMap): `#${string}` {
  if (sc === "inheret") {
    return defaultUnitColor
  }
  if (typeof sc === "string") {
    return sc
  }
  return getColorFromColorMap(sc, colorMap)
}

export function GetTrueColorRecursively(rootId: string, path: number[], unitMap: UnitMap, colorMap: ColorMap): `#${string}` {
  if (path.length <= 0) {
    const root = unitMap[rootId];
    return getColorInVoid(root.smartColor, colorMap);
  }
  const unitId = GetChildIdFromPath(rootId, path, unitMap);
  if (!unitId) {
    return defaultUnitColor;
  }
  const unit = unitMap[unitId];
  if (unit.smartColor !== "inheret") {
    return getColorInVoid(unit.smartColor, colorMap);
  }
  return GetTrueColorRecursively(rootId, path.slice(0, -1), unitMap, colorMap);
}

export function GetTrueColor(signature: number[] | string, rootId: string, unitMap: UnitMap, colorMap: ColorMap): `#${string}` {
  if (!Array.isArray(signature)) {
    const unit = unitMap[signature];
    return getColorInVoid(unit.smartColor, colorMap);
  }

  return GetTrueColorRecursively(rootId, signature, unitMap, colorMap);
}

