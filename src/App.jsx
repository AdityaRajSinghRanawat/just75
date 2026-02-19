import { Routes, Route, Navigate } from 'react-router-dom'
import StudentPage from './pages/StudentPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminSignIn from './pages/AdminSignIn'
import { useUser } from '@clerk/clerk-react'
import Footer from './components/Footer'

function App() {
  const { isSignedIn, user } = useUser() || {};
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  const isAdmin = user && user.emailAddresses && user.emailAddresses[0] && adminEmails.includes(user.emailAddresses[0].emailAddress);

  return (
    <div className="h-screen h-dvh bg-slate-50 text-slate-800 flex flex-col overflow-hidden">
      <main className="flex-1 min-h-0">
        <Routes>
          <Route path="/" element={<StudentPage />} />
          <Route path="/admin" element={<AdminSignIn />} />
          <Route path="/admin/dashboard" element={isSignedIn && isAdmin ? <AdminDashboard /> : <Navigate to="/admin" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
