import React, { useState } from "react"
import DraggableListElement from "./DraggableListElement"

interface Props {
  childrenList: React.ReactNode[]
  onHandleDragEnter: (receiverIndex: number, giverIndex: number) => void
}

export default function DraggableList(p: Props) {
  const [giverIndex, setGiverIndex] = useState<number | null>(null);
  
  const handleDragStart = (index: number) => {
    setGiverIndex(index);
  };

  const handleDragEnter = (receiverIndex: number) => {
    if (giverIndex === null || giverIndex === receiverIndex) return;

    p.onHandleDragEnter(receiverIndex, giverIndex)

    setGiverIndex(receiverIndex);
  };

  const handleDragEnd = () => {
    setGiverIndex(null);
  };

  return (
    <div className="flex flex-col gap-1 items-center">
      {React.Children.map(p.childrenList, (child, i) => (
        <DraggableListElement
          indexInList={i}
          onDragStart={() => handleDragStart(i)}
          onDragEnter={() => handleDragEnter(i)}
          onDragEnd={handleDragEnd}
        >
          {child}
        </DraggableListElement>
      ))}
    </div>
  )
}