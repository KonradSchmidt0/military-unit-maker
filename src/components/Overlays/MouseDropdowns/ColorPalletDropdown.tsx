import { useColorPalletDropdownStore } from "../../../hooks/useColorPalletDropdownStore";
import { useColorPalletStore } from "../../../hooks/useColorPalletStore";
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
            onClick={(e) => { onChosen(index); OnExit(); }}
          >
            <input
              type="color"
              value={entry.color}
              onChange={(e) => {
                const c = e.target.value as `#${string}`
                changeAtIndex(index, (prev) => ({...prev, color: c}));
              }}
              className="editor-element !p-0 !h-8 !w-6"
            />
            <span className="text-sm max-w-44">{entry.name}</span>
          </div>
        )}
      />
    </MouseDropdown>
  )
}