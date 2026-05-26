"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ActivityFeed from "@/components/features/team/activity-feed"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TenderFilters } from "@/components/features/tenders/tender-filters"

interface DashboardClientProps {
  user: {
    name?: string | null
    role?: string | null
    companyId?: string | null
  }
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [tenders, setTenders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const fetchTenders = async () => {
      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams(filters as any).toString()
        const response = await fetch(`/api/tenders?${queryParams}`)
        if (response.ok) {
          const data = await response.json()
          setTenders(data)
        }
      } catch (error) {
        console.error("Failed to fetch tenders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenders()
  }, [filters])

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {user.name || "User"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your current tender activities and AI risk alerts.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Tenders"
          value={tenders.filter(t => t.status === 'ACTIVE').length.toString()}
          icon={FileText}
          trend={{ value: 8, label: "from last month", isPositive: true }}
        />
        <StatsCard
          title="Win Ratio"
          value="64%"
          icon={TrendingUp}
          trend={{ value: 2.1, label: "from last quarter", isPositive: true }}
        />
        <StatsCard
          title="Submitted Bids"
          value="45"
          icon={CheckCircle2}
          description="Last 30 days"
        />
        <StatsCard
          title="AI Risk Alerts"
          value="3"
          icon={AlertCircle}
          className="border-destructive/50"
          description="High risk clauses detected"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart />
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Win Ratio</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[350px]">
             <div className="text-center">
               <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary/60">64%</div>
               <p className="text-muted-foreground mt-2">Win ratio over the last 6 months</p>
               <div className="mt-4 flex items-center justify-center gap-2">
                 <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none px-3 py-1">
                   +12% from last month
                 </Badge>
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 pb-10">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Tender Overview</h2>
            <TenderFilters onFilterChange={handleFilterChange} />
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {isLoading ? (
              <div className="col-span-full flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
              </div>
            ) : tenders.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed text-center bg-muted/20">
                <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">No tenders found matching your filters.</p>
                <Button variant="link" onClick={() => handleFilterChange({})} className="mt-1">Clear all filters</Button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {tenders.map((tender, i) => (
                  <motion.div
                    key={tender.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="group rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant={tender.status === 'ACTIVE' ? 'default' : 'secondary'} className="rounded-md font-bold text-[10px] uppercase tracking-wider">
                        {tender.status}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                        {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : 'No deadline'}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {tender.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10 leading-relaxed">
                      {tender.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="text-base font-bold">
                        ${tender.estimatedValue?.toLocaleString() || '0'}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                        <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                           <FileText className="h-2 w-2 text-primary" />
                        </div>
                        {tender.project?.name || "Global"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
        <div className="col-span-3 h-full">
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}
