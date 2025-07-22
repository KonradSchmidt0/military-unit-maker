import { EquipmentTable, RawUnit, Unit } from "./logic";

export function createRawUnitWithFractionOfEquipment(parent: Unit, parentEq: EquipmentTable, fraction: number): RawUnit {
    if (fraction <= 0 || !isFinite(fraction)) {
      throw new Error("Fraction must be a finite positive number");
    }
  
    // Copy and scale equipment
    const scaledEquipment: EquipmentTable = {}
  
    for (const [type, count] of Object.entries(parentEq)) {
      scaledEquipment[type] = count / fraction;
    }
  
    const inherited: RawUnit = {
      type: "raw",
      name: parent.name + " (copy)",
      smartColor: "inheret",
      echelonLevel: parent.echelonLevel - 1,
      layers: [...parent.layers], // shallow copy
      equipment: scaledEquipment,
    };
  
    return inherited;
  }
  