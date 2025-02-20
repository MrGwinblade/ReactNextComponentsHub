"use client"

import type React from "react"
import { Title } from "../title"
import { cn } from "@/shared/lib/utils"
import Link from 'next/link';

interface Props {
  id: number
  name: string
  description: string
  imageUrl?: string
  className?: string
}

export const ItemCardv2: React.FC<Props> = ({ id, name, description, imageUrl, className }) => {
  return (
    <div className={cn("group h-[400px] w-[80%] perspective", className)}>
      <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front of the card */}
        <div className="absolute inset-0">
          <div className="flex h-full flex-col items-center justify-center rounded-lg bg-secondary py-4 ">
            <img className="h-[100%] w-[100%] rounded-t-lg object-cover" src={imageUrl || "/placeholder.svg"} alt={name} />
            <Title text={description} size="sm" className="mt-1 mb-1 font-serif text-base" />
          </div>
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 h-full w-full rounded-lg bg-zinc-900 px-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex h-full flex-col items-center justify-center">
          <Link href={`/product/${id}`}>
            <Title text={name} size="sm" className="mb-2 font-bold text-white" />
          </Link>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

