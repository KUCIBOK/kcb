import { useAuth } from "../store/AuthContext"
import {Outlet, Navigate} from 'react-router-dom';
import { PageLoader } from "../components/loaders/PageLoader";

export function CuratorProtectedRoute() {
    const {user, loading} = useAuth()
    if(loading) return <PageLoader />
    if(user?.role  === "curator" || user?.role === "admin"){
        return <Outlet/>
    }
    return <Navigate to='/sign-in' />
}
