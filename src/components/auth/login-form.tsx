"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";

import type { AppRole } from "@/components/layout/nav-config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "@/hooks/use-auth";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/lib/demo-accounts";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const loginMutation = useLogin(callbackUrl);
  const [pendingRole, setPendingRole] = useState<AppRole | null>(null);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    loginMutation.mutate(values);
  }

  function handleDemoLogin(account: DemoAccount) {
    setPendingRole(account.role);
    form.setValue("email", account.email);
    form.setValue("password", account.password);
    form.handleSubmit(onSubmit)();
  }

  function isDemoPending(role: AppRole) {
    return loginMutation.isPending && pendingRole === role;
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back 👋</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-center text-sm font-medium">🚀 Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.slice(0, 2).map((account) => (
              <Button
                key={account.role}
                type="button"
                variant="outline"
                disabled={loginMutation.isPending}
                onClick={() => handleDemoLogin(account)}
              >
                {isDemoPending(account.role) && <Loader2 className="size-4 animate-spin" />}
                {account.label}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={loginMutation.isPending}
            onClick={() => handleDemoLogin(DEMO_ACCOUNTS[2])}
          >
            {isDemoPending(DEMO_ACCOUNTS[2].role) && <Loader2 className="size-4 animate-spin" />}
            {DEMO_ACCOUNTS[2].label}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
