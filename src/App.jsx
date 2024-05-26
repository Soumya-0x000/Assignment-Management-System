import React from 'react';
import { Route, BrowserRouter as Router, Navigate, Routes } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import TeacherHomePage from './components/TeacherDashboard/TeacherHomePage';
import StudentHomePage from './components/StudentDashboard/StudentHomePage';

const App = () => {
    const { adminIsAuthenticated } = useSelector(state => state.adminAuth);
    const { teacherIsAuthenticated } = useSelector(state => state.teacherAuth);
    const { studentIsAuthenticated } = useSelector(state => state.studentAuth);

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
                        path="/studentdashboard/:usnid"
                        element={studentIsAuthenticated ? <StudentHomePage /> : <Navigate to="/" />}
                    />
                </Routes>
            </Router>
        </>
    );
};

export default App;
