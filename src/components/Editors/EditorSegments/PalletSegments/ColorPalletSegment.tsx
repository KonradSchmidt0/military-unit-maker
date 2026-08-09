import { useState } from "react";
import { useColorPalletStore } from "../../../../hooks/useColorPalletStore";

export default function ColorPalletSegment() {
  const [ mini, SetMini ] = useState(true)

  const { colorMap, removeAtIndex, changeAtIndex, add } = useColorPalletStore()

  const top = (<>
    <div className="w-full text-lg font-bold">
      Color Pallet
    </div>
    <button
      onClick={() => SetMini(!mini)}
      className="btn-emoji !p-0 absolute right-0"
    >
      {mini ? "⬇️" : "❌"}
    </button>
  </>)

  const list = (<>
    {colorMap.map((entry, i) => (
      <div className="editor-segment-row" key={entry.uId}>
        <div className="editor-element-static !px-2">
          {(i + 1) + ")"}
        </div>
        <input
          type="color"
          value={entry.color}
          onChange={(e) => {
            const c = e.target.value as `#${string}`
            changeAtIndex(i, (prev) => ({...prev, color: c}));
          }}
          className="editor-element !p-0 !h-8 !w-6"
        />
        <input
          type="text"
          id={entry.uId}
          value={entry.name}
          onChange={(e) => {
            changeAtIndex(i, (prev) => ({...prev, name: e.target.value}))
          }}
          className="editor-element !w-40"
        />
        <button
          onClick={() => removeAtIndex(i)}
          className="btn-emoji !p-0"
        >❌</button>
      </div>
    ))}
    
    <div className="editor-segment-row" key="Addnew">
      <button
        onClick={() => add({uId: crypto.randomUUID(), color: "#aaaaaa", name: ""})}
        className="btn-emoji !p-0"
      >➕</button>
    </div>
  </>)

  return (
    <div className="editor-segment-flex">
      <div className="relative editor-segment-row !w-full">{top}</div>

      {!mini && <div className="editor-segment flex flex-col gap-1 !border-0">{list}</div>}
    </div>
  )
}