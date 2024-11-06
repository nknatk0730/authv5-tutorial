'use client';

import { oauthLogin } from "@/actions/login";
import { useState, useTransition } from "react";
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from "../ui/button";
import { FormError } from "../form-error";

export const Social = () => {
  const [error, setError] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const onClick = (provider: "google" | "github") => {
    setError('');
    startTransition(async () => {
      const data = await oauthLogin(provider);
      setError(data?.error);
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <FormError message={error} />
      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
        size="lg"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle style={{ width: 20, height: 20 }} />
      </Button>
      <Button
        type="submit"
        disabled={isPending}
        className="w-full"
        size="lg"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub style={{ width: 20, height: 20 }} />
      </Button>
    </div>
  );
}