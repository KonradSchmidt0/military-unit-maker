import { useUnitStore } from "../../../hooks/useUnitStore"

interface props {
  
}

// Im too lazy to rename and its a bit funny
export function ResetRemporaryRootButton(p: props) {
  const { actingRootPath, setActingRootPath } = useUnitStore(s => s)

  const dis = actingRootPath.toString() === [].toString()

  return <button onClick={() => setActingRootPath([])} className="btn-emoji" disabled={dis}>❌🦒📌</button>
}