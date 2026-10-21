"use client";

import { useSearchParams } from "next/navigation";

import { ROLE_LABEL } from "@/components/layout/nav-config";
import { TableMessageRow } from "@/components/dashboard/table-message-row";
import { UsersFilters } from "@/components/admin/users-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShipmentsPagination } from "@/components/shipments/shipments-pagination";
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from "@/hooks/use-admin-users";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/stores/auth-store";
import type { AdminRole } from "@/types/admin";

const PAGE_SIZE = 10;
const SKELETON_ROWS = 6;
const COL_SPAN = 5;
const ROLE_OPTIONS: AdminRole[] = ["CUSTOMER", "COURIER", "ADMIN"];

export function UsersList() {
  const searchParams = useSearchParams();
  const currentUser = useAuthStore((state) => state.user);

  const page = Number(searchParams.get("page") ?? "1") || 1;
  const role = (searchParams.get("role") as AdminRole | null) ?? undefined;
  const isActiveParam = searchParams.get("isActive");
  const isActive = isActiveParam === null ? undefined : isActiveParam === "true";
  const q = searchParams.get("q") || undefined;

  const usersQuery = useAdminUsers({ page, limit: PAGE_SIZE, role, isActive, q });
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

  const users = usersQuery.data?.users ?? [];

  return (
    <div className="flex flex-col gap-4">
      <UsersFilters />

      <Card>
        <CardContent className="overflow-x-auto pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersQuery.isLoading &&
                Array.from({ length: SKELETON_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))}

              {usersQuery.isError && (
                <TableMessageRow colSpan={COL_SPAN}>
                  <div className="flex flex-col items-center gap-2">
                    <span>
                      {usersQuery.error instanceof Error
                        ? usersQuery.error.message
                        : "Failed to load users."}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => usersQuery.refetch()}>
                      Retry
                    </Button>
                  </div>
                </TableMessageRow>
              )}

              {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 && (
                <TableMessageRow colSpan={COL_SPAN}>No users match these filters.</TableMessageRow>
              )}

              {!usersQuery.isLoading &&
                !usersQuery.isError &&
                users.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          disabled={isSelf || updateRole.isPending}
                          onValueChange={(value) =>
                            updateRole.mutate({ id: user.id, role: value as AdminRole })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((value) => (
                              <SelectItem key={value} value={value}>
                                {ROLE_LABEL[value]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isSelf || updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate({ id: user.id, isActive: !user.isActive })
                          }
                        >
                          <Badge variant={user.isActive ? "secondary" : "destructive"}>
                            {user.isActive ? "Active" : "Suspended"}
                          </Badge>
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">{formatDate(user.createdAt)}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ShipmentsPagination meta={usersQuery.data?.meta} />
    </div>
  );
}
