"use client"

import { Sidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import { GlobalAIAssistant } from "@/components/shared/global-ai-assistant"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-muted/20">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {children}
          </div>
        </main>
      </div>
      <GlobalAIAssistant />
    </div>
  )
}
