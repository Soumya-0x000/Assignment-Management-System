import React, { useEffect } from 'react'
import { supabase } from '../../../CreateClient';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setMode, setTeachers } from '../../../reduxStore/reducers/AdminDashboardSlice';
import { GiTeacher } from 'react-icons/gi';

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

    useEffect(() => {
        // handleMainBtnClick()
    }, []);

    return (
        <button className=' rounded-lg text-xl bg-[#3a9dd2e8] w-full h-10 text-white flex items-center justify-center gap-x-2 md:gap-x-3 border-none outline-none'
        onClick={handleMainBtnClick}>
            <GiTeacher className=' md:text-2xl'/>
            <span className={`${sidebarHold ? 'block' : 'hidden group-hover:block'} text-[1rem] md:text-[1.3rem]`}>Teachers</span>
        </button>
    )
    
}

export default SelectTeachers;
