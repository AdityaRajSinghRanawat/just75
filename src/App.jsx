import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { isAdminUser } from "./lib/auth";

const StudentPage = lazy(() => import("./pages/StudentPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminSignIn = lazy(() => import("./pages/AdminSignIn"));

function App() {
  const { isSignedIn, user } = useUser() || {};
  const isAdmin = isAdminUser(user);

  return (
    <div className="bg-slate-50 text-slate-800">
      <Suspense
        fallback={
          <div className="min-h-dvh grid place-items-center">
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<StudentPage />} />
          <Route path="/admin" element={<AdminSignIn />} />
          <Route
            path="/admin/dashboard"
            element={
              isSignedIn && isAdmin ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
