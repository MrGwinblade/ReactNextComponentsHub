import type React from "react"
import { cn } from "@/shared/lib/utils"
import { SidebarItem } from "./sidebar-item"

interface Props {
  className?: string
  onComponentSelect: (componentName: string) => void
  selectedComponent: string | null
}

export const Sidebar: React.FC<Props> = ({ className, onComponentSelect, selectedComponent }) => {
  const components = [
    { name: "CheckBoxList", path: "checkBoxList" },
    { name: "Slider", path: "slider" },
    { name: "BurgerList", path: "burgerList" },
    { name: "IconGrid", path: "iconGrid" },
    { name: "TextForm", path: "textForm" },
    { name: "GridList", path: "gridList" },
    { name: "GridListv2", path: "gridListv2" },
    { name: "PopUpMenu", path: "popUpMenu" },
    { name: "PopUpMenuv2", path: "popUpMenuv2" },
    { name: "RegisterForm", path: "registerForm" },
    { name: "LoginForm", path: "loginForm" },
    { name: "CheckLogin", path: "checkLogin" },
    { name: "Full Gallery Template", path: "fullGalleryTemplate" },
    { name: "Profile", path: "profileButton" },

    // Add more components here
  ]

  return (
    <nav className={cn("bg-gray-100  border-gray-200", className)}>
      <ul className="space-y-2">
        {components.map((component) => (
          <SidebarItem
            key={component.path}
            name={component.name}
            path={component.path}
            isSelected={selectedComponent === component.path}
            onClick={() => onComponentSelect(component.path)}
          />
        ))}
      </ul>
    </nav>
  )
}

