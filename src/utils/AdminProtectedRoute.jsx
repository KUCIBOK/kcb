import { useEffect, useState } from 'react';
import { useAuth } from "../store/AuthContext"
import { Outlet, Navigate } from 'react-router-dom';
import { PageLoader } from "../components/loaders/PageLoader";
import { supabase } from "../lib/supabase";

export function AdminProtectedRoute() {
    const { user, loading } = useAuth();
    const [dbRole, setDbRole] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!user?._id) { setChecking(false); return; }

        // Vérification autoritatve du rôle admin directement en DB (RLS garantit l'intégrité)
        supabase
            .from('users')
            .select('role')
            .eq('id', user._id)
            .single()
            .then(({ data }) => {
                setDbRole(data?.role ?? null);
                setChecking(false);
            });
    }, [user, loading]);

    if (loading || checking) return <PageLoader />;
    if (dbRole === 'admin') return <Outlet />;
    return <Navigate to='/sign-in' replace />;
}
