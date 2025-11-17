import { GetUnitPaletAsUnitMap, usePaletStore } from "../../../hooks/usePaletStore"
import { useUnitDropdownStore } from "../../../hooks/useUnitDropdownStore"
import { useUnitStore } from "../../../hooks/useUnitStore"

interface props {

}

export function UnitClickableIdSwapRoot(p: React.PropsWithChildren<props>) {
  const { unitMap, setTrueRootId } = useUnitStore(s => s)
  const { unitPalet } = usePaletStore(s => s)

  const callDropDown = useUnitDropdownStore(s => s.callDropDown)
  const unitOptions = GetUnitPaletAsUnitMap(unitPalet, unitMap)

  const handleClick = (e: any) => {
    callDropDown(
      (choosenId: string) => { setTrueRootId(choosenId); }, 
      {top: e.clientY + 10, left: e.clientX},
      unitOptions
    )
  }

  return (
    <div onClick={handleClick} style={{ display: "contents" }}>
      {p.children}
    </div>
  );  
}