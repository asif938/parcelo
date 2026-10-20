"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { FormTextField } from "@/components/forms/form-text-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRegister } from "@/hooks/use-auth";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

export function RegisterForm() {
  const registerMutation = useRegister();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", role: "CUSTOMER" },
  });

  function onSubmit(values: RegisterInput) {
    registerMutation.mutate(values, {
      onError: (error) => applyServerErrors(form, error),
    });
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Register as a customer or delivery provider</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormTextField
              control={form.control}
              name="name"
              label="Full name"
              placeholder="Jane Doe"
              autoComplete="name"
            />
            <FormTextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            <FormTextField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <FormTextField
              control={form.control}
              name="phone"
              label="Phone (optional)"
              type="tel"
              placeholder="+1 555 010 0100"
              autoComplete="tel"
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am registering as a</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-2 gap-3"
                    >
                      <Label
                        htmlFor="role-customer"
                        className="flex items-center gap-2 rounded-md border p-3 has-[[data-state=checked]]:border-primary"
                      >
                        <RadioGroupItem value="CUSTOMER" id="role-customer" />
                        Customer
                      </Label>
                      <Label
                        htmlFor="role-courier"
                        className="flex items-center gap-2 rounded-md border p-3 has-[[data-state=checked]]:border-primary"
                      >
                        <RadioGroupItem value="COURIER" id="role-courier" />
                        Delivery provider
                      </Label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
