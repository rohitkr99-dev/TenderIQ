"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function InviteMember() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        body: JSON.stringify({ email, role }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Invitation sent successfully!" });
        setEmail("");
      } else {
        const error = await res.text();
        setMessage({ type: "error", text: error || "Failed to send invitation." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while sending the invitation." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-sm bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">Invite Member</CardTitle>
        <CardDescription>Invite a new member to join your company team.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground/80 pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                className="pl-9 bg-background/50 border-muted focus-visible:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-semibold text-foreground/80 pl-1">Assign Role</label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-muted bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          
          {message && (
            <div className={`text-sm p-3 rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${
              message.type === "success" 
                ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20" 
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}>
              {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {message.text}
            </div>
          )}

          <Button type="submit" className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
            Send Invitation
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
