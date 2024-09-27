"use client";

import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

import { updatePasswordAction } from "@/app/auth/update-password/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "@/hooks/use-form-state";

import { FieldErrorMessage } from "../field-error-message";
import { useRouter, useSearchParams } from "next/navigation";

export function UpdatePasswordForm() {
  const router = useRouter();

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    updatePasswordAction,
    () => router.push("/auth/sign-in")
  );

  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Update Password Failed</AlertTitle>

          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success && message && (
        <Alert variant="success">
          <CheckCircle className="size-4" />
          <AlertTitle>Success!</AlertTitle>

          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label>Password</Label>
        <Input name="password" type="password" id="password" />

        {errors?.password && (
          <FieldErrorMessage>{errors.password[0]}</FieldErrorMessage>
        )}
      </div>

      <div className="space-y-1">
        <Label>Confirm your password</Label>
        <Input
          name="password_confirmation"
          type="password"
          id="password_confirmation"
        />

        {errors?.password_confirmation && (
          <FieldErrorMessage>
            {errors.password_confirmation[0]}
          </FieldErrorMessage>
        )}
      </div>

      <input type="hidden" name="code" value={code} />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Reset password"
        )}
      </Button>

      <Button type="button" className="w-full" variant="link" asChild size="sm">
        <Link href="/auth/sign-up">Sign in instead</Link>
      </Button>
    </form>
  );
}
