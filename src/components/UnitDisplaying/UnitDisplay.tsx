import Color from "color";
import { RecoloredImage } from "../RecoloredPicture";
import { useEchelonStore } from "../../hooks/useEchelonStore";
import { useUnitQuick } from "../../hooks/useUnitStore";
import { DesignationPack } from "../../logic/designationPack";

interface UnitDisplayProps {
  unitId: string;
  color: `#${string}`
  style?: {}
  className?: string
  onClick?: (e: any) => void
  showText?: boolean
  designationPack?: DesignationPack
}

export function UnitDisplay({ unitId, color, style, className, onClick, showText = true, designationPack: dp }: UnitDisplayProps) {
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
    alt={echelonSymbols[echelonLevel]}
    /> : 
    null

  return (
    <div className="relative text-unit">
      {/* Unit block */}
      <div
        style={{backgroundColor: color, ...style}}
        className={"relative w-14 aspect-[243/166] cursor-pointer transition-shadow " + className}
        onClick={onClick}
      >
        {unit.layers.map((src, index) => (
          makeLayer(index, src, color as `#${string}`)
        ))}
        {echelonElement}

        {showText && makeUnitTexts(unit.shortName, dp?.callSignFromParent, unit.desc, dp?.descFromParent, dp?.staffComment, false)}

        <img src={process.env.PUBLIC_URL + "/icons/b-frame.svg"} className="absolute bottom-0" alt="unit icon frame"/>
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

const makeUnitTexts = (name?: string, designation?: string, desc?: string, parentDesc?: string, staffComment?: string, debug: boolean = false) => {
  const red = debug ? "bg-red-500/80" : "bg-transparent";
  const pink = debug ? "bg-pink-500/80" : "bg-transparent";
  const yellow = debug ? "bg-yellow-500/80" : "bg-transparent";
  const blue = debug ? "bg-blue-500/80" : "bg-transparent";
  const green = debug ? "bg-green-500/80" : "bg-transparent";

  return (
    <>
      <div className="absolute right-full flex flex-col h-full px-[1px] w-[30px] justify-between">
        <div className={`flex-1 text-right ${red}`}>{name ?? ""}</div>
        <div className={`flex-1 text-right flex flex-col justify-end ${pink}`}>{designation ?? ""}</div>
      </div>

      <div className="absolute left-full flex flex-col h-full px-[1px] w-[30px] justify-between">
        <div className={`text-unit-s flex-1 ${yellow}`}>{staffComment ?? ""}</div>
        <div className={`text-unit-s flex-1 flex flex-col justify-center ${blue}`}>{parentDesc ?? ""}</div>
        <div className={`text-unit-s flex-1 flex flex-col justify-end ${green}`}>{desc ?? ""}</div>
      </div>
    </>
  );
}