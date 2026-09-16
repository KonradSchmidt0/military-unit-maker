import { useAdvanceChildManagingStore } from "../../../hooks/useAdvanceChildManagingStore"
import { usePhaseStore } from "../../../hooks/usePhaseStore";
import { processSignature } from "../../../hooks/useUnitInteractionsStore";
import { useUnitStore } from "../../../hooks/useUnitStore";
import AdvanceChildEditorsParentDisplay from "./AdvanceChildEditorsParentDisplay";
import AdvanceChildEdittingTable from "./AdvanceChildEdittingTable";

export default function AdvanceChildEditor() {
  const { selectedParentSignature, Close } = useAdvanceChildManagingStore()
  const { unitMap, trueRootId } = useUnitStore()
  const { currentPhase: phase } = usePhaseStore()

  if (!selectedParentSignature)
    return null

  const parentId = processSignature(selectedParentSignature, unitMap, trueRootId, phase)
  if (!parentId)
    return null

  const parent = unitMap[parentId]
  if (!parent || parent.type !== "org")
    return null

  return (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="dark:bg-bg bg-primary w-fit max-w-[80vw] max-h-[80vh] rounded-xl shadow-lg p-6 relative overflow-y-auto">
        <button
          className="absolute top-4 right-4 btn-emoji"
          onClick={() => Close()}
        >
          ❌
        </button>

        <div className="flex flex-row w-full gap-12 py-4">
          <h2 className="text-2xl font-bold mb-4">Advance Child Editor</h2>
          <AdvanceChildEditorsParentDisplay parentId={parentId} parentSignature={selectedParentSignature}/>
          <div/>
        </div>
        <div className="text-sm">
          <AdvanceChildEdittingTable parent={parent} parentId={parentId} parentSignature={selectedParentSignature}/>
        </div>
          
      </div>
    </div>
  );
}