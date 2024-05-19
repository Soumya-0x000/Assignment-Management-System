import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';
import SlidingTabs from '../../common/SlidingTabs';
import { formatSemester, nameLogo, shorthandSemester, tableList } from '../../common/customHooks';
import { HiOutlineIdentification } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock, FiUnlock } from "react-icons/fi";
import { MdOutlinePerson2 } from "react-icons/md";

const navArr = [
    { name: 'Name', val: 'name', title: '' },
    { name: 'Email', val: 'emailId' },
    { name: 'Password', val: 'password' },
    { name: 'Id', val: 'uniqId' },
];

const TeacherHomePage = () => {
    const { teacherId } = useParams();
    const [teacherData, setTeacherData] = useState({
        uniqId: '',
        name: '',
        MCA: [],
        MSc: []
    });
    const [selected, setSelected] = useState(navArr[0].name);
    const [pswdVisibility, setPswdVisibility] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data, error } = await supabase
                    .from('teachers')
                    .select('*')
                    .eq('uniqId', teacherId)
    
                if (error) {
                    console.error('Error querying database:', error.message);
                    alert(`No teacher found with the provided credentials.`);
                    return;
                } else {
                    toast.success(`We got you`, {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    })
                    setTeacherData(data[0])
                }
            } catch (error) {
                console.error('An unexpected error occurred:', error.message);
                toast.error('An unexpected error occurred', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        })();
    }, []);

    const switchValues = (selected) => {
        switch (selected) {
            case 'Id':
                return <div className=' flex items-center gap-x-2 lg:gap-x-5  text-[12px] sm:text-lg'>
                    <HiOutlineIdentification className=' text-[1.5rem] lg:text-[1.7rem] text-green-500'/>
                    {teacherData.uniqId}
                </div>

            case 'Name':
                return <div className=' flex items-center gap-x-5  text-[16px] lg:text-lg'>
                    <MdOutlinePerson2 className=' text-[1.7rem] text-blue-500'/>
                    {teacherData.title} {teacherData.name}
                </div>
                
            case 'Email':
                return <div className=' flex items-center gap-x-5'>
                    <MdOutlineEmail className=' text-2xl text-yellow-500'/> {teacherData.emailId}
                </div>

            case 'Password':
                return <div className=' flex items-center gap-x-5'>
                    <button onClick={() => setPswdVisibility(!pswdVisibility)}>
                        {pswdVisibility 
                            ? <FiUnlock className=' text-2xl text-red-500'/> 
                            : <FiLock className=' text-2xl text-red-500'/> 
                        }
                    </button>

                    <input 
                        type={`${pswdVisibility ? 'text' : 'password'}`} 
                        value={teacherData.password}
                        disabled
                        className=' w-full bg-transparent'
                    />
                </div>
                
            default:
                break;
        }
    };

    useEffect(() => {

    }, []);

    return (
        <div className=' flex flex-col items-center gap-y-10 h-screen bg-slate-700 py-3 px-5'>  
            <div className=' w-full'>
                <div className='w-full bg-slate-900 rounded-lg flex items-center justify-between px-2 md:px-4 py-2'>
                    <SlidingTabs 
                        tabs={navArr.map((a) => a.name)} 
                        selected={selected} 
                        setSelected={setSelected} 
                    />

                    <div className='flex flex-col-reverse items-end gap-y-2 justify-center gap-x-3'>
                        <div className='h-14 w-14 bg-slate-700 text-green-300 flex items-center justify-center text-lg font-robotoMono tracking-wider rounded-full'>
                            {nameLogo(teacherData.name)}
                        </div>
                    </div>
                </div>

                <div className='bg-slate-800 rounded-lg py-2 mt-3 px-2 lg:px-5 '>
                    <div className='text-slate-300 font-mavenPro'>
                        {switchValues(selected)}
                    </div>
                </div>
            </div>

            <div className=' w-full flex flex-col md:flex-row items-center justify-between gap-4'>
                {/* MCA */}
                <div className=' bg-gradient-to-br from-green-500 to-indigo-600 text-white px-3 py-3 rounded-lg w-full md:w-1/2 h-full'>
                    <div className=' text-xl border-b-2 pb-1 font-onest'>
                        MCA
                    </div>

                    {Object.entries(teacherData?.MCA).length !== 0 ? (
                        <div className=' grid grid-cols-2  gap-x-4 gap-y-2 mt-3'>
                            {teacherData.MCA.map((val, index) => (
                                <React.Fragment key={index}>
                                    {Object.entries(val).map(([key, val], indx) => (
                                        <div className=' bg-slate-800 rounded-lg px-3 py-2' key={indx}>
                                            {val !== '' && (
                                                <div>
                                                    <span className=' font-bold font-robotoMono tracking-wider text-gray-300'>{key}: </span> 
                                                    <span className=' font-bold font-onest tracking-wider text-gray-300'>{val}</span>
                                                </div>
                                            )} 
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (    
                        <div className=' font-bold font-robotoMono tracking-wider bg-slate-800 w-full mt-3 py-2 px-3 rounded-lg text-gray-300'>No classes for MCA</div> 
                    )}
                </div>
                
                {/* MSc */}
                <div className=' bg-gradient-to-br from-green-500 to-indigo-600 text-white px-3 py-3 rounded-lg w-full md:w-1/2 h-full'>
                    <div className=' text-xl border-b-2 pb-1 font-onest'>
                        MSc
                    </div>

                    {Object.entries(teacherData?.MSc).length !== 0 ? (
                        <div className=' grid grid-cols-2 gap-x-4 gap-y-2 mt-3'>
                            {teacherData.MSc.map((val, index) => (
                                <React.Fragment key={index}>
                                    {Object.entries(val).map(([key, val], indx) => (
                                        <div className=' bg-slate-800 rounded-lg px-3 py-2' key={indx}>
                                            {val !== '' && (
                                                <div>
                                                    <span className=' font-bold font-robotoMono tracking-wider text-gray-300'>{key}: </span> 
                                                    <span className=' font-bold font-onest tracking-wider text-gray-300'>{val}</span>
                                                </div>
                                            )} 
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (    
                        <div className=' font-bold font-robotoMono tracking-wider bg-slate-800 w-full mt-3 py-2 px-3 rounded-lg text-gray-300'>No classes for MSc</div> 
                    )}
                </div>
            </div>
        </div>
    )
}

export default TeacherHomePage;
