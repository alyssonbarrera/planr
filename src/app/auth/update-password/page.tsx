import { UpdatePasswordForm } from "@/components/forms/update-password-form";
import { Suspense } from "react";

export const runtime = "edge";

export default function UpdatePasswordPage() {
  return (
    <Suspense>
      <UpdatePasswordForm />
    </Suspense>
  );
}
