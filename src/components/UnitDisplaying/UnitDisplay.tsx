import Color from "color";
import { RecoloredImage } from "../RecoloredPicture";
import { useEchelonStore } from "../../hooks/useEchelonStore";
import { useUnitQuick } from "../../hooks/useUnitStore";
import { DesignationPack } from "../../logic/designationPack";
import { UnitStackShadow } from "./UnitStackShadow";

interface UnitDisplayProps {
  unitId: string;
  color: `#${string}`
  style?: {}
  className?: string
  onClick?: (e: any) => void
  showText?: boolean
  designationPack?: DesignationPack
  countInParent?: number
}

export function UnitDisplay({ unitId, color, style, className, onClick, showText = true, designationPack: dp, countInParent }: UnitDisplayProps) {
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
        style={{backgroundColor: color, ...style}}
        className={"relative w-14 aspect-[243/166] cursor-pointer transition-shadow " + className}
        onClick={onClick}
      >
        {unit.layers.map((src, index) => (
          makeLayer(index, src, color as `#${string}`)
        ))}
        {echelonElement}

        {showText && makeUnitTexts(unit.name, dp?.callSignFromParent, dp?.staffName, unit.desc, dp?.descFromParent, dp?.staffComment, false, (countInParent ?? 1) - 1 )}

        <img src={process.env.PUBLIC_URL + "/icons/b-frame.svg"} className="absolute bottom-0 z-[5]" alt="unit icon frame"/>
        {countInParent && <UnitStackShadow stack={countInParent - 1} color={color} style={style ?? {}}/>}
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
    key={index + "layer"}
    src={src}
    alt=""
    className={cn}
    style={style}
  />
}

const makeUnitTexts = (name?: string, designation?: string, staffName?: string, desc?: string, parentDesc?: string, staffComment?: string, debug: boolean = false, rightOffset: number = 0) => {
  const red = debug ? "bg-red-500/80" : "bg-transparent";
  const pink = debug ? "bg-pink-500/80" : "bg-transparent";
  const yellow = debug ? "bg-yellow-500/80" : "bg-transparent";
  const blue = debug ? "bg-blue-500/80" : "bg-transparent";
  const green = debug ? "bg-green-500/80" : "bg-transparent";

  return (
    <>
      <div className="absolute right-full flex flex-col h-full px-[1px] w-[30px] justify-between pointer-events-none">
        <div className={`flex-1 text-right ${red}`}>{TruncateName(name)}</div>
        <div className={`flex-1 text-right flex flex-col justify-end ${pink}`}>{TruncateName(staffName ?? designation)}</div>
      </div>

      <div style={{left: `calc(100% + ${rightOffset * 6}px)`,top: `calc(0% + ${rightOffset * 6}px)`}} className="absolute flex flex-col h-full px-[1px] w-[30px] justify-between pointer-events-none font-medium dark:font-normal">
        <div className={`text-unit-s flex-1 ${yellow}`}>{TruncateDesc(staffComment)}</div>
        <div className={`text-unit-s flex-1 flex flex-col justify-center ${blue}`}>{TruncateDesc(parentDesc)}</div>
        <div className={`text-unit-s flex-1 flex flex-col justify-end ${green}`}>{TruncateDesc(desc)}</div>
      </div>
    </>
  );
}

function Truncate(t: string, length: number) {
  if (t.length <= length)
    return t;

  return t.slice(0, length) + "..."
}

function TruncateDesc(t?: string): string {
  return Truncate(t ?? "", 35)
}

function TruncateName(t?: string): string {
  return Truncate(t ?? "", 17)
}