import { useIconsStore } from "../../../../hooks/useIcons";
import MouseDropdown from "../MouseDropdown";
import { DropdownTagFilteredList } from "../DropdownTagFilteredList";

export default function IconDropdown() {
  const { icons, dropDown_onChosen: onChosen, dropdown_pos: pos, callDropDown} = useIconsStore()

  if (!onChosen)
    return null
  
  const OnOptionChoosenOrExited = () => { callDropDown(undefined) }

  return (
    <MouseDropdown pos={pos}>
      <DropdownTagFilteredList
        list={icons}
        placeholder="Search icons by tags..."
        OnExit={OnOptionChoosenOrExited}
        GetEntrysTags={(entry) => entry.tags}
        Entry2OptionNode={(entry, _) => (
          <div 
            key={entry.filename} 
            className="dropdown-option"
            onClick={() => {onChosen(entry.filename); OnOptionChoosenOrExited()}}
          >
            <img 
              src={`${process.env.PUBLIC_URL}/icons/${entry.filename}`} 
              alt={entry.tags} 
              className="w-8 unit object-contain bg-white" 
            />
            <span className="text-sm">{entry.tags}</span>
          </div>
        )}
      />
    </MouseDropdown>
  );
}
          