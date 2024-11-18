'use client';

import { NewPasswordSchema } from "@/schema";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import CardWrapper from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";

export default function NewPasswordForm() {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError('');
    setSuccess('');

    startTransition(async () => {
      const data = await newPassword(values, token);
      setError(data.error);
      setSuccess(data.success);
    });
  }

  return (
    <CardWrapper
      headerLabel="forgot your password?"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      autoComplete="off"
                      {...field}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <FormError message={error} />
          <Button disabled={isPending} type="submit" className="w-full">
             Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
