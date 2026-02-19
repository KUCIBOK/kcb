import { useAuth } from "../store/AuthContext"
import {Outlet, Navigate} from 'react-router-dom';

export function ArtistProtectedRoute() {
    const {user} = useAuth()
    if(user?.role  == "artist" || user?.role == "admin"){
        return <Outlet/>
    }
    return <Navigate to='/sign-in' />

}