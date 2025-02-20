"use client"

import type React from "react"
import { useIconGrid } from "./use-icon-grid"
import { DragDropContext, Draggable } from "react-beautiful-dnd"
import { StrictModeDroppable } from "./strict-mode-droppable"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

export const IconGrid: React.FC<Props> = ( { className }) => {
  const { squares, onDragEnd } = useIconGrid()

  return (
    
    <div className={cn("max-w-2xl mx-auto", className)}>
      <h2 className="text-2xl font-bold mb-4">Цветные квадраты (Drag and Drop)</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="color-grid">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-3 gap-4">
              {squares.map((square, index) => (
                <Draggable key={square.id} draggableId={square.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-24 h-24 rounded shadow flex items-center justify-center"
                      style={{
                        backgroundColor: square.color,
                        ...provided.draggableProps.style,
                      }}
                    >
                      {square.id}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  )
}

export default IconGrid

