import { UpdatePasswordForm } from "@/components/forms/update-password-form";
import { Suspense } from "react";

export default function UpdatePasswordPage() {
  return (
    <Suspense>
      <UpdatePasswordForm />
    </Suspense>
  );
}
