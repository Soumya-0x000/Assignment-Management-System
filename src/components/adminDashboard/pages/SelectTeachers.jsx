import React, { useEffect } from 'react'
import { supabase } from '../../../CreateClient';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setTeachers } from '../../../reduxStore/reducers/AdminDashboardSlice';
import { GiTeacher } from 'react-icons/gi';

const SelectTeachers = ({sidebarHold}) => {
    const dispatch = useDispatch();

    const AllTeachersFetch = async () => {
        try {
            const { data: teacherData, error: teacherError } = await supabase
                .from('teachers')
                .select('*')
            console.log(teacherData)
                if (teacherError) {
                toast.error('Error in fetching teachers...')
            } else {
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
        <button className=' rounded-lg text-xl bg-[#3a9dd2e8] w-full h-10 text-white flex items-center justify-center gap-x-3 border-none outline-none'
        onClick={handleMainBtnClick}>
            <GiTeacher className=' text-2xl'/>
            <span className={`${sidebarHold ? 'block' : 'hidden group-hover:block'}`}>Teachers</span>
        </button>
    )
    
}

export default SelectTeachers;
