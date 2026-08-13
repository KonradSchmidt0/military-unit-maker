interface Props {
  children: React.ReactNode
  indexInList: number
  onDragStart: (index: number) => void
  onDragEnter: (receiverIndex: number) => void
  onDragEnd: () => void
}

export default function DraggableListElement(p: Props) {
  return (
    <div
      // It should be good enough, since this component is just a wrapper for a child, which is actully the complicated part
      key={p.indexInList}
      draggable
      onDragStart={() => p.onDragStart(p.indexInList)}
      onDragEnter={() => p.onDragEnter(p.indexInList)}
      onDragEnd={p.onDragEnd}
    >
      {p.children}
    </div>
  )
}