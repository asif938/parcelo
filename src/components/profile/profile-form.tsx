"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FormTextField } from "@/components/forms/form-text-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyProfile, useUpdateProfile } from "@/hooks/use-profile";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { updateProfileSchema, type UpdateProfileFormValues } from "@/lib/validations/profile";

export function ProfileForm() {
  const profileQuery = useMyProfile();
  const updateProfile = useUpdateProfile();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    form.reset({
      name: profileQuery.data.name,
      phone: profileQuery.data.phone ?? "",
    });
  }, [profileQuery.data, form]);

  function onSubmit(values: UpdateProfileFormValues) {
    updateProfile.mutate(values, {
      onError: (error) => applyServerErrors(form, error),
    });
  }

  if (profileQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 pt-6 text-center text-sm">
          <span>
            {profileQuery.error instanceof Error
              ? profileQuery.error.message
              : "Failed to load profile."}
          </span>
          <Button variant="outline" size="sm" onClick={() => profileQuery.refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{profileQuery.data.email}</p>
            </div>
            <FormTextField control={form.control} name="name" label="Name" />
            <FormTextField control={form.control} name="phone" label="Phone" type="tel" />
            <Button type="submit" disabled={updateProfile.isPending} className="self-start">
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
