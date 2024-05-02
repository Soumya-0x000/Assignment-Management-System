import React from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import AdminDashboard from './components/adminDashboard/AdminDashboard';

const App = () => {
    
    return (
        <>
            <Outlet/>  
        </>
    )
}

export default App;
