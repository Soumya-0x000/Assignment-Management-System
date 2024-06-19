import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../CreateClient';

const AdminProtectedRoute = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location)

    useEffect(() => {
        // const hash = location.hash;
        // const params = new URLSearchParams(hash.substring(1));
        // const accessToken = params.get('access_token');

        // if (accessToken) {
        //     supabase.auth.setSession({
        //         access_token: accessToken,
        //         refresh_token: params.get('refresh_token')
        //     }).then(({ error }) => {
        //         if (error) {
        //             navigate(`/`);
        //         }
        //     });
        // }

        // supabase.auth.onAuthStateChange((_, session) => {
        //     if (!session || session.user.role !== 'authenticated') {
        //         navigate(`/`);
        //         return
        //     } else if (session.user.role !== 'authenticated') {
        //         return <Outlet />;
        //     }
        // });
    }, []);
    return <Outlet />;

}

export default AdminProtectedRoute;
