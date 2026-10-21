"use client";

import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { humanizeAction } from "@/lib/audit-log";
import { formatDateTime } from "@/lib/format";
import type { AuditLogEntry } from "@/types/admin";

export function AuditLogDetailsDialog({ log }: { log: AuditLogEntry }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {humanizeAction(log.action)} — {log.entityType}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 text-sm">
          <p>
            <span className="text-muted-foreground">Entity ID:</span> {log.entityId}
          </p>
          <p>
            <span className="text-muted-foreground">Actor:</span>{" "}
            {log.actor ? `${log.actor.name} (${log.actor.email})` : "System"}
          </p>
          <p>
            <span className="text-muted-foreground">IP address:</span> {log.ipAddress ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Time:</span> {formatDateTime(log.createdAt)}
          </p>
          {log.changes !== null && log.changes !== undefined && (
            <div>
              <p className="text-muted-foreground">Changes:</p>
              <pre className="mt-1 overflow-x-auto rounded-md border bg-muted/50 p-3 text-xs">
                {JSON.stringify(log.changes, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
