import { useState, useEffect } from "react";
import { simpleHover, useHoverStore } from "../../../hooks/useHoverStore";

interface props {
  count: number
  onCountChange: (newCount: number) => void
  key?: string
  className?: string
  hover?: simpleHover
}

export function SafeNumberInput(p: props) {
  const [tempCount, setTempCount] = useState(p.count.toString());
  const { callSimpleI, callOff } = useHoverStore(s => s)

  useEffect(() => {
    if (p.count.toString() !== tempCount) {
      setTempCount(p.count.toString());
    }
  }, [p.count]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTempCount(val);

    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      p.onCountChange(parsed);
    }
  };

  return <input
        id={p.key}
        type="number"
        className={"editor-element !w-16 " + p.className}
        value={tempCount}
        onChange={handleChange}
        onMouseEnter={() => { if (p.hover) callSimpleI(p.hover) }}
        onMouseLeave={() => callOff()}
      />
}