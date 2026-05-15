import { useAuth } from '../store/AuthContext'
import { Outlet, Navigate } from 'react-router-dom'
import { PageLoader } from '../components/loaders/PageLoader'

export function GuestProtectedRoute() {
  const { user, loading } = useAuth()
  // Allow password recovery flow: Supabase injects a session from the hash,
  // but we still need to show /reset-password even if user is now "authenticated"
  const hashParams = new URLSearchParams(window.location.hash.slice(1))
  const isRecoveryFlow = !!hashParams.get('access_token') || !!hashParams.get('error_code')
  if (loading) return <PageLoader />
  if (user?.role && !isRecoveryFlow) {
    const DASHBOARD_ROUTES = {
      buyer: '/account',
      artist: '/dashboard/artist',
      curator: '/dashboard/curator',
      advisor: '/dashboard/advisor',
      admin: '/dashboard/admin',
    }
    const dest = DASHBOARD_ROUTES[user.role] ?? '/account'
    return <Navigate to={dest} />
  }
  return <Outlet />
}
