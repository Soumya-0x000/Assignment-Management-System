import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';
import { RadioGroup } from '@nextui-org/react';
import { CustomRadio } from '../../common/CustomRadioBtn'

const StudentPerformance = ({ searchMode, populatingKey, selectedView }) => {
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);
    const { teacherData } = useSelector(state => state.teacherAuth);
    const { gradeArr } = useSelector(state => state.teacherAuth);

    const [allSubjects, setAllSubjects] = useState([]);
    const [subjects, setSubjects] = useState({
        assignmentSubjects: [],
        selectedSubject: ''
    })
    const [studentResponse, setStudentResponse] = useState([]);
    const [avgScore, setAvgScore] = useState([]);

    const setSelectedSubject = (item) => {
        setSubjects(prev => ({
            ...prev,
            selectedSubject: item
        }))
    };

    useEffect(() => {
        setSubjects({
            assignmentSubjects: [],
            selectedSubject: ''
        })
    }, [selectedView]);

    useEffect(() => {
        const checkCondition = searchMode?.Department 
            && searchMode?.Semester 
            && populatingKey?.length

        if(!checkCondition) return

        const studentTableName = `studentsSem${+searchMode?.Semester + 1}`;
        const department = teacherAssignClassDetails.dept[searchMode?.Department];
        const semester = teacherAssignClassDetails.sem[(searchMode?.Semester)].split(' ').join('');
        const teacherSubjects = teacherData[department].filter(item => item[semester]);

        (() => {
            const subjects = Object.values(...teacherSubjects)[0]
                .split(',')
                .map(item => item.trim());

            const extractedOrgSubjects = allSubjects[0]?.[department][semester]
                .filter(item => subjects.includes(item.name)) || []

            setSubjects(prev => ({
                ...prev, 
                assignmentSubjects: extractedOrgSubjects
            }))
        })();

        if (checkCondition) {
            (async() => {
                try {
                    const { data: studentData, error: studentError } = await supabase
                        .from(studentTableName)
                        .select('submittedAssignments')
                        .eq('department', department)
                        .neq('submittedAssignments', null)

                    if (studentError) throw studentError;
                    setStudentResponse(studentData)
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

    useMemo(() => {
        (async() => {
            try {
                const { data: allSubjects, error: subjectError} = await supabase
                    .from('subjects')
                    .select('*')
                
                setAllSubjects(allSubjects)
            } catch (error) {
                console.error(error)
                toast.error('Error in getting subjects', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            }
        })();
    }, []);

    useEffect(() => {
        if (!!studentResponse?.length) {
            const sortOnSubject = populatingKey
                .flat()
                .flatMap(item => item.fullSubName === subjects.selectedSubject && item.name)
                .filter(Boolean)
                || []

            const extractGrade = (grade) => gradeArr.find(val => val.value === grade)?.score.split('%')[0]

            const tempArr = studentResponse
                .map(item => Object.values(item))
                .flat()
                .map(item => item[subjects.selectedSubject])
                .filter(Boolean)
                .map(item => item
                    .filter(innerItem => sortOnSubject
                        .includes(innerItem.assignmentName)
                    )
                )
                .map(item => {
                    const itemLength = item?.length

                    const totalScore = item.reduce((accumulator, currentValue) => {
                        var marks = 0 
                        if(extractGrade(currentValue?.grade)) {
                            marks = +extractGrade(currentValue?.grade)
                        } 
                        return (marks + accumulator)
                    }, 0)
                    
                    return {
                        name: item[0]?.name,
                        rollNo: item[0]?.roll,
                        avgScore: (totalScore/itemLength).toFixed(2),
                        assignmentCount: itemLength
                    }
                })
                .filter(Boolean)

            setAvgScore(tempArr)
        }
    }, [subjects.selectedSubject])

    return (
        <div className=' w-full flex flex-col gap-y-3'>      
            {(searchMode?.Department && searchMode?.Semester) ? <>
                <RadioGroup 
                className=' text-gray-300 mt-3'
                value={subjects.selectedSubject}
                onValueChange={(e) => setSelectedSubject(e)}>
                    <div className=' flex flex-wrap gap-2 items-center'>
                        {[...subjects.assignmentSubjects].map((subject, index) => (
                            <CustomRadio key={index} value={subject.fName}>
                                {subject.name}
                            </CustomRadio>
                        ))}
                    </div>
                </RadioGroup>

                {!!avgScore.length && (
                    <div className=' grid grid-cols-1 postMd:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-3'>
                        {avgScore.map((item, i) => (
                            <div className=' flex flex-wrap postMd:grid postMd:grid-cols-2 gap-2 gap-x-2 rounded-lg p-2 bg-[#1e5341] text-[#9fffcfe8] text-[.9rem] font-onest tracking-wide font-bold w-full h-fit'
                            key={i}>
                                <span className=' bg-green-950 rounded-lg px-3 py-1.5'>Name: {item?.name}</span>
                                <span className='w-fi bg-green-950 rounded-lg px-3 py-1.5'>Roll no: {item?.rollNo}</span>
                                <span className=' bg-green-950 rounded-lg px-3 py-1.5'>Avg score: {item?.avgScore}</span>
                            </div>
                        ))}
                    </div>
                )}
            </> : (
                <div className=' text-lg w-full font-robotoMono font-bold mt-3 bg-slate-800 py-2 px-3 rounded-lg'>
                    Select department and semester first
                </div>
            )}
        </div>
    )
}

export default StudentPerformance;
