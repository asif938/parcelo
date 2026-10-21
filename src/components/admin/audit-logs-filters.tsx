"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export function AuditLogsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [action, setAction] = useState(searchParams.get("action") ?? "");
  const [entityType, setEntityType] = useState(searchParams.get("entityType") ?? "");
  const debouncedAction = useDebouncedValue(action, 400);
  const debouncedEntityType = useDebouncedValue(entityType, 400);

  useEffect(() => {
    const currentAction = searchParams.get("action") ?? "";
    const currentEntityType = searchParams.get("entityType") ?? "";
    const trimmedAction = debouncedAction.trim();
    const trimmedEntityType = debouncedEntityType.trim();
    if (trimmedAction === currentAction && trimmedEntityType === currentEntityType) return;

    const params = new URLSearchParams(searchParams.toString());
    if (trimmedAction) params.set("action", trimmedAction);
    else params.delete("action");
    if (trimmedEntityType) params.set("entityType", trimmedEntityType);
    else params.delete("entityType");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedAction, debouncedEntityType, pathname, router, searchParams]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Filter by action (e.g. UPDATE_USER_ROLE)"
        value={action}
        onChange={(event) => setAction(event.target.value)}
        className="max-w-xs"
      />
      <Input
        placeholder="Filter by entity type (e.g. User)"
        value={entityType}
        onChange={(event) => setEntityType(event.target.value)}
        className="max-w-xs"
      />
    </div>
  );
}
