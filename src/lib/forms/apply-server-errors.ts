import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { ApiError } from "@/lib/api/client";

export function applyServerErrors<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  error: unknown,
) {
  if (!(error instanceof ApiError) || !error.errors?.length) return;

  const knownFields = new Set(Object.keys(form.getValues()));
  for (const fieldError of error.errors) {
    if (!knownFields.has(fieldError.field)) continue;
    form.setError(fieldError.field as Path<TFieldValues>, {
      type: "server",
      message: fieldError.message,
    });
  }
}
