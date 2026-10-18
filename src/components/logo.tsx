import { PackageSearch } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <PackageSearch className="size-4" />
      </span>
      <span className="text-base">Parcelo</span>
    </Link>
  );
}
