"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle2, Clock, AlertTriangle, FileText } from "lucide-react"

interface ProcurementItem {
  materialName: string
  quantity: number | string
  unit: string
  leadTime: number
  recommendedOrderDate: string
  dependencies?: string
  status?: "pending" | "ordered" | "delivered" | "delayed"
}

interface ProcurementScheduleProps {
  schedule: ProcurementItem[]
  onStatusChange?: (index: number, status: ProcurementItem["status"]) => void
}

export function ProcurementSchedule({ schedule, onStatusChange }: ProcurementScheduleProps) {
  const getStatusBadge = (status: ProcurementItem["status"]) => {
    switch (status) {
      case "ordered":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none">Ordered</Badge>
      case "delivered":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none">Delivered</Badge>
      case "delayed":
        return <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-none">Delayed</Badge>
      default:
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
    }
  }

  const getStatusIcon = (status: ProcurementItem["status"]) => {
    switch (status) {
      case "ordered":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4 text-rose-500" />
      default:
        return <Calendar className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Material Procurement Schedule</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">Export PDF</Button>
          <Button variant="outline" size="sm" className="h-8">Export Excel</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-xs uppercase font-bold tracking-wider">Material</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Quantity</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Lead Time</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Order By</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Dependencies</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((item, index) => (
              <TableRow key={index} className="group hover:bg-muted/30 border-border/50 transition-colors">
                <TableCell className="font-medium">{item.materialName}</TableCell>
                <TableCell>
                  <span className="text-sm">
                    {item.quantity} {item.unit}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {item.leadTime} days
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {item.recommendedOrderDate}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground italic">
                    {item.dependencies || "None"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status || "pending")}
                    {getStatusBadge(item.status || "pending")}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {schedule.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No procurement items generated.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
