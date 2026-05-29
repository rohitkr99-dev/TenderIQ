"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShoppingCart, Package, Truck, CheckCircle } from "lucide-react"

interface TrackerStats {
  total: number
  ordered: number
  delivered: number
  pending: number
}

interface ProcurementTrackerProps {
  stats: TrackerStats
}

export function ProcurementTracker({ stats }: ProcurementTrackerProps) {
  const orderedPercentage = (stats.ordered / stats.total) * 100
  const deliveredPercentage = (stats.delivered / stats.total) * 100

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="outline">{stats.total} Total</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Total Materials</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
      </Card>

      <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">{stats.ordered} Active</Badge>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Ordered</p>
            <p className="text-2xl font-bold">{stats.ordered}</p>
          </div>
          <Progress value={orderedPercentage} className="h-1.5 bg-blue-500/20" />
        </div>
      </Card>

      <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Truck className="h-5 w-5 text-emerald-500" />
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{stats.delivered} Complete</Badge>
        </div>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">Delivered</p>
            <p className="text-2xl font-bold">{stats.delivered}</p>
          </div>
          <Progress value={deliveredPercentage} className="h-1.5 bg-emerald-500/20" />
        </div>
      </Card>

      <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 rounded-lg bg-rose-500/10">
            <CheckCircle className="h-5 w-5 text-rose-500" />
          </div>
          <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">{stats.pending} Alert</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">Pending Order</p>
          <p className="text-2xl font-bold">{stats.pending}</p>
        </div>
      </Card>
    </div>
  )
}
