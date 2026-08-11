import { UnitDisplay } from "../UnitDisplaying/UnitDisplay";
import { useUnitDropdownStore } from "../../hooks/useUnitDropdownStore";
import { useColorPalletStore } from "../../hooks/useColorPalletStore";
import { getColorInVoid } from "../../logic/Units/unitColorManaging";
import MouseDropdown from "./MouseDropdowns/MouseDropdown";
import { DropdownTagFilteredList } from "./MouseDropdowns/DropdownTagFilteredList";

export default function UnitDropdown() {
  const { colorMap } = useColorPalletStore()

  const {onChosen, pos, callDropDown, options: o} = useUnitDropdownStore(s => s)
  
  if (!o || !onChosen)
    return null
  
  const options = Object.entries(o).map(entry => ({unit: entry[1], id: entry[0]}))

  const OnOptionChoosenOrExited = () => { callDropDown(undefined) }

  return (
    <MouseDropdown pos={pos}>
      <DropdownTagFilteredList
        list={options}
        placeholder="Search unit by name..."
        OnExit={OnOptionChoosenOrExited}
        GetEntrysTags={(entry) => entry.unit.name}
        Entry2OptionNode={(entry, _) => 
          (<div 
            key={entry.id} 
            className="dropdown-option !gap-4 !pl-3"
            onClick={() => {onChosen(entry.id); OnOptionChoosenOrExited()}}
          >
            <div className="w-20 flex justify-center">
              <UnitDisplay 
                unitId={entry.id} 
                color={getColorInVoid(entry.unit.smartColor, colorMap)}
                className="!w-8 !mt-1"
              />
            </div>
            <span className="text-sm max-w-44">{entry.unit.name}</span>
          </div>)
        }
        ConditionalOption={(filteredList, _) => 
          (filteredList.length === 0 ?
          (<div className="dark:text-white/90 text-black/90 text-xs m-1">
            <p className="font-semibold m-1 text-center">No safe units in palet!</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Some Units are not shown since they could cause infinite loop.</li>
              <li>If you think there is some unit that should be here, make sure you press the "➕🎨" on them.</li>
            </ul>
          </div>) : null)
        }
      />
    </MouseDropdown>
  );
}
