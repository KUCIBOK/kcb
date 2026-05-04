import { useAuth } from '../store/AuthContext'
import { Outlet, Navigate } from 'react-router-dom'
import { PageLoader } from '../components/loaders/PageLoader'

export function AuthProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (user?.role) {
    return <Outlet />
  }
  return <Navigate to="/sign-in" />
}
