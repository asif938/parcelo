"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FormTextField } from "@/components/forms/form-text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useContactSettings, useUpdateContactSettings } from "@/hooks/use-contact";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { contactSettingsSchema, type ContactSettingsFormValues } from "@/lib/validations/contact";

export function ContactSettingsForm() {
  const settingsQuery = useContactSettings();
  const updateSettings = useUpdateContactSettings();

  const form = useForm<ContactSettingsFormValues>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: { email: "", phone: "", location: "" },
  });

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset({
        email: settingsQuery.data.email,
        phone: settingsQuery.data.phone,
        location: settingsQuery.data.location,
      });
    }
  }, [settingsQuery.data, form]);

  function onSubmit(values: ContactSettingsFormValues) {
    updateSettings.mutate(values, {
      onError: (error) => applyServerErrors(form, error),
    });
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Contact page information</CardTitle>
      </CardHeader>
      <CardContent>
        {settingsQuery.isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormTextField
                control={form.control}
                name="email"
                label="Support email"
                type="email"
                placeholder="support@parcelo.app"
              />
              <FormTextField
                control={form.control}
                name="phone"
                label="Phone"
                placeholder="+1 (555) 010-0100"
              />
              <FormTextField
                control={form.control}
                name="location"
                label="Headquarters location"
                placeholder="New York, NY"
              />
              <Button type="submit" disabled={updateSettings.isPending} className="self-start">
                {updateSettings.isPending ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
