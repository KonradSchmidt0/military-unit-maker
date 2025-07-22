import Color from "color";
import { RecoloredImage } from "./RecoloredPicture";
import { useEchelonStore } from "../hooks/useEchelonStore";
import { useUnitQuick } from "../hooks/useUnitStore";

interface UnitDisplayProps {
  unitId: string;
  color: `#${string}`
  style?: {}
  className?: string
}

export function UnitDisplay({ unitId, color, style, className }: UnitDisplayProps) {
  const unit = useUnitQuick(unitId)

  const echelonIconEndings = useEchelonStore(s => s.intToIconPathEndings)
  
  if (!unit) {
    console.error(`No unit with id = ` + unitId)
    return <>{`No unit with id = ` + unitId}</>
  }
  
  const echelonLevel = unit.echelonLevel  
  const echelonIcon = echelonIconEndings[echelonLevel]
  const echelonElement = echelonIcon ? 
    <img src={process.env.PUBLIC_URL + "/icons/" + echelonIcon} className="absolute bottom-0 invert"/> : 
    null

  return (
    <div className="relative">
      {/* Unit block */}
      <div
        style={{backgroundColor: color, ...style}}
        className={"relative w-14 aspect-[243/166] cursor-pointer transition-shadow " + className}
      >
        {unit.layers.map((src, index) => (
          makeLayer(index, src, color as `#${string}`)
        ))}
      </div>

      {echelonElement}
      <img src={process.env.PUBLIC_URL + "/icons/b-frame.svg"} className="absolute bottom-0"/>
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