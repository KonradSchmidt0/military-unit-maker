import { UnitMap } from "./hooks/useUnitStore";
import { RawUnit, OrgUnit, defaultUnitColor } from "./logic/logic"; 

const infVisual = ["/icons/c-inf.png"]
const mgVisual = ["/icons/c-mg.svg"]
const infHqVisual = ["/icons/c-inf.png", "/icons/hq.svg"]

export const rifle_e: RawUnit = {
  type: "raw",
  name: "Riffle",
  smartColor: "inheret",
  layers: infVisual,
  echelonLevel: 0,
  equipment: { "Warrior": 2, "Rifle": 2 }
}

export const rifle_o: OrgUnit = {
  type: "org",
  name: "Rif. Squad",
  smartColor: "inheret",
  layers: infVisual,
  echelonLevel: 1,
  children: {"rifle_e": 2}
}
export const mg_o: RawUnit = {
  type: "raw",
  name: "MG Squad",
  smartColor: defaultUnitColor,
  layers: mgVisual,
  echelonLevel: 1,
  equipment: { "Warrior": 4, "MG": 2, "Rifle": 2}
}
export const leadWithRadio_e: RawUnit = {
  type: "raw",
  name: "Section Leader",
  smartColor: "inheret",
  layers: infHqVisual,
  echelonLevel: 0,
  equipment: { "Warrior": 2, "Rifle": 2, "Radio": 1 }
}

export const infatry_oo: OrgUnit = {
  type: "org",
  name: "Inf Section",
  smartColor: defaultUnitColor,
  layers: infVisual,
  echelonLevel: 2,
  children: {
    "leadWithRadio_e": 1,
    "rifle_o": 2,
    "mg_o": 1,
    "rifle_e": 1,
  }
}

export const initialUnits: UnitMap = {
  'rifle_e': rifle_e,
  'rifle_o': rifle_o,
  'mg_o': mg_o,
  'leadWithRadio_e': leadWithRadio_e,
  'infatry_oo': infatry_oo,
};