"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Trophy, AlertTriangle, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ComparisonData {
  rankings: Array<{
    rank: number;
    vendorName: string;
    totalAmount: number;
    currency: string;
    score: number;
  }>;
  abnormalPricing: Array<{
    vendorName: string;
    amount: number;
    deviation: string;
  }>;
  recommendations: string[];
  averageAmount: number;
}

export default function AIInsights({ tenderId }: { tenderId: string }) {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComparison() {
      try {
        const res = await fetch(`/api/tenders/${tenderId}/comparison`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch comparison:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchComparison();
  }, [tenderId]);

  if (loading) return <div className="h-full flex items-center justify-center p-8"><Brain className="h-8 w-8 animate-pulse text-primary" /></div>;
  if (!data || data.rankings.length === 0) return null;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm bg-primary/5 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-lg">Vendor Rankings</CardTitle>
          </div>
          <CardDescription>AI-generated score based on price, timeline, and terms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.rankings.map((r, i) => (
            <motion.div
              key={r.vendorName}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-primary/20">#{r.rank}</span>
                <div>
                  <div className="font-bold text-sm">{r.vendorName}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    Score: {r.score}/100
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{formatCurrency(r.totalAmount, r.currency)}</div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Negotiation Strategy</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-sm text-foreground/80 flex gap-3"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                {rec}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {data.abnormalPricing.length > 0 && (
        <Card className="border-none shadow-sm bg-destructive/5 backdrop-blur-sm border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg text-destructive">Pricing Alerts</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.abnormalPricing.map((a, i) => (
              <div key={i} className="text-xs flex items-center justify-between p-2 rounded bg-destructive/10">
                <span className="font-semibold">{a.vendorName}</span>
                <span className="flex items-center gap-1">
                  {parseFloat(a.deviation) > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {a.deviation} from avg
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
