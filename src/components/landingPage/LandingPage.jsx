import React, { useState } from 'react';
import BgColorAnimation from '../../animation/BgColorAnimation';
import StudentLogIn from './modal/logIn/StudentLogIn.jsx';
import TeacherLogIn from './modal/logIn/TeacherLogIn.jsx';
import AdminLogIn from './modal/logIn/AdminLogIn.jsx';
import ChipTabs from '../../animation/Tabs';
import MainRegisterPage from './modal/register/MainRegisterPage.jsx';

const userArr = [
    {name: 'Student'},
    {name: 'Teacher'},
    {name: 'Admin'}
];

const LandingPage = () => {
    const [selected, setSelected] = useState(userArr[0].name);

    return (
        <BgColorAnimation
            child={
                <div className=" h-screen flex justify-center items-center px-5 ">
                    <div className="bg-[#ffffff2b] shadow-md rounded px-4 md:px-8 py-5 xsm:w-[25rem] sm:w-[35rem] md:max-w-[50rem] md:min-w-[40rem]">
                        {/* heading */}
                        <div className=' space-y-4  mb-8'>
                            <div className=" md:text-[2rem] text-[1.3rem] sm:text-[1.6rem] md:text-3xl font-lato tracking-wider text-violet-300 font-bold">
                                Assignment Management System
                            </div>
                        </div>

                        {/* tabs */}
                        <ChipTabs
                            tabsArr={userArr}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <div className='mt-4 flex justify-between w-full '>
                            {/* login */}
                            <div className={` flex flex-col ${selected === 'Student' ? 'max-w-[9rem]' : ''} bg-[#b2b2b24b] rounded-md overflow-hidden shadow-black shadow-md w-full h-[10.5rem]`}>
                                <div className=' bg-slate-900 h-16 text-slate-200 font-robotoMono font-bold flex items-center justify-center'>
                                    Sign In
                                </div>

                                <div className=' h-full w-full flex items-center justify-center'>
                                    {selected === 'Student' ? (
                                        <StudentLogIn/>
                                    ) : selected === 'Teacher' ? (
                                        <TeacherLogIn/>
                                    ) : (
                                        <AdminLogIn/>
                                    )}
                                </div>
                            </div>

                            {/* register */}
                            {selected === 'Student' && ( 
                                <MainRegisterPage userType={selected}/>
                            )}
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default LandingPage;
