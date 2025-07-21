import { useUnitInteractionStore } from "../../../hooks/useUnitInteractionsStore";
import { useUnitQuick, useUnitStore } from "../../../hooks/useUnitStore";
import { Unit } from "../../../logic/logic";

// WIP!!
export const iconFiles = [
  "b-aa.svg",
  "b-art.svg",
  "b-at.svg",
  "b-engi.svg",
  "b-hq.png",
  "b-hq.svg",
  "b-inf.svg",
  "b-med.svg",
  "b-rec.svg",
  "b-signal.svg",
  "b-supply.svg",
  "b-tank.svg",
  "b-gun.svg",
  "b-armored.svg",
  "b-missile.svg",
  "b-motorized.svg",
  "b-unmanned.svg",
  "b-towed.svg",
  "b-wheeled-cc.svg",
  "b-wheeled-rb.svg",
  "b-hq-I.svg",
  "b-supports-I.svg",
  "b-supports-II.svg",
  "k-gun-alt.svg",
  "c-inf.png",
  "c-mg.svg",
  "c-tank.png",
  "x-bad-apple!.gif",
  "x-test.svg",
  "x-test.png",
  "x-test-sqr.png",
];

export function VisualLayeringEditor() {
  const unitId = useUnitInteractionStore((s) => s.selectedId) as string;
  const unit = useUnitQuick(unitId) as Unit;
  const updateUnit = useUnitStore((s) => s.updateUnit);

  const updateLayers = (newLayers: string[]) => {
    updateUnit(unitId, { ...unit, layers: newLayers });
  };

  const updateLayer = (index: number, newFilename: string) => {
    const newLayers = [...unit.layers];
    newLayers[index] = `${process.env.PUBLIC_URL}/icons/${newFilename}`;
    updateLayers(newLayers);
  };

  const addLayer = () => {
    const newLayers = [...unit.layers, `${process.env.PUBLIC_URL}/icons/${iconFiles[0]}`]; // Default to first icon
    updateLayers(newLayers);
  };

  const removeLayer = (index: number) => {
    const newLayers = unit.layers.filter((_, i) => i !== index);
    updateLayers(newLayers);
  };

  return (
    <div className="editor-segment-flex">
      <div className="editor-segment-row">
        <h2 className="font-bold">Visual Layers</h2>
        <button onClick={() => addLayer()} className="btn-emoji !pr-2.5">➕Layer</button>
      </div>
      <div className="flex flex-col items-center gap-2 mb-2">
        {unit.layers.map((layerSrc, index) => (
          <div key={index} className="editor-segment-row">
            <span className="">Layer {index + 1}:</span>
            <select
              value={layerSrc.replace(`${process.env.PUBLIC_URL}/icons/`, "")}
              onChange={(e) => updateLayer(index, e.target.value)}
              className="editor-element"
            >
              {iconFiles.map((filename) => (
                <option key={filename} value={filename}>
                  {filename}
                </option>
              ))}
            </select>
            <button onClick={() => removeLayer(index)} className="btn-emoji !p-0">❌</button>
          </div>
        ))}
      </div>
    </div>
  );
}

