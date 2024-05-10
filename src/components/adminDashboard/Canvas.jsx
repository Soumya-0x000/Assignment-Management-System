import React from 'react'
import { useSelector } from 'react-redux'
import TeacherCard from './cards/TeacherCard';
import StudentCard from './cards/StudentCard';

const Canvas = () => {
    const { mode } = useSelector(state => state.adminDashboard);

    const dataToRender = () => {
        switch (mode) {
            case 'teacher':
                return <TeacherCard/>
            case 'student':
                return <StudentCard/>
            default:
                return [];
        }
    };

    return (
        <div className='w-full'>
            {dataToRender()}
        </div>
    )
}

export default Canvas;
