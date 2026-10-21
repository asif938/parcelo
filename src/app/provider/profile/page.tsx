import { CourierDetailsCard } from "@/components/profile/courier-details-card";
import { ProfileForm } from "@/components/profile/profile-form";

export default function CourierProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal details and courier status.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileForm />
        <CourierDetailsCard />
      </div>
    </div>
  );
}
