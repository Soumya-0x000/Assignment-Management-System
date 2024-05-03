import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NextUIProvider } from '@nextui-org/react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import LandingPage from './components/landingPage/LandingPage.jsx'
import AdminDashboard from './components/adminDashboard/AdminDashboard.jsx'
import { Provider, useSelector } from 'react-redux'
import { store } from './reduxStore/Store.js'

const isAuthenticatedAdmin = () => {
    const {
        adminIsAuthenticated
    } = useSelector(state => state.adminAuth)
    // Add your authentication logic here, such as checking user roles or tokens
    // For example, you can check if the user is authenticated and has admin role
    // Replace this logic with your actual authentication mechanism
    const isAdmin = false;
    return isAdmin;
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="" element={<LandingPage />} />
            <Route path="/admindashboard" element={isAuthenticatedAdmin() ? <AdminDashboard /> : <Navigate to="/" />} />
        </Route>
    )
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <React.StrictMode>
            <NextUIProvider>
                <RouterProvider router={router}/>
            </NextUIProvider>  
        </React.StrictMode>
    </Provider>
);
