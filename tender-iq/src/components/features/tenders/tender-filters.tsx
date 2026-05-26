"use client"

import { useState } from "react"
import { Filter, X, ChevronDown, Calendar, DollarSign, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TenderStatus } from "@prisma/client"
import { motion, AnimatePresence } from "framer-motion"

interface TenderFiltersProps {
  onFilterChange: (filters: any) => void
}

export function TenderFilters({ onFilterChange }: TenderFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    minValue: "",
    maxValue: "",
    startDate: "",
    endDate: "",
  })

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const reset = {
      status: "",
      minValue: "",
      maxValue: "",
      startDate: "",
      endDate: "",
    }
    setFilters(reset)
    onFilterChange(reset)
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== "").length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className={activeFilterCount > 0 ? "border-primary text-primary" : ""}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 rounded-full px-1 py-0 text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 rounded-xl border bg-card shadow-sm">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">All Statuses</option>
                  {Object.values(TenderStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Min Value
                </label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minValue}
                  onChange={(e) => handleChange("minValue", e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Max Value
                </label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxValue}
                  onChange={(e) => handleChange("maxValue", e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Start Date
                </label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="h-9 block"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> End Date
                </label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="h-9 block"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
