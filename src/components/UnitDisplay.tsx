import Color from "color";
import { RecoloredImage } from "./RecoloredPicture";
import { useEchelonStore } from "../hooks/useEchelonStore";
import { useUnitQuick } from "../hooks/useUnitStore";

interface UnitDisplayProps {
  unitId: string;
  color: `#${string}`
  style?: {}
}

export function UnitDisplay({ unitId, color, style }: UnitDisplayProps) {
  const unit = useUnitQuick(unitId)

  const echelon = useEchelonStore().intToSymbol[unit ? unit.echelonLevel : 0];

  if (!unit) {
    console.error(`No unit with id = ` + unitId)
    return <>{`No unit with id = ` + unitId}</>
  }
  
  return (
    <div className="relative flex flex-col items-center select-none w-fit">
      {/* Echelon symbol above the unit */}
      <div className=" text-primary text-xs">{echelon}</div>

      {/* Unit block */}
      <div className="">
        <div
          style={style}
          className="relative w-14 aspect-[243/166] cursor-pointer transition-shadow"
        >
          {[...unit.layers, `${process.env.PUBLIC_URL}/icons/b-frame.svg`].map((src, index) => (
            makeLayer(index, src, color as `#${string}`)
          ))}
        </div>
      </div>

    </div>
  );
}

const makeLayer = (index: number, src: string, c: string) => { 
  const cn ="absolute inset-0 w-full h-full"

  const ext = src.toLowerCase()
  if (!ext.endsWith(".gif") && !ext.endsWith(".svg")) {
    return <RecoloredImage src={src} color={c as `#${string}`} key={index + "treenode-layer-recolored-image"} className={cn}/>
  }

  const hsv = Color(c).hsv()

  const [hr, s, b] = [hsv.hue(), hsv.saturationl(), hsv.value()*3.2]

  // For now good enough. Just in the future 
  const style = {
    filter: `hue-rotate(${hr}deg) saturate(${s}%) brightness(${b}%)`
  }

  return <img
    key={index}
    src={src}
    alt=""
    className={cn}
    style={style}
  />
}