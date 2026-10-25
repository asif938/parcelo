import { ContactSettingsForm } from "@/components/admin/contact-settings-form";

export default function AdminContactPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Contact Info</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the email, phone number, and location shown on the public contact page.
        </p>
      </div>
      <ContactSettingsForm />
    </div>
  );
}
