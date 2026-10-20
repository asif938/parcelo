import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export function StepIndicator({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <ol className="flex items-center">
      {steps.map((label, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary text-primary",
                  !isComplete && !isActive && "border-muted-foreground/30 text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  !isActive && !isComplete && "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && <div className="mx-3 h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
