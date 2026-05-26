"use client"

import { Card } from "@/components/ui/card"
import { ArrowRight, Box, Link as LinkIcon } from "lucide-react"
import { motion } from "framer-motion"

interface Dependency {
  material: string
  dependsOn: string[]
}

interface DependencyChartProps {
  dependencies: Dependency[]
}

export function DependencyChart({ dependencies }: DependencyChartProps) {
  return (
    <Card className="p-6 border-none shadow-lg bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <LinkIcon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Material Dependency Chart</h3>
      </div>
      
      <div className="space-y-4">
        {dependencies.map((dep, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="flex-1 p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-2">
                <Box className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">{dep.material}</span>
              </div>
            </div>
            
            {dep.dependsOn.length > 0 && (
              <>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-wrap gap-2 flex-[1.5]">
                  {dep.dependsOn.map((item, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-bold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        ))}
        {dependencies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm italic">
            No complex dependencies identified.
          </div>
        )}
      </div>
    </Card>
  )
}
