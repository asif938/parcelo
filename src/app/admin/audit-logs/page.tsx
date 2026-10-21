import { AuditLogsList } from "@/components/admin/audit-logs-list";

export default function AdminAuditLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Audit Logs</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every administrative change made on Parcelo, with who made it and when.
        </p>
      </div>
      <AuditLogsList />
    </div>
  );
}
