"use client"

import type React from "react"
import { Plus, Minus, ChevronDown, ChevronUp, Menu } from "lucide-react"

import { useBurgerList } from "./use-burger-list"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Props {

  className?: string;
}

export const BurgerList: React.FC<Props> = ( { className }) => {
  const { items, addItem, removeItem } = useBurgerList()
  const [isOpen, setIsOpen] = useState(false)

  const toggleList = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className={cn("max-w-md mx-auto", className)}>
     <div className="flex items-center justify-center mb-4">
       
        
        {/* Заголовок */}
        <h2 className="text-2xl font-bold">Бургер список</h2>

      </div>
       {/* Кнопка с тремя черточками */}
      <button
          onClick={toggleList}
          className="p-2 rounded bg-gray-200 flex items-center justify-center mr-4"
        >
          <Menu size={24} />
        </button>
 

      {isOpen && (
        <div>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-center justify-between bg-white p-2 rounded shadow">
                <span>{item}</span>
                <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                  <Minus size={20} />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={addItem}
            className="mt-4 bg-blue-500 text-white p-2 rounded flex items-center justify-center w-full"
          >
            <Plus size={20} className="mr-2" /> Добавить элемент
          </button>
        </div>
      )}
    </div>
  )
}