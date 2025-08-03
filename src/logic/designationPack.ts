import { StaffComment } from "../hooks/useGlobalStore";
import { UnitMap } from "../hooks/useUnitStore";

export interface DesignationPack {
  callSignFromParent?: string;
  descFromParent?: string;
  staffComment?: string;
}

// WIP
export function getDesignationPack(path: number[], unitMap: UnitMap, trueRootId: string, staffComments: StaffComment[]) : DesignationPack {
  let comment = undefined
  for (const sc of staffComments) {

    if (arraysEqual(sc.path, path)) {
      comment = sc.comment
      break
    }
  }

  return {callSignFromParent: undefined, descFromParent: undefined, staffComment: comment}
}

function arraysEqual(a: any[], b: any[]): boolean {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}
