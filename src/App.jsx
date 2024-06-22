import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './components/landingPage/LandingPage';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import TeacherHomePage from './components/TeacherDashboard/TeacherHomePage';
import StudentHomePage from './components/StudentDashboard/StudentHomePage';

const App = () => {
    return (
        <>
            <Toaster />
            <Router>
                <Routes>
                    <Route 
                        path="/" 
                        element={<LandingPage />} 
                    />
                    <Route 
                        path="/admindashboard/:adminId" 
                        element={<AdminDashboard />} 
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
