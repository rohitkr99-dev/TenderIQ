"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingCart, 
  Calendar, 
  Plus, 
  Sparkles, 
  Loader2, 
  Filter,
  Search,
  LayoutDashboard,
  Box
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProcurementSchedule } from "@/components/features/procurement/procurement-schedule"
import { DependencyChart } from "@/components/features/procurement/dependency-chart"
import { ProcurementTracker } from "@/components/features/procurement/procurement-tracker"
import axios from "axios"

export default function ProcurementPage() {
  const [loading, setLoading] = useState(false)
  const [tenders, setTenders] = useState<any[]>([])
  const [selectedTenderId, setSelectedTenderId] = useState<string>("")
  const [schedule, setSchedule] = useState<any[]>([])
  const [dependencies, setDependencies] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    ordered: 0,
    delivered: 0,
    pending: 0
  })

  useEffect(() => {
    fetchTenders()
  }, [])

  const fetchTenders = async () => {
    try {
      const response = await axios.get("/api/tenders")
      setTenders(response.data)
    } catch (error) {
      console.error("Failed to fetch tenders:", error)
    }
  }

  const generateSchedule = async () => {
    if (!selectedTenderId) return

    setLoading(true)
    try {
      // For demo purposes, we'll use a sample BOQ data if we can't find real BOQs
      // In a real scenario, we would fetch BOQs for the selected tender
      const sampleBoqData = [
        { description: "Reinforcement Steel (12mm)", quantity: 50, unit: "tons" },
        { description: "Ready Mix Concrete C30", quantity: 500, unit: "m3" },
        { description: "Ceramic Floor Tiles", quantity: 2000, unit: "m2" },
        { description: "PVC Pipes 110mm", quantity: 300, unit: "pcs" },
        { description: "Glass Panel (Double Glazed)", quantity: 150, unit: "m2" }
      ]

      const response = await axios.post("/api/procurement/generate", {
        boqData: sampleBoqData,
        projectTimeline: "12-month construction project starting next month"
      })

      const generatedSchedule = response.data.schedule.map((item: any) => ({
        ...item,
        status: "pending"
      }))

      setSchedule(generatedSchedule)
      
      // Extract dependencies for the chart
      const deps = generatedSchedule
        .filter((item: any) => item.potentialDependencies)
        .map((item: any) => ({
          material: item.materialName,
          dependsOn: Array.isArray(item.potentialDependencies) 
            ? item.potentialDependencies 
            : [item.potentialDependencies]
        }))
      
      setDependencies(deps)
      
      setStats({
        total: generatedSchedule.length,
        ordered: 0,
        delivered: 0,
        pending: generatedSchedule.length
      })

    } catch (error) {
      console.error("Failed to generate schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Procurement Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered material procurement scheduling and dependency tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

      <Card className="p-6 border-none shadow-xl bg-card/50 backdrop-blur-md">
        <div className="grid gap-6 md:grid-cols-3 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground ml-1">Select Project/Tender</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedTenderId}
              onChange={(e) => setSelectedTenderId(e.target.value)}
            >
              <option value="">Choose a tender...</option>
              {tenders.map((tender) => (
                <option key={tender.id} value={tender.id}>{tender.title}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search materials or items..." />
            </div>
            <Button 
              onClick={generateSchedule} 
              disabled={loading || !selectedTenderId}
              className="gap-2 bg-primary hover:bg-primary/90 transition-all duration-300"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {schedule.length > 0 ? "Re-generate with AI" : "Generate Schedule"}
            </Button>
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {schedule.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <ProcurementTracker stats={stats} />

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProcurementSchedule schedule={schedule} />
              </div>
              <div className="space-y-8">
                <DependencyChart dependencies={dependencies} />
                <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Procurement Insights</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs font-bold text-amber-600 uppercase mb-1">Lead Time Alert</p>
                      <p className="text-sm">Long lead items (Glass, Elevators) should be ordered immediately to avoid project delays.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Optimization</p>
                      <p className="text-sm">Consolidating concrete orders for next month could result in a 5-8% bulk discount.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="p-6 rounded-full bg-muted/30 mb-4">
              <Box className="h-12 w-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-medium text-muted-foreground">No Procurement Schedule Yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Select a project and click "Generate Schedule" to see AI-powered material planning.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
