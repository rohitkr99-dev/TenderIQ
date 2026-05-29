import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Bell, Shield, Activity, Building } from "lucide-react";
import Link from "next/link";

const settingsModules = [
  {
    title: "Profile",
    description: "Manage your personal information and account settings.",
    icon: User,
    href: "/dashboard/settings/profile",
    color: "text-blue-500",
  },
  {
    title: "Company",
    description: "Update your organization details and branding.",
    icon: Building,
    href: "/dashboard/settings/company",
    color: "text-emerald-500",
  },
  {
    title: "Audit Logs",
    description: "View a detailed history of all actions performed in your company.",
    icon: Activity,
    href: "/dashboard/settings/logs",
    color: "text-primary",
  },
  {
    title: "Security",
    description: "Manage passwords, 2FA, and session settings.",
    icon: Shield,
    href: "/dashboard/settings/security",
    color: "text-rose-500",
  },
  {
    title: "Notifications",
    description: "Configure how and when you receive alerts.",
    icon: Bell,
    href: "/dashboard/settings/notifications",
    color: "text-amber-500",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and organization preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsModules.map((module) => (
          <Link key={module.title} href={module.href}>
            <Card className="hover:bg-muted/50 transition-all cursor-pointer border-none shadow-lg bg-card/50 backdrop-blur-sm group">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg bg-background border border-border/50 group-hover:border-primary/30 transition-colors`}>
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
