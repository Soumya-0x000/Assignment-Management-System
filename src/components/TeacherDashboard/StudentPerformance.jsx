import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const StudentPerformance = ({ searchModeArr, searchMode }) => {
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);
    console.log(teacherAssignClassDetails)
    console.log(searchMode)
    console.log(searchModeArr)

    return (
        <div className=' w-full flex'>
            {(searchMode?.Department && searchMode?.Semester) ? (
                <div>
                    
                </div>
            ) : (
                <div className=' text-lg w-full font-robotoMono font-bold mt-3 bg-slate-800 py-2 px-3 rounded-lg'>
                    Select department and semester first
                </div>
            )}
        </div>
    )
}

export default StudentPerformance;
