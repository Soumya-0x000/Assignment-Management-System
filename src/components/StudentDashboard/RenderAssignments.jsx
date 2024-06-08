import React, { useEffect, useState } from 'react'
import { supabase } from '../../CreateClient';
import { downloadFile, formatSemester, parseDate } from '../../common/customHooks';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { RadioGroup, Tooltip } from '@nextui-org/react';
import { CustomRadio } from '../../common/CustomRadioBtn';
import { motion } from 'framer-motion';
import { childVariants, staggerVariants } from '../../common/Animation';
import { FaDownload } from 'react-icons/fa';
import { useDateFormatter } from "@react-aria/i18n";

const RenderAssignments = () => {
    const { studentData } = useSelector(state => state.studentDashboard);
    const [mySubjects, setMySubjects] = useState([]);
    const [myAssignments, setMyAssignments] = useState([]);
    const [renderedAssignments, setRenderedAssignments] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('All');

    let formatter = useDateFormatter({dateStyle: "full"});  

    useEffect(() => {
        if (Object.keys(studentData).length > 0) {
            (async() => {
                try {
                    const semName = formatSemester(`${studentData?.semester}`).split(' ')[0]+'Sem'
                    const assignmentTableName = `${studentData.department}assignments`;

                    const { data: assignmentData, error: assignmentError } = await supabase
                        .from(assignmentTableName)
                        .select(semName)

                    const { data: subjectData, error: subjectError } = await supabase
                        .from('subjects')
                        .select(studentData.department)

                    if (assignmentError || subjectError) {
                        console.error('Error fetching assignments from Supabase:', assignmentError);
                        toast.error('Error fetching assignments', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        })
                    } else {
                        setMySubjects(subjectData[0][studentData.department][semName]);
                        const fetchedAssignments = assignmentData
                            .flatMap(val => Object.entries(val)
                                .filter(([key, val]) => key === semName && val)
                                .flatMap(([key, val]) => val))
                            .filter(Boolean);

                        setMyAssignments(fetchedAssignments);
                        setSelectedSubject('All');
                    }
                } catch (error) {
                    console.log('Error fetching assignments from Supabase:', error);
                    toast.error('Error fetching assignments', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    })
                }
            })()
        }
    }, [studentData]);

    useEffect(() => {
        if (Object.keys(studentData).length > 0) {
            console.log(Object.keys(studentData).length)
        }
    }, [studentData])

    useEffect(() => {
        if (selectedSubject === 'All') {
            const tempSelectedSubjects = myAssignments
                .map(assignment => Object.values(assignment))
                .flat().flat()

            setRenderedAssignments(tempSelectedSubjects);
        } else {
            const tempSelectedSubjects = myAssignments
                .map(assignment => (assignment[selectedSubject]))
                .flat()
                .filter(Boolean)
            
            setRenderedAssignments(tempSelectedSubjects);
        }
    }, [selectedSubject]);

    const handleFileDownload = async(item) => {
        try {
            const semName = item.sem.split(' ').join('');
            const path = `${item?.department}/${semName}/${item?.name}`
            
            const { data: downloadData, error: downloadError } = await supabase
                .storage
                .from('assignments')
                .download(path)

            if (downloadError) {
                console.log('Error in downloading file');
                toast.error('Error in downloading file', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            }
                
            await downloadFile(downloadData, item);
        } catch (error) {
            console.error('Error in downloading file');
            toast.error('Error in downloading file', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    const handleFileDownloadToast = (value) => {
        toast.promise(handleFileDownload(value), {
            loading: 'Downloading...',
            success: 'File downloaded successfully',
            error: 'Error in downloading file'
        }, {
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        })
    }

    return (
        <div>
            <RadioGroup 
            className=' text-gray-300'
            value={selectedSubject} 
            onValueChange={setSelectedSubject}>
                <div className=' flex flex-wrap gap-2 items-center'>
                    {[{name: 'All', fName: 'All'}, ...mySubjects].map((subject, index) => (
                        <CustomRadio key={index} value={subject.name}>
                            {subject.name}
                        </CustomRadio>
                    ))}
                </div>
            </RadioGroup>

            <motion.div className=' flex flex-wrap gap-4 rounded-lg overflow-hidden mt-10'
            variants={staggerVariants}
            initial="initial"
            animate="animate">
                {renderedAssignments.length > 0 ? (<>
                    {renderedAssignments.map((item, indx) => (
                        <motion.div 
                        variants={childVariants}
                        className='bg-[#19253a] rounded-xl p-3 flex flex-col gap-y-3 group w-full sm:w-fit max-w-full sm:max-w-[25rem] overflow-hidden cursor-pointer group transition-all' 
                        key={indx}>
                            <Tooltip color='secondary'
                            content={item.orgName}
                            className=' capitalize max-w-full sm:max-w-[20rem] md:max-w-full overflow-hidden md:overflow-visible flex flex-wrap items-start justify-center whitespace-normal text-balance text-white'
                            placement='top'>
                                <div className='text-gray-300 font-bold font-robotoMono tracking-wider mb-2 line-clamp-1 w-fit  group-hover:translate-x-1 group-hover:-translate-y-[3px] transition-all'>
                                    {item.orgName}
                                </div>
                            </Tooltip>

                            <div className='text-gray-300 font-onest tracking-wider flex flex-wrap gap-1.5 xl:gap-2.5 group-hover:translate-x-1  group-hover:-translate-y-1 transition-all'>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{item.sem}</span>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{item.department}</span>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{item.subject}</span>
                            </div>

                            <div className=' font-robotoMono text-sm bg-slate-950 text-green-300 w-fit px-3 py-1 rounded-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-all'>
                                {item.submitDeadline && formatter.format(parseDate(item.submitDeadline))}
                            </div>

                            <div className=' flex items-center justify-between mt-3'>
                                <button className=' text-green-400 text-[17px] bg-green-900 p-2 rounded-xl active:scale-110 transition-all group-hover:translate-x-1'
                                onClick={() => handleFileDownloadToast(item)}>
                                    <FaDownload/>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </>) : (
                    <div className=' text-lg font-robotoMono font-bold mt-3 bg-slate-800 py-2 px-3 rounded-lg w-full text-slate-200'>
                        No assignments {selectedSubject === 'All' ? '' : selectedSubject}
                    </div>
                )}
            </motion.div>
        </div>
    )
}

export default RenderAssignments;
