import { useAuth } from "../store/AuthContext"
import { Outlet, Navigate } from 'react-router-dom';
import { PageLoader } from "../components/loaders/PageLoader";

export function BuyerProtectedRoute() {
    const { user, loading } = useAuth();
    if (loading) return <PageLoader />;
    if (!user) return <Navigate to='/sign-in' replace />;
    if (user.role === 'buyer' || user.role === 'admin') return <Outlet />;
    return <Navigate to='/sign-in' replace />;
}
