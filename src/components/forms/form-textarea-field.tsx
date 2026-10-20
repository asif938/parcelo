import type { ComponentProps } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function FormTextareaField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  ...textareaProps
}: {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
} & Omit<ComponentProps<typeof Textarea>, "name">) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea {...textareaProps} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
