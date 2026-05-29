"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Info, 
  Clock,
  DollarSign
} from "lucide-react"
import { motion } from "framer-motion"

interface AnalysisResultProps {
  data: {
    "Project Name"?: string
    "Deadlines"?: string | string[]
    "Summarized Requirements"?: string
    "Risk Clauses"?: string[]
    "Payment Terms"?: string
    "Liquidated Damages"?: string
    "Compliance Checklist"?: string[]
    "Executive Summary"?: string
  }
}

export function AnalysisResult({ data }: AnalysisResultProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6"
    >
      <motion.div variants={item}>
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{data["Project Name"] || "Tender Analysis"}</h2>
              <p className="mt-1 text-muted-foreground">{data["Executive Summary"]}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div variants={item}>
          <Card className="h-full p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Risk Clauses
            </div>
            <ul className="space-y-3">
              {data["Risk Clauses"]?.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Badge variant="outline" className="mt-0.5 shrink-0 border-orange-200 bg-orange-50 text-orange-700">
                    Risk
                  </Badge>
                  {risk}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold text-blue-500">
              <Calendar className="h-5 w-5" />
              Deadlines
            </div>
            <div className="space-y-4">
              {Array.isArray(data["Deadlines"]) ? (
                data["Deadlines"].map((d, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{d}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{data["Deadlines"]}</span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div variants={item}>
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold text-green-500">
              <CheckCircle2 className="h-5 w-5" />
              Compliance
            </div>
            <ul className="space-y-2">
              {data["Compliance Checklist"]?.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold text-purple-500">
              <DollarSign className="h-5 w-5" />
              Payment Terms
            </div>
            <p className="text-sm text-muted-foreground">{data["Payment Terms"]}</p>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-2 font-semibold text-red-500">
              <Info className="h-5 w-5" />
              LD Clauses
            </div>
            <p className="text-sm text-muted-foreground">{data["Liquidated Damages"]}</p>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Simple Badge and Card components if they are not already exactly as I need them
// or if I need to avoid dependency issues for now.
// But the designer provided Button, Card, Input. 
// I'll check if Badge was provided.
