import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BgColorAnimation from '../../animation/BgColorAnimation';
import StudentModal from './modal/StudentModal';
import TeacherModal from './modal/TeacherModal';
import AdminModal from './modal/AdminModal';
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";

const LandingPage = () => {
    return (
        <BgColorAnimation
            child={
                <div className=" h-screen flex justify-center items-center px-5">
                    <div className="bg-[#ffffff2b] shadow-md rounded px-4 md:px-8 py-5 xsm:w-[25rem] sm:w-[35rem] md:max-w-[50rem] md:min-w-[40rem] space-y-10">
                        <div className=' space-y-4'>
                            <div className="text-[1.6rem] md:text-[2rem] md:text-3xl font-mooli tracking-wider text-violet-300 font-bold">
                                Assignment Management System
                            </div>

                            <div className=' text-blue-300 font-montserrat leading-tight text-[15px] md:text-[16px]'>
                                Simplify assignment management for students and teachers. Sign up to create assignments, track progress, and stay connected.
                            </div>
                        </div>

                        <div className=' flex justify-between w-full'>
                            <div className=' flex flex-col justify-between max-w-[9rem] bg-[#b2b2b24b] p-2 rounded-md shadow-black shadow-md w-[32%]'>
                                <StudentModal/>
                                <TeacherModal/>
                                <AdminModal/>
                            </div>

                            <div className=' flex flex-col gap-y-3 bg-[#b2b2b24b] p-2 rounded-md shadow-black shadow-md w-[66%]'>
                                <div className=' flex flex-wrap items-center gap-x-3 text-slate-200 bg-slate-800 rounded-md py-2 pl-3 text-lg font-onest '>
                                    <FaGoogle/>
                                    <span>
                                        Sign up with Google
                                    </span>
                                </div>
                                
                                <div className=' flex flex-wrap items-center gap-x-3 text-slate-200 bg-slate-800 rounded-md py-2 pl-3 text-lg font-onest '>
                                    <FaMicrosoft/>
                                    <span>
                                        Sign up with Microsoft
                                    </span>
                                </div>
                                
                                <div className=' flex flex-wrap items-center gap-x-3 text-slate-200 bg-slate-800 rounded-md py-2 pl-3 text-lg font-onest '>
                                    <FiGithub className=' text-xl'/>
                                    <span>
                                        Sign up with Github
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default LandingPage;
