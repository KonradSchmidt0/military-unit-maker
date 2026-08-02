import { useEffect } from "react";
import { useTreeLineStore } from "../../../hooks/useTreeLineStore"

interface p {
  path: number[] 
}

export default function TreeLineRefPoint(p: p) {
  const { refs, registerRef, unregisterRef } = useTreeLineStore(s => s)

  const pathStr = p.path.toString()

  useEffect(() => {
    registerRef(p.path);
    return () => unregisterRef(p.path);
  }, [pathStr]);

  const pair = refs.get(pathStr)

  return <div
    ref={pair?.setEl}  // callback ref instead of object ref
    className="TREE_LINE_REF_POINT" // For easier debug, no acctual class named like this
  >
    <div className="absolute w-0 h-0 bg-pink-500/0"/>
  </div>
}