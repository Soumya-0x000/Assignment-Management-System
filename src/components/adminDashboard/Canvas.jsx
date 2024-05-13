import React from 'react'
import { useSelector } from 'react-redux'
import TeacherCard from './cards/TeacherCard';
import StudentCard from './cards/StudentCard';
import InsertCard from './cards/Insert/InsertCard';
import SearchCard from './cards/search/SearchCard';

const Canvas = () => {
    const { mode, dataForCanvas } = useSelector(state => state.adminDashboard) ?? {};
    
    const dataToRender = () => {
        if (!mode) return [];

        switch (mode) {
            case 'teacher':
                return dataForCanvas && dataForCanvas.length > 0 ? <TeacherCard/> : [];
            case 'student':
                return dataForCanvas && dataForCanvas.length > 0 ? <StudentCard/> : [];
            case 'insert':
                return <InsertCard/>;
            case 'search':
                return <SearchCard/>;
            default:
                return [];
        }
    };

    return (
        <div className='w-full h-full overflow-y-auto p-3'>
            {dataToRender()}
        </div>
    )
}

export default Canvas;
