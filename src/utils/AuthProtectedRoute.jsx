import { lazy, Suspense } from "react";
import { useAuth } from "../store/AuthContext"
import {Outlet} from 'react-router-dom';
import { PageLoader } from "../components/loaders/PageLoader";
const Error404 = lazy(() => import("../components/fallback/Error404"));

export function AuthProtectedRoute() {
    const {user} = useAuth()
    if(user?.role){
        return <Outlet/>
    }
    return (<Suspense fallback={<PageLoader/>}>
        <Error404/>
    </Suspense>)
}