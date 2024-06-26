import React from 'react'
import { useSelector } from 'react-redux'
import TeacherCard from './cards/TeacherCard';
import StudentCard from './cards/StudentCard';
import InsertPage from './cards/Insert/InsertPage';
import SearchCard from './cards/search/SearchCard';
import HomePage from './HomePage';

const Canvas = () => {
    const { mode, dataForCanvas } = useSelector(state => state.adminDashboard) ?? {};
    
    const dataToRender = () => {
        if (!mode) return <HomePage/>;

        switch (mode) {
            case 'teacher':
                return dataForCanvas && dataForCanvas.length > 0 ? <TeacherCard/> : [];
            case 'student':
                return dataForCanvas && dataForCanvas.length > 0 ? <StudentCard/> : [];
            case 'insert':
                return <InsertPage/>;
            case 'search':
                return <SearchCard/>;
            case 'home':
                return <HomePage/>;
            default:
                return <HomePage/>;
        }
    };

    return (
        <div className='w-full h-full overflow-y-auto p-3'>
            {dataToRender()}
        </div>
    )
}

export default Canvas;
