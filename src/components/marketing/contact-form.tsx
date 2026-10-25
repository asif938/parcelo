"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormTextField } from "@/components/forms/form-text-field";
import { FormTextareaField } from "@/components/forms/form-textarea-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useSubmitContactMessage } from "@/hooks/use-contact";
import { applyServerErrors } from "@/lib/forms/apply-server-errors";
import { contactMessageSchema, type ContactMessageFormValues } from "@/lib/validations/contact";

export function ContactForm() {
  const submitMessage = useSubmitContactMessage();

  const form = useForm<ContactMessageFormValues>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  function onSubmit(values: ContactMessageFormValues) {
    submitMessage.mutate(values, {
      onSuccess: () => form.reset(),
      onError: (error) => applyServerErrors(form, error),
    });
  }

  if (submitMessage.isSuccess) {
    return (
      <Card className="flex h-full min-h-[480px] flex-col items-center justify-center p-8 text-center shadow-sm">
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="size-8 text-emerald-500" />
        </span>
        <h3 className="mt-5 text-xl font-semibold">Message sent</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out — our team will get back to you shortly.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => submitMessage.reset()}>
          Send another message
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-sm sm:p-8">
      <CardContent className="p-0">
        <h2 className="text-xl font-semibold">Send us a message</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill out the form below and we&apos;ll get back to you shortly.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormTextField control={form.control} name="name" label="Name" placeholder="Jane Doe" />
              <FormTextField
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="jane@example.com"
              />
            </div>
            <FormTextField
              control={form.control}
              name="subject"
              label="Subject"
              placeholder="How can we help?"
            />
            <FormTextareaField
              control={form.control}
              name="message"
              label="Message"
              placeholder="Tell us a bit more..."
              rows={6}
            />
            <Button
              type="submit"
              disabled={submitMessage.isPending}
              size="lg"
              className="mt-2 self-start shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/35"
            >
              {submitMessage.isPending ? (
                "Sending..."
              ) : (
                <>
                  Send message <Send className="size-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
