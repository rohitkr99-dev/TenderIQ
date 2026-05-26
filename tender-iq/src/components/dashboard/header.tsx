"use client"

import { User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "@/components/dashboard/global-search"
import { NotificationCenter } from "@/components/dashboard/notification-center"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-6 backdrop-blur">
      <div className="flex flex-1 items-center gap-4">
        <GlobalSearch />
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <NotificationCenter />
        <div className="flex items-center gap-3 border-l pl-4">
          <div className="text-right">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Manager</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  )
}
