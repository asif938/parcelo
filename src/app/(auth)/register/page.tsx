import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Parcelo account as a customer or delivery provider.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
