"use client"

import { useState, useCallback } from "react"

export const useBurgerList = () => {
  const [items, setItems] = useState<string[]>(["Булочка", "Котлета", "Салат"])

  const addItem = useCallback(() => {
    const newItem = prompt("Введите название нового элемента:")
    if (newItem) {
      setItems((prevItems) => [...prevItems, newItem])
    }
  }, [])

  const removeItem = useCallback((index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index))
  }, [])

  return { items, addItem, removeItem }
}

