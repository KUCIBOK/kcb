import { useAuth } from "../store/AuthContext"
import { Outlet, Navigate } from 'react-router-dom';
import { PageLoader } from "../components/loaders/PageLoader";

export function AdminProtectedRoute() {
    const { user, loading } = useAuth();
    // user.role est chargé depuis public.users via loadDbRole() dans AuthContext — source de vérité DB
    if (loading) return <PageLoader />;
    if (!user) return <Navigate to='/sign-in' replace />;
    if (user.role === 'admin') return <Outlet />;
    return <Navigate to='/sign-in' replace />;
}
