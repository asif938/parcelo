import type { ComponentProps } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function FormTextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  ...inputProps
}: {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
} & Omit<ComponentProps<typeof Input>, "name">) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...inputProps} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
