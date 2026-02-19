import { useAuth } from "../store/AuthContext"
import {Outlet, Navigate} from 'react-router-dom';


export function CollectorProtectedRoute() {
    const {user} = useAuth()
    if(user?.role  == "collector" || user?.role == "admin"){
        return <Outlet/>
    }
    return <Navigate to='/sign-in' />
}