import { StaffText } from "../hooks/useGlobalStore";
import { UnitMap } from "../hooks/useUnitStore";
import { GetChildIdFromPath, GetFlatIds } from "./childManaging";
import { OrgUnit } from "./logic";

export interface DesignationPack {
  name?: string;
  descFromParent?: string;
  staffComment?: string;
}

// WIP
export function getDesignationPack(path: number[], unitMap: UnitMap, trueRootId: string, staffNames: StaffText[], staffComments: StaffText[]) : DesignationPack {
  let comment = undefined
  for (const sc of staffComments) {
    if (sc.path.toString() === path.toString()) {
      comment = sc.comment
      break
    }
  }
  let staffName = undefined
  for (const sn of staffNames) {
    if (sn.path.toString() === path.toString()) {
      staffName = sn.comment
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

  return {name: staffName ?? cs, descFromParent: desc, staffComment: comment}
}

export function changeTextInParent(path: number[], unitMap: UnitMap, trueRootId: string, callSign?: string, desc?: string): OrgUnit {
  const parent =  unitMap[GetChildIdFromPath(trueRootId, path.slice(0, -1), unitMap)] as OrgUnit
  const childFlatIndex = path[path.length - 1]

  return {...parent, 
    flatCallSigns: callSign !== undefined ? {...parent.flatCallSigns, [childFlatIndex]: callSign} : parent.flatCallSigns,
    flatDescriptions: desc !== undefined ? {...parent.flatDescriptions, [childFlatIndex]: desc} : parent.flatDescriptions,
  }
}

export function mergeDesignationPacks(packs: DesignationPack[]): DesignationPack {
  function mergeField(key: keyof DesignationPack): string | undefined {
    const values = packs.map(p => p[key] && p[key]?.trim()).map(v => v || "-");

    // If all original values are empty/undefined, return undefined
    const allEmpty = packs.every(p => !p[key] || p[key]?.trim() === "");
    if (allEmpty) return undefined;

    return values.join(", ");
  }

  return {
    name: mergeField("name"),
    descFromParent: mergeField("descFromParent"),
    staffComment: mergeField("staffComment"),
  };
}

export function getMergedDPFromChildren(parentPath: number[], startingFlatIndex: number, count: number, unitMap: UnitMap, trueRootId: string, staffNames: StaffText[], staffComments: StaffText[]) : DesignationPack {
  const parent = unitMap[GetChildIdFromPath(trueRootId, parentPath, unitMap)] as OrgUnit
  const flatChildrenIndexes = GetFlatIds(parent.children).filter(
    (_, i) => i >= startingFlatIndex && i < startingFlatIndex + count
  );

  const a: DesignationPack[] = []
  flatChildrenIndexes.forEach((id, index) => { a.push(getDesignationPack([...parentPath, startingFlatIndex + index], unitMap, trueRootId, staffNames, staffComments)) })

  return mergeDesignationPacks(a)
}