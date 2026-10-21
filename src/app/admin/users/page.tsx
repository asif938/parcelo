import { UsersList } from "@/components/admin/users-list";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Users</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage roles and account status for everyone on Parcelo.
        </p>
      </div>
      <UsersList />
    </div>
  );
}
