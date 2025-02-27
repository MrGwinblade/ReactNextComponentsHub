'use client'

import Image from "next/image";
import { Container,Title } from "@/components/shared";
import { Slider } from "@/components/shared/slider/slider";
import { Sidebar } from "@/components/shared/sidebar";
import { ComponentDisplay } from "@/components/shared/component-display";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import dynamic from "next/dynamic"


const DynamicIconGrid = dynamic(
  () => import("@/components/shared/iconGrid/icon-grid").then((mod) => mod.IconGrid),
  { ssr: false },
)

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const component = searchParams.get("component")

  const onComponentSelect = useCallback(
    (componentName: string) => {
      router.push(`/?component=${componentName}`)
    },
    [router],
  )
  return (
    <div>
      <Container className="relative flex h-screen bg-[#f6f9fc]">
      <Sidebar className="w-[20%] p-4 min-w-[150px] bg-[#f6f9fc]" onComponentSelect={onComponentSelect} selectedComponent={component} />
      <ComponentDisplay className="p-4 flex-1 items-center text-center bg-white my-[20px] rounded-lg shadow-lg" selectedComponent={component} DynamicIconGrid={DynamicIconGrid}/>
      
      </Container>
    </div>
  );
}
