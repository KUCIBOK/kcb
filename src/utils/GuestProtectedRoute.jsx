import { useAuth } from "../store/AuthContext"
import {Outlet, Navigate} from 'react-router-dom';

export function GuestProtectedRoute() {
    const {user} = useAuth()
    if(user?.role){
        return <Navigate to={`/dashboard/${user?.role}`}/>
    }
    
    return <Outlet/>
}