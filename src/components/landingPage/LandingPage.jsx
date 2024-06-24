import React, { useEffect, useState } from 'react';
import BgColorAnimation from '../../common/BgColorAnimation.jsx';
import StudentLogIn from './logIn/StudentLogIn.jsx';
import TeacherLogIn from './logIn/TeacherLogIn.jsx';
import AdminLogIn from './logIn/AdminLogIn.jsx';
import MainRegisterPage from './register/MainRegisterPage.jsx';
import SlidingTabs from '../../common/SlidingTabs.jsx';
import AdminRegistration from './register/AdminRegistration.jsx';
import { supabase } from '../../CreateClient.js';
import { useNavigate } from 'react-router-dom';

const userArr = ['Student', 'Teacher', 'Admin'];

const LandingPage = () => {
    const [selected, setSelected] = useState(userArr[0]);
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState(localStorage.getItem('adminId'));

    useEffect(() => {
        setAdminId(localStorage.getItem('adminId'))
        fetchAdmin()
        localStorage.removeItem('teacherId')
        localStorage.removeItem('studentTableName')
    }, []);

    const fetchAdmin = async() => {
        const adminData = await supabase.auth.getUser()
        
        if (adminData.data.user && adminId) {
            navigate(`/admindashboard/${adminId}`)
        } else {
            navigate('/')
        }
    };

    return (
        <BgColorAnimation
            child={
                <div className=" h-screen flex justify-center items-center px-2 sm:px-5 ">
                    <div className="bg-[#ffffff2b] shadow-md rounded px-2 md:px-8 py-5 xsm: w-[28rem] sm:w-[35rem] md:max-w-[50rem] md:min-w-[40rem]">
                        {/* heading */}
                        <div className=' space-y-4  mb-8'>
                            <div className=" md:text-[2rem] text-[1.3rem] sm:text-[1.6rem] md:text-3xl font-lato tracking-wider text-violet-300 font-bold">
                                Assignment Management System
                            </div>
                        </div>

                        {/* tabs */}
                        <SlidingTabs
                            tabs={userArr}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <div className='mt-4 flex justify-between w-full gap-x-4'>
                            {/* login */}
                            <div className={` flex flex-col ${selected === ('Student' || 'Admin') ? ' xsm:max-w-[8rem] sm:max-w-[9rem] max-w-[6.7rem]' : ''} bg-[#b2b2b24b] rounded-md overflow-hidden shadow-black shadow-md w-full h-[10.5rem]`}>
                                <div className=' bg-slate-900 h-16 text-slate-200 font-robotoMono font-bold flex items-center justify-center'>
                                    Sign In
                                </div>

                                <div className=' h-full w-full flex items-center justify-center px-2 xsm:px-5'>
                                    {selected === 'Student' ? (
                                        <StudentLogIn
                                            userType = {selected}
                                        />
                                    ) : selected === 'Teacher' ? (
                                        <TeacherLogIn
                                            userType = {selected}
                                        />
                                    ) : (
                                        <AdminLogIn
                                            userType = {selected}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* register */}
                            {selected === 'Student' && <MainRegisterPage userType={selected}/> }                            
                            {selected === 'Admin' && <AdminRegistration userType={selected}/> }
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default LandingPage;
