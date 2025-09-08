import { UnitMap } from "./hooks/useUnitStore";
import { RawUnit, OrgUnit, defaultUnitColor } from "./logic/logic"; 

const infVisual = [`${process.env.PUBLIC_URL}/icons/b-inf.svg`]
const mgVisual = [`${process.env.PUBLIC_URL}/icons/b-inf.svg`, `${process.env.PUBLIC_URL}/icons/b-gun.svg`]
const infHqVisual = [`${process.env.PUBLIC_URL}/icons/b-inf.svg`, `${process.env.PUBLIC_URL}/icons/b-hq.svg`]

// In the future, it would be nice to have an option to load a json as only subunit, not a whole project
// As such we can't have ids being in conflict with eachother, so we make sure that they have unique id
export function GenerateInitialUnits() {
  const rifle_e: RawUnit = {
    type: "raw",
    name: "Riffle",
    smartColor: "inheret",
    layers: infVisual,
    echelonLevel: 0,
    equipment: { "Warrior": 2, "Rifle": 2 }
  }
  const rifle_e_id = crypto.randomUUID()
  
  const rifle_o: OrgUnit = {
    type: "org",
    name: "Rif. Squad",
    smartColor: "inheret",
    layers: infVisual,
    echelonLevel: 1,
    children: {[rifle_e_id]: 2},
    flatCallSigns: {},
    flatDescriptions: {}
  }
  const rifle_o_id = crypto.randomUUID()
  
  const mg_o: RawUnit = {
    type: "raw",
    name: "MG Squad",
    smartColor: defaultUnitColor,
    layers: mgVisual,
    echelonLevel: 1,
    equipment: { "Warrior": 4, "MG": 2, "Rifle": 2}
  }
  const mg_o_id = crypto.randomUUID()
  
  const leadWithRadio_e: RawUnit = {
    type: "raw",
    name: "Section Leader",
    smartColor: "inheret",
    layers: infHqVisual,
    echelonLevel: 0,
    equipment: { "Warrior": 2, "Rifle": 2, "Radio": 1 },
    desc: "Commander + Radio Man"
  }
  const leadWithRadio_e_id = crypto.randomUUID()
  
  const infatry_oo: OrgUnit = {
    type: "org",
    name: "Inf Section",
    smartColor: defaultUnitColor,
    layers: infVisual,
    echelonLevel: 2,
    children: {
      [leadWithRadio_e_id]: 1,
      [rifle_o_id]: 2,
      [mg_o_id]: 1,
      [rifle_e_id]: 1,
    },
    desc: "16 + 1R",
    flatCallSigns: {
      0: "H",
      1: "a",
      2: "b",
      3: "c",
      4: "z",
    },
    flatDescriptions: {
      1: "1st maneuver element",
      2: "2nd maneuver element",
      4: "reserve / runners",
    }
  }
  const infatry_oo_id = crypto.randomUUID()
  
  
  const initialUnits: UnitMap = {
    [rifle_e_id]: rifle_e,
    [rifle_o_id]: rifle_o,
    [mg_o_id]: mg_o,
    [leadWithRadio_e_id]: leadWithRadio_e,
    [infatry_oo_id]: infatry_oo,
  };

  const palet: string[] = [rifle_e_id, rifle_o_id, mg_o_id, leadWithRadio_e_id, infatry_oo_id]

  return { rootId: infatry_oo_id, unitMap: initialUnits, palet: palet }
}