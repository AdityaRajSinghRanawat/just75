import { Link } from 'react-router-dom'
import { useUser, useClerk } from '@clerk/clerk-react'
import { useState } from 'react'
import logo from '../logo/logo.png'

export default function Navbar({ showProfile = false }){
  const { user } = useUser() || {};
  const { signOut } = useClerk();
  const [showMenu, setShowMenu] = useState(false);

  async function handleLogout(){
    await signOut();
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Smart Attendance" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Right side */}
        {showProfile && user ? (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-blue-500 hover:border-blue-600 transition-colors flex-shrink-0">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base">
                  {user.firstName?.[0]?.toUpperCase()}{user.lastName?.[0]?.toUpperCase()}
                </div>
              )}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                <div className="p-3 border-b border-slate-200 text-sm">
                  <div className="font-semibold text-slate-900">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-slate-600 truncate">{user.primaryEmailAddress?.emailAddress}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  )
}
