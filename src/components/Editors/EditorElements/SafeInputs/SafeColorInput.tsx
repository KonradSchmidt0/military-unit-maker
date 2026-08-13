// Problem: When using color picker, onChange is called if user makes even smallest of adjustments, 
//   therefore calling update in stores every frame
// Solution: This component

import { useEffect, useState } from "react";

interface props {
  updateDelayInMs?: number,
  color: `#${string}`
  update: (color: `#${string}`) => void
  additionalClassname?: string
}

const DEFAULT_DELAY_IN_MS = 120

export default function SafeColorInput(p: props) {
  const [color, setColor] = useState<`#${string}`>("#")

  useEffect(() => {
    const timeout = setTimeout(() => {
      p.update(color);
    }, p.updateDelayInMs ?? DEFAULT_DELAY_IN_MS);

    return () => clearTimeout(timeout);
  }, [color]);

  useEffect(() =>  {
    setColor(p.color)
  }, [p.color])

  return (
    <input
      id="ColorPickerInputId"
      type="color"
      value={color}
      onChange={(e) => {
        setColor(e.target.value as `#${string}`);
      }}
      className={"editor-element !p-0 " + p.additionalClassname}
    />
  )
}