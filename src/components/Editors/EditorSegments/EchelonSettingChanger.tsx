import { useEchelonStore } from "../../../hooks/useEchelonStore";

interface props {

}

export function EchelonSettingChanger(p: props) {
  const {setIcons, setSymbols, intToSymbol} = useEchelonStore(s => s)

  const setDeltaStandart = () => {
    setIcons([[10, "e-D.svg"], [11, "e-DD.svg"], [12, "e-DDD.svg"]])
    setSymbols([[10, "Δ"], [11, "ΔΔ"], [12, "ΔΔΔ"]])
  }
  const setNatoStandart = () => {
    setIcons([[10, "e-XXXX.svg"], [11, "e-XXXXX.svg"], [12, "e-XXXXXX.svg"]])
    setSymbols([[10, "XXXX"], [11, "XXXXX"], [12, "XXXXXX"]])
  }

  return (
    <select
      defaultValue={intToSymbol[11]}
      className="editor-element !w-24"
      onChange={(e) => { e.target.value === "ΔΔ" ? setDeltaStandart() : setNatoStandart()}}
      >
      <option value="ΔΔ">ΔΔ</option>
      <option value="XXXXX">XXXXX</option>
    </select>
  );
}