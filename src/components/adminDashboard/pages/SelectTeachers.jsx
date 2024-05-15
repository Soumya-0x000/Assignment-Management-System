import React, { useEffect } from 'react'
import { supabase } from '../../../CreateClient';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setMode, setTeachers } from '../../../reduxStore/reducers/AdminDashboardSlice';
import { GiTeacher } from 'react-icons/gi';
import { Tooltip } from '@nextui-org/react';

const SelectTeachers = ({sidebarHold}) => {
    const dispatch = useDispatch();

    const AllTeachersFetch = async () => {
        try {
            const { data: teacherData, error: teacherError } = await supabase
                .from('teachers')
                .select('*')
            
            if (teacherError) {
                toast.error('Error in fetching teachers...')
            } else {
                dispatch(setMode('teacher'))
                dispatch(setTeachers(teacherData))
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };
    
    const handleMainBtnClick = () => {
        toast.promise(AllTeachersFetch(), {
            loading: `Loading all teachers...`,
            success: "Successfully loaded all teachers!",
            error: "Failed to load teachers."
        })
    };

    return (
        <Tooltip 
        placement={'right'}
        content={'Teachers'}
        color='primary'
        closeDelay={0}>
            <button className={`${sidebarHold ? ' preLg:pl-5 justify-start' : ' justify-center preLg:group-hover:justify-start preLg:group-hover:pl-5'} rounded-lg text-xl bg-[#3a9dd2e8] w-full h-10 text-white flex items-center gap-x-2 md:gap-x-3 border-none outline-none`}
            onClick={handleMainBtnClick}>
                <GiTeacher className=' md:text-xl'/>
                <span className={`${sidebarHold ? 'block' : 'hidden group-hover:preLg:block'} text-[1rem] md:text-[1.2rem] font-onest`}>Teachers</span>
            </button>
        </Tooltip>
    )
    
}

export default SelectTeachers;
