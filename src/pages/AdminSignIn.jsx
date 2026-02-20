import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppPageLayout from "../components/layout/AppPageLayout";
import { AdminSignInPanel } from "../components/pages/admin";
import { isAdminUser } from "../lib/auth";

export default function AdminSignIn() {
  const { isSignedIn, user } = useUser() || {};
  const navigate = useNavigate();
  const isAdmin = isAdminUser(user);

  useEffect(() => {
    if (isSignedIn && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isSignedIn, isAdmin, navigate]);

  return (
    <AppPageLayout
      showProfile={false}
      mainClassName="flex-1 min-h-0 overflow-y-auto flex items-center justify-center p-4"
    >
      <AdminSignInPanel />
    </AppPageLayout>
  );
}
