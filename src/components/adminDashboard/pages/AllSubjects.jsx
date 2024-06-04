import React, { useEffect, useMemo, useState } from 'react'
import { setDeptSemSubjects } from '../../../reduxStore/reducers/AdminDashboardSlice';
import toast from 'react-hot-toast';
import { supabase } from '../../../CreateClient';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosAdd } from "react-icons/io";
import { CiEdit } from "react-icons/ci";

const AllSubjects = () => {
    const dispatch = useDispatch();
    const [subjectsInfo, setSubjectsInfo] = useState([]);
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard)

    useEffect(() => {
        (async () => {
            try {
                const { data: subjectData, error: subjectError } = await supabase
                    .from('subjects')
                    .select('MCA, MSc');
                
                if (subjectError) {
                    toast.error('Error in fetching subjects', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    console.error('Error in fetching subjects', subjectError);
                } else {
                    setSubjectsInfo(subjectData);
                    dispatch(setDeptSemSubjects(subjectData[0]));
                }
            } catch (error) {
                console.error(error);
                toast.error('Error in fetching subjects', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        })();
    }, []);

    return (
        <div className=' bg-slate-800 w-full px-5 py-3 rounded-lg'>
            <div className=' text-white font-mavenPro md:text-[1.1rem] lg:text-[1.2rem] xl:text-[1.4rem] w-full font-bold tracking-wider text-lg'>
                All Subjects
            </div>

            <div className=' w-full flex gap-y-3 mt-3'>
                {subjectsInfo.map((value, indx) => (
                    <div className=' w-full text-slate-300 flex items-start gap-x-4'
                    key={indx}>
                        {Object.entries(value).map(([key, innerValue], innerIndx) => (
                            <div className=' w-full bg-slate-900 rounded-lg p-3 text-slate-300 space-y-8'
                            key={innerIndx}>
                                <div className=' text-blue-300 font-robotoMono tracking-wider text-lg font-bold bg-slate-800 w-full py-1 pl-3 rounded-lg'>
                                    {key} Subjects
                                </div>

                                <div className=' w-full grid grid-cols-1 xl:grid-cols-2 gap-6'>
                                    {Object.entries(innerValue).map(([sem, sub], subIndx) => (
                                        <div 
                                        className=' bg-slate-800 rounded-lg overflow-hidden w-full'
                                        key={subIndx}>
                                            <div className=' font-robotoMono text-[17px] font-bold tracking-wide bg-slate-700 w-full pl-3 py-2'>
                                                {teacherAssignClassDetails.sem.find(val => val.startsWith(...sem[0]))}
                                            </div>

                                            <div className=' pl-5 pr-3 py-2 space-y-5'>
                                                <div className=' font-montserrat space-y-3'>
                                                    {sub.map((sub, innerSubIndex) => (
                                                        <div className=' text-[14px] xl:text-[15px] tracking-wide line-clamp-1 w-full flex items-center justify-between py-1 pr-1'
                                                        key={innerSubIndex}>
                                                            <span className=' hidden postMd:block line-clamp-1'>
                                                                {innerSubIndex+1}) {sub.fName}
                                                            </span>
                                                            
                                                            <span className='  postMd:hidden block line-clamp-1'>
                                                                {sub.name}
                                                            </span>

                                                            <button className=' w-fit rounded-lg md:p-[1px] bg-yellow-800 text-yellow-200 transition-all md:hover:scale-110'>
                                                                <CiEdit
                                                                    className=' text-[1.5rem]'
                                                                />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                    
                                                <button className=' w-fit rounded-full bg-blue-400 text-blue-800 hover:rotate-90 transition-all active:scale-125'>
                                                    <IoIosAdd
                                                        className=' text-[1.5rem]'
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllSubjects;

