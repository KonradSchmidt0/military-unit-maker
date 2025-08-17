import Color from "color";
import { RecoloredImage } from "../RecoloredPicture";
import { useEchelonStore } from "../../hooks/useEchelonStore";
import { useUnitQuick } from "../../hooks/useUnitStore";
import { DesignationPack } from "../../logic/designationPack";
import { UnitStackShadow } from "./UnitStackShadow";
import { UnitDisplayTexts } from "./UnitDisplayTexts";

interface UnitDisplayProps {
  unitId: string;
  color: `#${string}`
  style?: {}
  className?: string
  onClick?: (e: any) => void
  showText?: boolean
  designationPack?: DesignationPack
  stack?: number
}

export function UnitDisplay({ unitId, color, style, className, onClick, showText = true, designationPack: dp, stack }: UnitDisplayProps) {
  const unit = useUnitQuick(unitId)

  const echelonIconEndings = useEchelonStore(s => s.intToIconPathEndings)
  const echelonSymbols = useEchelonStore(s => s.intToSymbol)
  
  if (!unit) {
    console.error(`No unit with id = ` + unitId)
    return <>{`No unit with id = ` + unitId}</>
  }
  
  const echelonLevel = unit.echelonLevel  
  const echelonIcon = echelonIconEndings[echelonLevel]
  const echelonElement = echelonIcon ? 
    <img src={process.env.PUBLIC_URL + "/icons/" + echelonIcon} className="absolute bottom-0 dark:invert"
    alt={echelonSymbols[echelonLevel]} key="echelon"
    /> : 
    null

  return (
    <div className="relative text-unit">
      {/* Unit block */}
      <div
        className={"relative w-14 aspect-[243/166] cursor-pointer transition-shadow " + className}
        onClick={onClick}
        style={{...style}}
      >
        {/* Problem: Since we use svgs as border the bg 'clips' on the edges */}
        {/* Solution: Seperate it and make it very slightly inset */}
        <div className="absolute inset-[1px]" style={{backgroundColor: color}}/>
        {unit.layers.map((src, index) => (
          makeLayer(index, src, color as `#${string}`)
        ))}
        {echelonElement}

        {showText && <UnitDisplayTexts name={unit.name} desc={unit.desc} designationPack={dp} rightOffset={(stack ?? 1) - 1 }/>}

        <img src={process.env.PUBLIC_URL + "/icons/b-frame.svg"} className="absolute bottom-0 z-[5]" alt="unit icon frame"/>
        {stack && stack > 1 && <UnitStackShadow stack={stack - 1} color={color} style={style ?? {}}/>}
      </div>
    </div>
  );
}

const makeLayer = (index: number, src: string, c: string) => { 
  const cn ="absolute bottom-0 w-full h-full"

  const ext = src.toLowerCase()
  if (!ext.endsWith(".gif") && !ext.endsWith(".svg")) {
    return <RecoloredImage src={src} color={c as `#${string}`} key={index + "treenode-layer-recolored-image"} className={cn}/>
  }

  const hsv = Color(c).hsv()

  const [hr, s, b] = [hsv.hue(), hsv.saturationv(), hsv.l() * 2]

  // For now good enough. Just in the future 
  const style = {
    filter: `hue-rotate(${hr}deg) saturate(${s}%) brightness(${b}%)`
  }

  return <img
    key={index + "layer"}
    src={src}
    alt=""
    className={cn}
    style={style}
  />
}