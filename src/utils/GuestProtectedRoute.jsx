import { useAuth } from "../store/AuthContext"
import {Outlet, Navigate} from 'react-router-dom';
import { PageLoader } from "../components/loaders/PageLoader";

export function GuestProtectedRoute() {
    const {user, loading} = useAuth()
    if(loading) return <PageLoader />
    if(user?.role){
        return <Navigate to={`/dashboard/${user?.role}`}/>
    }
    return <Outlet/>
}
