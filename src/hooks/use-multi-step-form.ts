import { useState } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export function useMultiStepForm<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  stepFields: FieldPath<TFieldValues>[][],
) {
  const [step, setStep] = useState(0);
  const isFirstStep = step === 0;
  const isLastStep = step === stepFields.length - 1;

  async function goNext() {
    const fields = stepFields[step];
    const valid = fields.length === 0 || (await form.trigger(fields));
    if (valid) {
      setStep((current) => Math.min(current + 1, stepFields.length - 1));
    }
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
  }

  return { step, isFirstStep, isLastStep, goNext, goBack };
}
