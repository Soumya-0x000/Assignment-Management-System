import React, { useEffect, useMemo, useState } from 'react'
import { setDeptSemSubjects } from '../../../reduxStore/reducers/AdminDashboardSlice';
import toast from 'react-hot-toast';
import { supabase } from '../../../CreateClient';
import { useDispatch } from 'react-redux';

const AllSubjects = () => {
    const dispatch = useDispatch();
    const [subjectsInfo, setSubjectsInfo] = useState({});

    useMemo(() => {
        (async () => {
            try {
                const { data: subjectData, error: subjectError } = await supabase
                    .from('subjects')
                    .select('MCA, MSc');
                
                if (subjectError) {
                    toast.error('Error in fetching subjects', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    console.error('Error in fetching subjects', subjectError);
                } else {
                    setSubjectsInfo(subjectData)
                    dispatch(setDeptSemSubjects(subjectData[0]))
                }
            } catch (error) {
                console.error(error);
                toast.error('Error in fetching subjects', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                });
            }
        })();
    }, []);

    return (
        <div>AllSubjects</div>
    )
}

export default AllSubjects;