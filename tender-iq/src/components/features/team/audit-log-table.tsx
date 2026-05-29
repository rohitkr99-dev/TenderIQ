"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Activity, User, Calendar, Tag } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface ActivityLog {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  metadata: any;
}

export default function AuditLogTable() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filteredLogs = logs.filter((log) => {
    const searchString = search.toLowerCase();
    return (
      log.user.name?.toLowerCase().includes(searchString) ||
      log.user.email?.toLowerCase().includes(searchString) ||
      log.action.toLowerCase().includes(searchString) ||
      log.entityType?.toLowerCase().includes(searchString)
    );
  });

  const getActionColor = (action: string) => {
    if (action.includes("DELETE") || action.includes("REMOVED")) return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    if (action.includes("CREATE") || action.includes("REGISTERED") || action.includes("ACCEPTED")) return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (action.includes("UPDATE") || action.includes("ANALYZED")) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  };

  return (
    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20 px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">Audit Logs</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-9 bg-background/50 border-border/50 focus:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-2 rounded-md border border-border/50 bg-background/50 hover:bg-muted transition-colors">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-md border border-border/50 bg-background/50 hover:bg-muted transition-colors">
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[180px] font-bold text-xs uppercase tracking-wider py-4">User</TableHead>
                <TableHead className="w-[200px] font-bold text-xs uppercase tracking-wider py-4">Action</TableHead>
                <TableHead className="w-[120px] font-bold text-xs uppercase tracking-wider py-4">Entity</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider py-4">Details</TableHead>
                <TableHead className="w-[180px] font-bold text-xs uppercase tracking-wider py-4 text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse border-border/50">
                    <TableCell><div className="h-4 w-24 bg-muted rounded" /></TableCell>
                    <TableCell><div className="h-6 w-32 bg-muted rounded-full" /></TableCell>
                    <TableCell><div className="h-4 w-16 bg-muted rounded" /></TableCell>
                    <TableCell><div className="h-4 w-48 bg-muted rounded" /></TableCell>
                    <TableCell className="text-right"><div className="h-4 w-24 bg-muted ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-border/50 hover:bg-muted/30 transition-colors group"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                          {(log.user.name?.[0] || log.user.email?.[0] || "U").toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{log.user.name || "System"}</span>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{log.user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`font-mono text-[10px] py-0.5 px-2 border ${getActionColor(log.action)}`} variant="outline">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        <span className="text-xs font-medium uppercase tracking-tight">{log.entityType || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-muted-foreground italic group-hover:text-foreground transition-colors">
                        {log.metadata ? JSON.stringify(log.metadata).substring(0, 100) : "No additional details"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium">{formatDate(log.createdAt)}</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(log.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                    No activity logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
