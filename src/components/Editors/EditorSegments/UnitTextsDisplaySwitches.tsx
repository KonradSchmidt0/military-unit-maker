import { useTextOptionStore } from "../../../hooks/useTextOptionStore";

interface props {

}

export function UnitTextsDisplaySwitches(p: props) {
  const { setOptions, shouldAllTextDisplay, shouldUnitTypeNameDisplay } = useTextOptionStore(s => s)

  return (<>
    {shouldAllTextDisplay && <button className="btn-emoji" onClick={() => setOptions({shouldAllTextDisplay: false})}>👁️🪖Texts✅</button>}
    {!shouldAllTextDisplay && <button className="btn-emoji" onClick={() => setOptions({shouldAllTextDisplay: true})}>👁️🪖Texts❌</button>}
    {shouldUnitTypeNameDisplay && <button className="btn-emoji" onClick={() => setOptions({shouldUnitTypeNameDisplay: false})}>👁️🪖Type Names✅</button>}
    {!shouldUnitTypeNameDisplay && <button className="btn-emoji" onClick={() => setOptions({shouldUnitTypeNameDisplay: true})}>👁️🪖Type Names❌</button>}
  </>)
}