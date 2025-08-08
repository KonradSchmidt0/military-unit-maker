import { StaffComment } from "../hooks/useGlobalStore";
import { UnitMap } from "../hooks/useUnitStore";
import { GetChildIdFromPath } from "./childManaging";
import { OrgUnit } from "./logic";

export interface DesignationPack {
  callSignFromParent?: string;
  descFromParent?: string;
  staffComment?: string;
}

// WIP
export function getDesignationPack(path: number[], unitMap: UnitMap, trueRootId: string, staffComments: StaffComment[]) : DesignationPack {
  let comment = undefined
  for (const sc of staffComments) {
    if (sc.path.toString() === path.toString()) {
      comment = sc.comment
      break
    }
  }

  let cs = undefined
  let desc = undefined
  if (path.length > 0) {
    const parentId = GetChildIdFromPath(trueRootId, path.slice(0, -1), unitMap)
    const parent = unitMap[parentId] as OrgUnit

    cs = parent.flatCallSigns[path[path.length - 1]]
    desc = parent.flatDescriptions[path[path.length - 1]]
  }

  return {callSignFromParent: cs, descFromParent: desc, staffComment: comment}
}

export function changeTextInParent(path: number[], unitMap: UnitMap, trueRootId: string, callSign?: string, desc?: string): OrgUnit {
  const parent =  unitMap[GetChildIdFromPath(trueRootId, path.slice(0, -1), unitMap)] as OrgUnit
  const childFlatIndex = path[path.length - 1]

  return {...parent, 
    flatCallSigns: callSign !== undefined ? {...parent.flatCallSigns, [childFlatIndex]: callSign} : parent.flatCallSigns,
    flatDescriptions: desc !== undefined ? {...parent.flatDescriptions, [childFlatIndex]: desc} : parent.flatDescriptions,
  }
}