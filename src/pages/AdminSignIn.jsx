import { SignIn, useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'

export default function AdminSignIn(){
  const { isSignedIn, user } = useUser() || {};
  const navigate = useNavigate();
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map(s => s.trim()).filter(Boolean);
  const isAdmin = user && user.emailAddresses && user.emailAddresses[0] && adminEmails.includes(user.emailAddresses[0].emailAddress);

  useEffect(() => {
    if(isSignedIn && isAdmin){
      navigate('/admin/dashboard');
    }
  }, [isSignedIn, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar showProfile={false} />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignIn 
            routing="path"
            path="/admin"
            signUpUrl={undefined}
            afterSignInUrl="/admin/dashboard"
          />
        </div>
      </div>
    </div>
  )
}
