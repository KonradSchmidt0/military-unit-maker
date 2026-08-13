import { useColorPalletDropdownStore } from "../../../hooks/useColorPalletDropdownStore";
import { useColorPalletStore } from "../../../hooks/useColorPalletStore";
import SafeColorInput from "../../Editors/EditorElements/SafeInputs/SafeColorInput";
import { DropdownTagFilteredList } from "./DropdownTagFilteredList";
import MouseDropdown from "./MouseDropdown";

export default function ColorPalletDropdown() {
  const { colorMap, changeAtIndex } = useColorPalletStore()
  const { onChosen, pos, CallColorDropdown } = useColorPalletDropdownStore()

  if (!onChosen || !pos)
    return null

  const OnExit = () => CallColorDropdown(undefined)

  return (
    <MouseDropdown pos={pos}>
      <DropdownTagFilteredList
        list={colorMap}
        placeholder="Search by color's name..."
        OnExit={OnExit}
        GetEntrysTags={(entry) => entry.name}
        Entry2OptionNode={(entry, index) => (
          <div
            key={entry.uId}
            className="dropdown-option"
          >
            <SafeColorInput
              color={colorMap[index].color}
              update={(c) => changeAtIndex(index, (prev) => ({...prev, color: c}))}
            />
            <div 
              className="text-sm w-full h-full text-left content-center"
              onClick={() => { onChosen(index); OnExit(); }}
            >
              <span>{entry.name}</span>
            </div>
          </div>
        )}
      />
    </MouseDropdown>
  )
}