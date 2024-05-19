import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

const TeacherProtectedRoute = () => {
    const { teacherIsAuthenticated } = useSelector(state => state.adminAuth);
    console.log(teacherIsAuthenticated)


    if (!teacherIsAuthenticated) {
        return <Navigate to={`/`} />
    }

    return <Outlet/>
}

export default TeacherProtectedRoute;
