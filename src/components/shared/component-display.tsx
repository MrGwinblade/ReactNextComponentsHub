import type React from "react"
import { CheckboxFiltersGroup } from "./checkBoxList/checkbox-filters-group"
import { Slider } from "./slider/slider"
import { Filters } from "./checkBoxList/filters"
import { cn } from "@/shared/lib/utils"
import { BurgerList } from "./burgerList/burger-list"
import {  } from "./iconGrid/icon-grid"
import { TextForm } from "./richTextEditor/text-form"
import { ItemsGroupList } from "./itemListGrid/item-group-list"
import { ItemsGroupListv2 } from "./itemListGridv2/item-group-list-v2"
import { PopupMenu } from "./popupMenu/popup-menu"
import { PopupMenuv2 } from "./popupMenu/popup-menuv2-floatingui"
import { RegisterForm } from "./auth/forms/register-form"
import { LoginForm } from "./auth/forms/login-form"
import { CheckLogin } from "./auth/forms/checkLogin"
import { FullGalleryTemplate } from "./fullGalleryTemplate/full-gallery-template"
import { ProfilePage } from "./profilePage/profile-page"
import { ProfileButton } from "./profilePage/profile-button"



interface Props {
  className?: string
  selectedComponent: string | null
  DynamicIconGrid: React.ComponentType
}
const testItems: { id: number; name: string; imageUrl?: string; className?: string }[] = [
  { id: 1, name: 'item1Description Lorem ipsum dolor sit, amet consectetur adipisicing elit.', imageUrl: 'Screenshot_1.png', className: 'item-class-1' },
  { id: 2, name: 'item2Description', imageUrl: 'Screenshot_1.png', className: 'item-class-2' },
  { id: 3, name: 'item3Description', imageUrl: 'Screenshot_1.png' ,className: 'item-class-3' }, // imageUrl не указан
  { id: 1, name: 'item1Description Lorem ipsum dolor sit, amet consectetur adipisicing elit.', imageUrl: 'Screenshot_1.png', className: 'item-class-1' },
  { id: 1, name: 'item1Description Lorem ipsum dolor sit, amet consectetur adipisicing elit.', imageUrl: 'Screenshot_1.png', className: 'item-class-1' },
  { id: 1, name: 'item1Description Lorem ipsum dolor sit, amet consectetur adipisicing elit.', imageUrl: 'Screenshot_1.png', className: 'item-class-1' },
  { id: 1, name: 'item1Description Lorem ipsum dolor sit, amet consectetur adipisicing elit.', imageUrl: 'Screenshot_1.png', className: 'item-class-1' },
  { id: 1, name: 'item1Description Lorem ipsum dolor sit, amet consectetur adipisicing elit.', imageUrl: 'Screenshot_1.png', className: 'item-class-1' },
  { id: 1, name: 'item1Description Lorem ipsum dolor sit, amet consectetur adipisicing elit.', imageUrl: 'Screenshot_1.png', className: 'item-class-1' },
  { id: 1, name: 'item1Description Lorem ipsum dolor sit, amet consectetur adipisicing elit.', imageUrl: 'Screenshot_1.png', className: 'item-class-1' },

]
const testItems2: { id: number; name: string; imageUrl?: string; className?: string; description: string }[] = [
  { id: 1, name: 'item1', description: 'item1Description', imageUrl: '/Screenshot_1.png', className: 'item-class-1' },
  { id: 2, name: 'item2', imageUrl: 'Screenshot_1.png', description: 'item2Description', className: 'item-class-2' },
  { id: 3, name: 'item3', description: 'item3Description', className: 'item-class-3' }, // imageUrl не указан
]


export const ComponentDisplay: React.FC<Props> = ({ className, selectedComponent, DynamicIconGrid }) => {
  const renderComponent = () => {
    switch (selectedComponent) {
      case "checkBoxList":
        return <Filters/>
      case "slider":
        return <Slider />
      case "burgerList":
        return <BurgerList/>
      case "iconGrid":
        return <DynamicIconGrid />
      case "textForm":
        return <TextForm />
      case "gridList":
        return <ItemsGroupList title="items" items={testItems} categoryId={1}/>
      case "gridListv2":
        return <ItemsGroupListv2 title="items" items={testItems2} categoryId={1}/>
      case "popUpMenu":
        return <PopupMenu />
      case "popUpMenuv2":
        return <PopupMenuv2 />
      case "registerForm":
        return <RegisterForm />
      case "loginForm":
        return <LoginForm />
      case "checkLogin":
        return <CheckLogin />
      case "fullGalleryTemplate":
        return <FullGalleryTemplate />
      case "profileButton":
        return <ProfileButton />
      default:
        return <div>Select a component from the sidebar to view it.</div>
    }
  }

  return (
    <div className={cn("border-l border-gray-200", className)}>
      <div className="max-w-3xl mx-auto">{renderComponent()}</div>
    </div>
  )
}

