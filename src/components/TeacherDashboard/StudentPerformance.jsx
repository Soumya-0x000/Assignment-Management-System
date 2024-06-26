import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';

const StudentPerformance = ({ searchMode, populatingKey }) => {
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);
    const { teacherData } = useSelector(state => state.teacherAuth);
    const [studentResponse, setStudentResponse] = useState([]);

    useEffect(() => {
        if (searchMode?.Department 
            && searchMode?.Semester 
            && populatingKey?.length
        ) {
            (async() => {
                const studentTableName = `studentsSem${+searchMode?.Semester + 1}`;
                const department = teacherAssignClassDetails.dept[searchMode?.Department];
                const semester = teacherAssignClassDetails.sem[(searchMode?.Semester)].split(' ').join('');
                const teacherSubjects = teacherData[department].filter(item => item[semester]);

                try {
                    const { data: studentData, error: studentError } = await supabase
                        .from(studentTableName)
                        .select('submittedAssignments, name, rollNo')
                        .eq('department', department)
                        .neq('submittedAssignments', null)

                    if (studentError) throw studentError;
                    // console.log(studentData)

                    const assignments = teacherSubjects.map(item => studentData[item])
                    console.log(assignments)

                } catch (error) {
                    console.log(error)
                    toast.error('Error in getting students', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    })
                }                
            })();
        }

        const timeoutId = setTimeout(() => {
            if (!populatingKey?.length) {
                toast('You have not given any assignment', {
                    icon: '⚠️',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        }, 1000)

        return () => clearTimeout(timeoutId)
    }, [searchMode, populatingKey]);

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
