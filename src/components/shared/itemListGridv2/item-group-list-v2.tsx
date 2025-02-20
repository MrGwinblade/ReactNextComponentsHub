"use client"

import React from "react"
import { useIntersection } from "react-use"
import { Title } from "../title"
import { cn } from "@/shared/lib/utils"
import { ItemCardv2 } from "./item-card-v2"

interface Props {
  title: string
  items: any[]
  categoryId?: number
  className?: string
  listClassName?: string
}

export const ItemsGroupListv2: React.FC<Props> = ({ title, items, listClassName, categoryId, className }) => {
  const intersectionRef = React.useRef<HTMLDivElement | null>(null)
  const intersection = useIntersection(intersectionRef, {
    threshold: 0.4,
  })

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      console.log(title)
      console.log(categoryId)
      //setActiveCategoryId(categoryId)
    }
  }, [categoryId, intersection?.isIntersecting, title])

  return (
    <div className={cn("",className)} id={title} ref={intersectionRef}>
      <Title text={title} size="lg" className="mb-5 font-extrabold" />

      <div className={cn("grid grid-cols-2 gap-[20px]", listClassName)}>
        {items.map((item) => (
          <ItemCardv2
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}

