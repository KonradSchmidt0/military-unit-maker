import { useIconsStore } from "../../../hooks/useIcons";
import { processSelect, useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import { defaultUnitColor } from "../../../logic/logic";
import { UnitDisplay } from "../../UnitDisplaying/UnitDisplay";

export function VisualLayeringEditor() {
  const unitMap = useUnitStore(s => s.unitMap)
  const trueRootId = useUnitStore(s => s.trueRootId)
  const unitId = processSelect(useUnitInteractionStore(s => s.select), unitMap, trueRootId) as string
  const unit = unitMap[unitId];
  const updateUnit = useUnitStore((s) => s.updateUnit);

  const setDropdown_onChosen = useIconsStore(s => s.callDropDown)

  const updateLayers = (newLayers: string[]) => {
    updateUnit(unitId, { ...unit, layers: newLayers });
  };

  const updateLayer = (index: number, newFilename: string) => {
    const newLayers = [...unit.layers];
    newLayers[index] = `${process.env.PUBLIC_URL}/icons/${newFilename}`;
    updateLayers(newLayers);
  };

  const addLayer = (newIconFile: string) => {
    const newLayers = [...unit.layers, `${process.env.PUBLIC_URL}/icons/${newIconFile}`];
    updateLayers(newLayers);
  };

  const removeLayer = (index: number) => {
    const newLayers = unit.layers.filter((_, i) => i !== index);
    updateLayers(newLayers);
  };


  const handleClickOnDisp = (e: any) => {
    if (unit.layers.length === 0)
      setDropdown_onChosen((n:string) => addLayer(n), {top: e.clientY + 10, left: e.clientX})
    else  
      setDropdown_onChosen((n:string) => updateLayer(0, n), {top: e.clientY + 10, left: e.clientX})
  }


  return (<>
    <div className="editor-segment-flex min-h-40">
      <div className="editor-segment-row">
        <h2 className="font-bold">Visual Layers</h2>
        <button onClick={(e) => setDropdown_onChosen((n:string) => addLayer(n), {top: e.clientY + 10, left: e.clientX})} className="btn-emoji !pr-2.5">➕🗃️</button>
      </div>
      <div className="flex flex-row gap-2 mb-2 relative">
        <UnitDisplay 
          unitId={unitId} 
          color={unit.smartColor === "inheret" ? defaultUnitColor : unit.smartColor}
          className="!w-28 translate-y-4"
          onClick={handleClickOnDisp}
          showText={false}
        />
        <div className="flex flex-col items-center gap-2 mb-2 pt-4">
          {unit.layers.map((layerSrc, index) => (
            <div key={index} className="editor-segment-row">
              <img src={layerSrc} className="editor-element !p-0 !bg-defaultUnitIcon w-14 aspect-[243/166]"
                  onClick={(e) => setDropdown_onChosen((n: string) => updateLayer(index, n), {top: e.clientY + 10, left: e.clientX})}
              ></img>
              <button onClick={() => removeLayer(index)} className="btn-emoji !p-0">❌</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>);
}

