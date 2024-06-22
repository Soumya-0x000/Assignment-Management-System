import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../CreateClient';
import { Loader } from '../../common/Loader';

const AdminDashboard = () => {
    const uniqAdminId = localStorage.getItem('adminId');
    const { adminId } = useParams();
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const { data: userData, error: userError } = await supabase.auth.getUser();
                if (userError) throw userError;

                const { data: { session: adminSession }, error: adminSessionError } = await supabase.auth.getSession();
                if (adminSessionError) throw adminSessionError;

                const isAuthenticated = userData.user && adminSession.user.role === 'authenticated';
                const isAdmin = adminId === uniqAdminId;

                if (isAuthenticated && isAdmin) {
                    setIsAuth(true);
                } else {
                    localStorage.clear();
                    setIsAuth(false);
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching session or user data:', error);
                localStorage.clear();
                setIsAuth(false);
                navigate('/');
            }
        };

        fetchAdminData();
    }, [adminId, uniqAdminId]);

    return (
        <>
            {isAuth ? (
                <div className='flex bg-slate-700 h-screen overflow-y-auto'>
                    <Sidebar />
                    <Canvas />
                </div>
            ) : (
                <div className='w-screen h-screen flex items-center justify-center bg-slate-800'>
                    <Loader />
                </div>
            )}
        </>
    );
};

export default AdminDashboard;
