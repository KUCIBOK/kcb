import { useAuth } from '../store/AuthContext'
import { Outlet, Navigate } from 'react-router-dom'
import { PageLoader } from '../components/loaders/PageLoader'

const DASHBOARD_ROUTES = {
  buyer: '/account',
  artist: '/dashboard/artist',
  curator: '/dashboard/curator',
  advisor: '/dashboard/advisor',
  admin: '/dashboard/admin',
}

export function AdvisorProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/sign-in" replace />
  if (user.role === 'advisor' || user.role === 'admin') return <Outlet />
  return <Navigate to={DASHBOARD_ROUTES[user.role] ?? '/account'} replace />
}
