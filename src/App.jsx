import React from 'react';
import { Route, BrowserRouter as Router, Navigate, Routes } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import { useSelector } from 'react-redux';
import TeacherHomePage from './components/TeacherDashboard/TeacherHomePage';
import { Toaster } from 'react-hot-toast';

const App = () => {
    const { adminIsAuthenticated } = useSelector(state => state.adminAuth);
    const { teacherIsAuthenticated } = useSelector(state => state.teacherAuth);

    return (
        <>
            <Toaster/>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/admindashboard/:adminId"
                        element={adminIsAuthenticated ? <AdminDashboard /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/teacherdashboard/:teacherId"
                        element={teacherIsAuthenticated ? <TeacherHomePage /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/studentdashboard/:"
                        element={teacherIsAuthenticated ? <TeacherHomePage /> : <Navigate to="/" />}
                    />
                </Routes>
            </Router>
        </>
    );
};

export default App;
