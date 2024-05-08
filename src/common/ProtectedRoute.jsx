import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { adminIsAuthenticated } = useSelector(state => state.adminAuth);
    console.log(adminIsAuthenticated)


    if (!adminIsAuthenticated) {
        return <Navigate to={`/`} />
    }

    return <Outlet/>
}

export default ProtectedRoute;
