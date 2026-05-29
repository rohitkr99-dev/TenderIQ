"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileSearch,
  TableProperties,
  Users2,
  Settings,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

import Image from "next/image"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileSearch, label: "Tender Analyzer", href: "/dashboard/analyzer" },
  { icon: TableProperties, label: "BOQ Intelligence", href: "/dashboard/boq" },
  { icon: ClipboardCheck, label: "Vendor Comparison", href: "/dashboard/vendors" },
  { icon: CalendarDays, label: "Procurement Planner", href: "/dashboard/procurement" },
  { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
  { icon: Users2, label: "Team Management", href: "/dashboard/team" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded">
            <Image
              src="/images/tenderiq-logo.png"
              alt="TenderIQ"
              fill
              className="object-cover"
            />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight">TenderIQ</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
