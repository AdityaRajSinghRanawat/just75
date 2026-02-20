import { Routes, Route, Navigate } from 'react-router-dom'
import StudentPage from './pages/StudentPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminSignIn from './pages/AdminSignIn'
import { useUser } from '@clerk/clerk-react'

function App() {
  const { isSignedIn, user } = useUser() || {};
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  const isAdmin = user && user.emailAddresses && user.emailAddresses[0] && adminEmails.includes(user.emailAddresses[0].emailAddress);

  return (
    <div className="bg-slate-50 text-slate-800">
      <Routes>
        <Route path="/" element={<StudentPage />} />
        <Route path="/admin" element={<AdminSignIn />} />
        <Route path="/admin/dashboard" element={isSignedIn && isAdmin ? <AdminDashboard /> : <Navigate to="/admin" replace />} />
      </Routes>
    </div>
  )
}

export default App
