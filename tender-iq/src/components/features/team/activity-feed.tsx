"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, User, FileText, MessageSquare, ShieldAlert, UserPlus, CheckCircle2, UserMinus, Sparkles, ShoppingCart, Briefcase, FileSignature } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  metadata: any;
}

export default function ActivityFeed() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/team/logs");
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const getIcon = (action: string) => {
    switch (action) {
      case "USER_INVITED": return <UserPlus className="h-4 w-4 text-blue-500" />;
      case "INVITATION_ACCEPTED": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "MEMBER_REMOVED": return <UserMinus className="h-4 w-4 text-rose-500" />;
      case "COMMENT_ADDED": return <MessageSquare className="h-4 w-4 text-violet-500" />;
      case "TENDER_PERMISSION_UPDATED": return <ShieldAlert className="h-4 w-4 text-amber-500" />;
      case "TENDER_ANALYZED": return <Sparkles className="h-4 w-4 text-primary" />;
      case "BOQ_ANALYZED": return <FileText className="h-4 w-4 text-primary" />;
      case "PROCUREMENT_GENERATED": return <ShoppingCart className="h-4 w-4 text-indigo-500" />;
      case "QUOTATION_SUBMITTED": return <FileSignature className="h-4 w-4 text-emerald-500" />;
      case "COMPANY_REGISTERED": return <Briefcase className="h-4 w-4 text-primary" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionText = (log: ActivityLog) => {
    const { action, metadata } = log;
    switch (action) {
      case "TENDER_ANALYZED":
        return `analyzed tender: ${metadata?.projectName || "Unknown Project"}`;
      case "BOQ_ANALYZED":
        return `extracted BOQ from ${metadata?.fileName || "file"} (${metadata?.itemCount || 0} items)`;
      case "PROCUREMENT_GENERATED":
        return `generated procurement schedule (${metadata?.itemCount || 0} items)`;
      case "QUOTATION_SUBMITTED":
        return `submitted quotation for ${metadata?.tenderTitle || "tender"} from ${metadata?.vendorName || "vendor"}`;
      case "COMPANY_REGISTERED":
        return `registered company: ${metadata?.companyName || "New Company"}`;
      default:
        return action.toLowerCase().replace(/_/g, " ");
    }
  };

  if (loading) return (
    <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4 bg-muted rounded" />
                <div className="h-2 w-1/4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
        <CardDescription>Latest actions from your team members.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 group relative"
              >
                {index !== logs.length - 1 && (
                  <div className="absolute left-4 top-8 bottom-[-24px] w-[1px] bg-border group-hover:bg-primary/20 transition-colors" />
                )}
                <div className="relative z-10 mt-1 h-8 w-8 rounded-full border border-muted bg-background flex items-center justify-center shadow-sm group-hover:border-primary/30 transition-colors">
                  {getIcon(log.action)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm leading-snug">
                    <span className="font-bold text-foreground">{log.user.name || log.user.email?.split('@')[0]}</span>
                    {" "}
                    <span className="text-muted-foreground">
                      {getActionText(log)}
                    </span>
                    {log.metadata?.invitedEmail && (
                      <span className="font-medium text-foreground ml-1">
                        ({log.metadata.invitedEmail})
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">
                    {formatDate(log.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-12 w-12 text-muted-foreground/20 mb-2" />
              <p className="text-sm text-muted-foreground">No recent activity recorded.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
