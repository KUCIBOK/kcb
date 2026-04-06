import { useAuth } from "../store/AuthContext"
import { Outlet, Navigate } from 'react-router-dom';
import { PageLoader } from "../components/loaders/PageLoader";

export function ArtistProtectedRoute() {
    const { user, loading } = useAuth();
    if (loading) return <PageLoader />;
    if (!user) return <Navigate to='/sign-in' replace />;
    if (user.role === 'artist' || user.role === 'admin') return <Outlet />;
    return <Navigate to='/sign-in' replace />;
}
