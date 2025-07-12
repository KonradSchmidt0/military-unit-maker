import { UnitMap } from "./hooks/useUnitStore";
import { RawUnit, OrgUnit } from "./logic/logic"; 

export const rifle_e: RawUnit = {
  type: "raw",
  name: "(ø) Riffle Echelon",
  equipment: { "Warrior": 2, "Rifle": 2 }
}

export const rifle_o: OrgUnit = {
  type: "org",
  name: "(o) Riffle Squad",
  children: [{unitId: "rifle_e", count: 2}]
}
export const mg_o: RawUnit = {
  type: "raw",
  name: "(o) Machine Gun Squad",
  equipment: { "Warrior": 4, "MG": 2, "Rifle": 2}
}
export const leadWithRadio_e: RawUnit = {
  type: "raw",
  name: "(ø) Leader Echelon",
  equipment: { "Warrior": 2, "Rifle": 2, "Radio": 1 }
}

export const infatry_oo: OrgUnit = {
  type: "org",
  name: "(oo) Infantry Section",
  children: [
    {unitId: "leadWithRadio_e", count: 1},
    {unitId: "rifle_o", count: 2},
    {unitId: "mg_o", count: 1},
    {unitId: "rifle_e", count: 1},
  ]
}

export const initialUnits: UnitMap = {
  'rifle_e': rifle_e,
  'rifle_o': rifle_o,
  'mg_o': mg_o,
  'leadWithRadio_e': leadWithRadio_e,
  'infatry_oo': infatry_oo,
};