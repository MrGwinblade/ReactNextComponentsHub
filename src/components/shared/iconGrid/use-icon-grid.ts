"use client"

import { useState, useCallback } from "react"
import type { DropResult } from "react-beautiful-dnd"

interface ColorSquare {
  id: string
  color: string
}

const generateRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

const generateUniqueColors = (count: number): ColorSquare[] => {
  const colors: ColorSquare[] = []
  const usedColors = new Set()

  for (let i = 0; i < count; i++) {
    let color
    do {
      color = generateRandomColor()
    } while (usedColors.has(color))

    usedColors.add(color)
    colors.push({ id: `square-${i + 1}`, color })
  }

  return colors
}

export const useIconGrid = () => {
  const [squares, setSquares] = useState<ColorSquare[]>(() => generateUniqueColors(6))

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return

      const newSquares = Array.from(squares)
      const [reorderedItem] = newSquares.splice(result.source.index, 1)
      newSquares.splice(result.destination.index, 0, reorderedItem)

      setSquares(newSquares)
    },
    [squares],
  )

  return { squares, onDragEnd }
}

