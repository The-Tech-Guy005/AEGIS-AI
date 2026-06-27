import { SignIn } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in to AEGIS AI"
      subtitle="Access the emergency response dashboard and hazard intelligence tools."
    >
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/register"
        forceRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
