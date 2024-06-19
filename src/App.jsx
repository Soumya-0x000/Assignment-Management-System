import React from 'react';
import { Route, BrowserRouter as Router, Navigate, Routes } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import TeacherHomePage from './components/TeacherDashboard/TeacherHomePage';
import StudentHomePage from './components/StudentDashboard/StudentHomePage';
import AdminProtectedRoute from './common/AdminProtectedRoute';

const App = () => {
    return (
        <>
            <Toaster />
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route
                        path="/admindashboard/:adminId"
                        element={
                            <AdminProtectedRoute>
                                <AdminDashboard />
                            </AdminProtectedRoute>
                        }
                    />
                    <Route
                        path="/teacherdashboard/:teacherId"
                        element={ <TeacherHomePage /> }
                    />
                    <Route
                        path="/studentdashboard/:usnid"
                        element={ <StudentHomePage /> }
                    />
                </Routes>
            </Router>
        </>
    );
};

export default App;
