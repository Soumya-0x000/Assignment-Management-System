import React, { useEffect } from 'react'
import { supabase } from '../../CreateClient';
import { formatSemester } from '../../common/customHooks';
import { useSelector } from 'react-redux';

const RenderAssignments = () => {
    const { studentData, subjectsArray } = useSelector(state => state.studentDashboard);

    useEffect(() => {
        (async() => {
            try {
                const semName = formatSemester(`${studentData?.semester}`).split(' ')[0]+'Sem'
                const folderPath = `${studentData?.department}/${semName}`

                const { data: assignmentData, error: assignmentError } = await supabase
                    .storage
                    .from('assignments')
                    .list(folderPath)

                const updatedAssignments = assignmentData.slice(1);
                if (assignmentError) {
                    console.error('Error fetching assignments from Supabase:', assignmentError);
                    toast.error('Error fetching assignments', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    })
                } else {
                    const subjects = subjectsArray[studentData.department].find(val => Object.entries(val))
                    console.log(subjects)
                }
            } catch (error) {
                console.log('Error fetching assignments from Supabase:', error);
                toast.error('Error fetching assignments from Supabase', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            }
        })()
    }, [studentData]);

    console.log(studentData)
    return (
        <div>RenderAssignments</div>
    )
}

export default RenderAssignments;
