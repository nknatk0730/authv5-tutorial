'use client';
import  { BeatLoader }  from 'react-spinners'
import { useSearchParams } from "next/navigation";
import CardWrapper from "./card-wrapper";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');

  const onSubmit = useCallback(async () => {
    if (success || error) {
      return;
    }

    if (!token) {
      setError('Missing token');
      return;
    };
    try {
      const data = await newVerification(token);
      setSuccess(data.success);
      setError(data.error);
    } catch {
      setError('something went wrong');
    };

  }, [token, error, success]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to LogIn"
    >
      <div className="">
        {!success && !error && (
          <BeatLoader />
        )}
        <FormSuccess message={success}/>
        {!success && (
          <FormError message={error}/>
        )}
      </div>
    </CardWrapper>
  )
}
