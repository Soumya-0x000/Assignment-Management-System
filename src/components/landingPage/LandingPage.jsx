import React, { useState } from 'react';
import BgColorAnimation from '../../animation/BgColorAnimation';
import StudentLogIn from './logIn/StudentLogIn.jsx';
import TeacherLogIn from './logIn/TeacherLogIn.jsx';
import AdminLogIn from './logIn/AdminLogIn.jsx';
import MainRegisterPage from './register/MainRegisterPage.jsx';
import ChipTabs from '../../animation/Tabs';

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
                <div className=" h-screen flex justify-center items-center px-2 sm:px-5 ">
                    <div className="bg-[#ffffff2b] shadow-md rounded px-2 md:px-8 py-5 xsm: w-[28rem] sm:w-[35rem] md:max-w-[50rem] md:min-w-[40rem]">
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
                            <div className={` flex flex-col ${selected === 'Student' ? ' xsm:max-w-[8rem] sm:max-w-[9rem] max-w-[6rem]' : ''} bg-[#b2b2b24b] rounded-md overflow-hidden shadow-black shadow-md xsm:w-full h-[10.5rem]`}>
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
