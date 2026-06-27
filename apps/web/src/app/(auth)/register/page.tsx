import { SignUp } from "@clerk/nextjs";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your AEGIS AI account"
      subtitle="Register to report incidents, view hazard maps, and coordinate response."
    >
      <SignUp
        routing="path"
        path="/register"
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
      />
    </AuthShell>
  );
}
