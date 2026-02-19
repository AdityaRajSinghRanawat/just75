import { SignIn } from "@clerk/clerk-react";

export default function AdminSignInPanel() {
  return (
    <div className="w-full max-w-md">
      <SignIn
        routing="path"
        path="/admin"
        signUpUrl={undefined}
        afterSignInUrl="/admin/dashboard"
      />
    </div>
  );
}
