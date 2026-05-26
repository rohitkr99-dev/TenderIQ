import AuditLogTable from "@/components/features/team/audit-log-table";

export default function AuditLogsPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Global Audit Logs
        </h1>
        <p className="text-muted-foreground">
          A comprehensive record of all key actions performed within your organization.
        </p>
      </div>

      <AuditLogTable />
    </div>
  );
}
