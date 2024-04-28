import React, { useEffect, useState } from 'react';
import BgColorAnimation from '../../animation/BgColorAnimation';
import StudentModal from './modal/logIn/StudentModal';
import TeacherModal from './modal/logIn/TeacherModal';
import AdminModal from './modal/logIn/AdminModal';
import { FaGoogle } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";
import { CgLogIn } from "react-icons/cg";
import ChipTabs from '../../animation/Tabs';
import {supabase} from '../../CreateClient.js'
import MainRegister from './modal/register/MainRegister.jsx';

const userArr = [
    {name: 'Student'},
    {name: 'Teacher'},
    {name: 'Admin'}
];

const LandingPage = () => {
    const [selected, setSelected] = useState(userArr[0].name);
    const [users, setUsers] = useState([]);

    const trySupabase = async () => {
        const {data} = await supabase
            .from('teacher')
            .select('*')
        console.log(data)
        setUsers(data)
    }
    
    useEffect(() => {
        trySupabase();
    }, []);

    return (
        <BgColorAnimation
            child={
                <div className=" h-screen flex justify-center items-center px-5">
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
                            <div className=' flex flex-col justify- max-w-[9rem] bg-[#b2b2b24b] rounded-md overflow-hidden shadow-black shadow-md w-[32%]'>
                                <div className=' bg-slate-900 h-16 text-slate-200 font-robotoMono font-bold flex items-center justify-center'>
                                    Sign In
                                </div>

                                <div className=' h-full w-full flex items-center justify-center'>
                                    {selected === 'Student' ? (
                                        <StudentModal/>
                                    ) : selected === 'Teacher' ? (
                                        <TeacherModal/>
                                    ) : (
                                        <AdminModal/>
                                    )}
                                </div>
                            </div>

                            {/* register */}
                            <MainRegister userType={selected}/>
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default LandingPage;
