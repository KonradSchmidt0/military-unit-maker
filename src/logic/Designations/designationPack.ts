import { StaffText } from "../../hooks/useStaffTextStore";
import { UnitMap } from "../../hooks/useUnitStore";
import { FlatIndex2InsideIndex, GetChildIdFromPath, GetFlatIds } from "../Units/childGetting";
import { ChildEntry, InsideIndex2ComplexName, OrgUnit } from "../Units/logic";

export interface DesignationPack {
  name?: string;
  descFromParent?: string;
  staffComment?: string;
}

export function getDesignationPack(
  path: number[], rootId: string, unitMap: UnitMap, staffNames: StaffText[], 
  staffComments: StaffText[], phase: number
) : DesignationPack {
  const comment = staffComments.find(e => e.path.toString() === path.toString())?.comment
  const staffName = staffNames.find(e => e.path.toString() === path.toString())?.comment

  const textsFromParent = getTextsInParent(path, rootId, unitMap, phase)
  
  return {name: staffName ?? textsFromParent?.callSign, descFromParent: textsFromParent?.desc, staffComment: comment}
}

export function getTextsInParent(
  path: number[], rootId: string, unitMap: UnitMap, phase: number
) : {callSign: string | undefined, desc: string | undefined} | undefined {
  if (path.length === 0) return undefined
  
  const parentId = GetChildIdFromPath(rootId, path.slice(0, -1), unitMap, phase)
  if (!parentId) return undefined
  
  const aaa = FlatIndex2InsideIndex(path, rootId, unitMap, phase)
  if (!aaa) return undefined
  
  const parent = unitMap[parentId] as OrgUnit
  const { childId, insideIndex } = aaa
  const descName = parent
    .children.find(entry => entry.id === childId)
    ?.insideIndexs2ComplexNames?.find(i2cn => i2cn.index === insideIndex)
    
  return { callSign: descName?.callSign, desc: descName?.desc }
}

export function SetTextsInParent(
  parent: OrgUnit, childPath: number[], rootId: string, 
  setFunc: (prev: Omit<InsideIndex2ComplexName, 'index'> | undefined) => Omit<InsideIndex2ComplexName, 'index'>,
  unitMap: UnitMap, phase: number,
): OrgUnit {
  const childInsideEntry = FlatIndex2InsideIndex(childPath, rootId, unitMap, phase, true)
  if (!childInsideEntry)
    return parent
  const { childId, insideIndex } = childInsideEntry

  function addNewNameEntry(insideIndexs2ComplexNames: InsideIndex2ComplexName[] | undefined): InsideIndex2ComplexName[] {
    const o = {index: insideIndex, ...setFunc(undefined)}
    if (!insideIndexs2ComplexNames)
      return [o]
    return [...insideIndexs2ComplexNames, o]
  }

  function modifyChildEntry(e: ChildEntry) : ChildEntry {
    return { ...e, 
      insideIndexs2ComplexNames: 
        e.insideIndexs2ComplexNames?.find(index2name => index2name.index === insideIndex) 
        ?
        e.insideIndexs2ComplexNames.map(index2name => index2name.index !== insideIndex ? index2name :
          {...index2name, ...setFunc(index2name) }) 
        :
        addNewNameEntry(e.insideIndexs2ComplexNames)
    }
  }

  

  return {...parent, 
    children: parent.children.map(e => e.id === childId ? modifyChildEntry(e) : e)
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

export function getMergedDPFromChildren(
  parentPath: number[], startingFlatIndex: number, count: number, unitMap: UnitMap, 
  trueRootId: string, staffNames: StaffText[], staffComments: StaffText[], phase: number
) : DesignationPack {
  const parent = unitMap[GetChildIdFromPath(trueRootId, parentPath, unitMap, phase) as string] as OrgUnit
  const filteredChildrenIndexes = GetFlatIds(parent, phase).filter(
    (_, i) => i >= startingFlatIndex && i < startingFlatIndex + count
  );

  const a: DesignationPack[] = []
  filteredChildrenIndexes.forEach((_, notOffsetedIndex) => { a.push(getDesignationPack(
    [...parentPath, startingFlatIndex + notOffsetedIndex], 
    trueRootId, 
    unitMap, 
    staffNames, 
    staffComments,
    phase
  )) })

  return mergeDesignationPacks(a)
}