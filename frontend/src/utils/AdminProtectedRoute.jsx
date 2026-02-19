import { useAuth } from "../store/AuthContext"
import {Outlet, Navigate} from 'react-router-dom';

export function AdminProtectedRoute() {
    const {user} = useAuth()
    if(user?.role  == "admin"){
        return <Outlet/>
    }
    return <Navigate to='/sign-in' />
}