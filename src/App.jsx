import React from 'react';
import { Route, BrowserRouter as Router, Navigate, Routes } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import { useSelector } from 'react-redux';

const App = () => {
    const { adminIsAuthenticated } = useSelector(state => state.adminAuth);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/admindashboard"
                    element={adminIsAuthenticated ? <AdminDashboard /> : <Navigate to="/" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
