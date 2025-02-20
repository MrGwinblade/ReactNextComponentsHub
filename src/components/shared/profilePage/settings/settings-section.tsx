"use client"

import type React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SettingsTab {
  id: string
  label: string
  content: React.ReactNode
}

interface SettingsTabsProps {
  tabs: SettingsTab[]
  defaultTab?: string
}

export function SettingsSection({ tabs, defaultTab }: SettingsTabsProps) {
  return (
    <Tabs defaultValue={defaultTab || tabs[0].id}>
      <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

