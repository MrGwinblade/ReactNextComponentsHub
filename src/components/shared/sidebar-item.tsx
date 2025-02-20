import type React from "react"
import { cn } from "@/shared/lib/utils"

interface Props {
  name: string
  path: string
  isSelected: boolean
  onClick: () => void
}

export const SidebarItem: React.FC<Props> = ({ name, path, isSelected, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left px-4 py-2 hover:bg-gray-200 transition-colors overflow-hidden",
          isSelected && "bg-blue-100 font-semibold underline",
        )}
      >
        {name}
      </button>
    </li>
  )
}

