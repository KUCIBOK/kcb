import { useAuth } from "../store/AuthContext"
import {Outlet, Navigate} from 'react-router-dom';

export function ProfessionalProtectedRoute() {
    const {user} = useAuth()
    if(user?.role  == "professional" || user?.role == "admin"){
        return <Outlet/>
    }
    return <Navigate to='/sign-in' />
}