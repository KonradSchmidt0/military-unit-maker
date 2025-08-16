import { useTextOptionStore } from "../../hooks/useTextOptionStore";
import { DesignationPack } from "../../logic/designationPack";

interface UnitDisplayTextsProps {
  name?: string;
  desc?: string;
  designationPack?: DesignationPack
  debug?: boolean;
  rightOffset?: number;
}

export function UnitDisplayTexts({
  name,
  desc,
  designationPack = {},
  debug = false,
  rightOffset = 0,
}: UnitDisplayTextsProps) {
  const {shouldAllTextDisplay, shouldUnitTypeNameDisplay } = useTextOptionStore(s => s)

  if (!shouldAllTextDisplay) {
    return null
  }

  const red = debug ? "bg-red-500/80" : "bg-transparent";
  const pink = debug ? "bg-pink-500/80" : "bg-transparent";
  const yellow = debug ? "bg-yellow-500/80" : "bg-transparent";
  const blue = debug ? "bg-blue-500/80" : "bg-transparent";
  const green = debug ? "bg-green-500/80" : "bg-transparent";

  return (
    <>
      {/* Left block */}
      <div className="absolute right-full flex flex-col h-full px-[1px] w-[30px] justify-between pointer-events-none">
        {shouldUnitTypeNameDisplay && <div className={`flex-1 text-right ${red}`}>{TruncateName(name)}</div>}
        <div
          className={`flex-1 text-right flex flex-col justify-end ${pink}`}
        >
          {TruncateName(designationPack.staffName ?? designationPack.callSignFromParent)}
        </div>
      </div>

      {/* Right block */}
      <div
        style={{
          left: `calc(100% + ${rightOffset * 6}px)`,
          top: `calc(0% + ${rightOffset * 6}px)`,
        }}
        className="absolute flex flex-col h-full px-[1px] w-[30px] justify-between pointer-events-none font-medium dark:font-normal"
      >
        <div className={`text-unit-s flex-1 ${yellow}`}>
          {TruncateDesc(designationPack.staffComment)}
        </div>
        <div
          className={`text-unit-s flex-1 flex flex-col justify-center ${blue}`}
        >
          {TruncateDesc(designationPack.descFromParent)}
        </div>
        <div
          className={`text-unit-s flex-1 flex flex-col justify-end ${green}`}
        >
          {TruncateDesc(desc)}
        </div>
      </div>
    </>
  );
}

// --- helpers ---
function Truncate(t: string, length: number) {
  if (t.length <= length) return t;
  return t.slice(0, length) + "...";
}

function TruncateDesc(t?: string): string {
  return Truncate(t ?? "", 35);
}

function TruncateName(t?: string): string {
  return Truncate(t ?? "", 17);
}
