import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';
import { RadioGroup } from '@nextui-org/react';
import { CustomRadio } from '../../common/CustomRadioBtn'

const StudentPerformance = ({ searchMode, populatingKey }) => {
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);
    const { teacherData } = useSelector(state => state.teacherAuth);
    const [subjects, setSubjects] = useState({
        assignmentSubjects: [],
        selectedSubject: ''
    })
    const [studentResponse, setStudentResponse] = useState([]);

    const setSelectedSubject = (item) => {
        setSubjects(prev => ({
            ...prev,
            selectedSubject: item
        }))
    };

    useEffect(() => {
        const checkCondition = searchMode?.Department 
            && searchMode?.Semester 
            && populatingKey?.length

        if (checkCondition) {
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
                    setStudentResponse(studentData)

                    const subjects = Object.values(...teacherSubjects)[0]
                        .split(',')
                        .map(item => item.trim());

                    setSubjects(prev => ({
                        ...prev, 
                        assignmentSubjects: subjects
                    }))
                } catch (error) {
                    console.error(error)
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

    useEffect(() => {
        console.log(subjects?.selectedSubject)
        console.log(studentResponse.map(item => item?.submittedAssignments))
    }, [subjects.selectedSubject])

    return (
        <div className=' w-full flex'>
            {(studentResponse.length > 0) && (
                <RadioGroup 
                className=' text-gray-300 mt-3'
                value={subjects.selectedSubject}
                onValueChange={(e) => setSelectedSubject(e)}>
                    <div className=' flex flex-wrap gap-2 items-center'>
                        {[...subjects.assignmentSubjects].map((subject, index) => (
                            <CustomRadio key={index} value={subject}>
                                {subject}
                            </CustomRadio>
                        ))}
                    </div>
                </RadioGroup>
            )}
                
            {(searchMode?.Department && searchMode?.Semester ) ? <>
                <div>
                    
                </div>
            </> : (
                <div className=' text-lg w-full font-robotoMono font-bold mt-3 bg-slate-800 py-2 px-3 rounded-lg'>
                    Select department and semester first
                </div>
            )}
        </div>
    )
}

export default StudentPerformance;
