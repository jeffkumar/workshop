import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Layout({ children }: { children: ReactNode }) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header 
        className="border-b px-4 py-3"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
            Team Updates
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span style={{ color: 'var(--color-text-secondary)' }}>
                {profile?.full_name || profile?.username || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff'
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
