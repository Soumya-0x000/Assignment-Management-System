import React, { useEffect, useState } from 'react'
import { 
    Button, 
    Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, 
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader 
} from '@nextui-org/react';
import { FaDownload } from 'react-icons/fa6';
import { useDateFormatter } from "@react-aria/i18n";
import { downloadFile, formatSemester, parseDate } from '../../common/customHooks';
import toast from 'react-hot-toast';
import { supabase } from '../../CreateClient';
import { MdOutlineGrade } from "react-icons/md";
import { useSelector } from 'react-redux';

const SubmittedResponses = ({ modalStatus, setModalStatus, assignment }) => {
    const { gradeArr } = useSelector(state => state.teacherAuth);

    let formatter = useDateFormatter({dateStyle: "full"});
    const [assignmentToRender, setAssignmentToRender] = useState({});
    const [studentInfo, setStudentInfo] = useState([{
        name: '',
        rollNo: ''
    }]);
    const [notSubmittedData, setNotSubmittedData] = useState([{
        name: '',
        rollNo: ''
    }])
    const [selectTedGrade, setSelectTedGrade] = useState(new Set([""]));
    const [allStudentData, setAllStudentData] = useState({});
    const [notNullStudentAssignmentData, setNotNullStudentAssignmentData] = useState({});
    const [assignmentWithGrade, setAssignmentWithGrade] = useState({});

    const handleFileDownloadToast = (item) => {
        toast.promise(handleFileDownload(item), {
            loading: 'Downloading...',
            success: 'File downloaded successfully',
            error: 'Error in downloading file'
        }, {style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                padding: '16px'
            }
        })
    };

    const handleFileDownload = async(item) => {
        try {            
            const fileName = item?.myFileName;
            const path = `${item?.dept}/${item?.sem}/${fileName}`;

            const { data: storageData, error: storageError } = await supabase
                .storage
                .from('submittedAssignments')
                .download(path)

            if (storageError) {
                console.error('Error in downloading file');
                toast.error('Error in downloading file', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        padding: '16px'
                    }
                });
            } else {
                toast.success(`${item.orgName} downloaded successfully`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        padding: '16px'
                    }
                });
                await downloadFile(storageData, item.myFileOrgName);
            }
        } catch (error) {
            console.error('Error in downloading file');
            toast.error('Error in downloading file', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    padding: '16px'
                }
            });
        }
    };

    useEffect(() => {
        (async() => {
            if (modalStatus) {
                try {
                    const tableName = `studentsSem${[...assignment?.sem][0]}`
                    const { department, fullSubName } = assignment

                    const {data: studentData, error: studentError} = await supabase
                        .from(tableName)
                        .select('*')
                        .eq('department', department)

                    if (studentError && notSubmittedStudentError) {
                        console.error('An unexpected error occurred:', studentError);
                        toast.error('Error in getting student responses', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                                padding: '16px'
                            }
                        });
                    }

                    if (!studentData.length) {
                        toast('No responses found', {
                            icon: '⚠️',
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                                padding: '16px'
                            }
                        });
                        setAssignmentToRender([])
                    } else if (studentData.length > 0) {
                        setAllStudentData(studentData)
                        assignmentDataExtractor(studentData, fullSubName)
                    }
                } catch (error) {
                    console.error('An unexpected error occurred:', error);
                    toast.error('Error in getting student responses', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                            padding: '16px'
                        }
                    })
                }
            }
        })()
    }, [assignment, modalStatus]);

    const assignmentDataExtractor = (studentData, fullSubName) => {
        const submittedStudents = studentData?.filter(val => val.submittedAssignments !== null)
        setNotNullStudentAssignmentData(submittedStudents);

        const tempArr = (submittedStudents
            ?.map(val => val?.submittedAssignments[fullSubName])
            .flat()
        ).filter(Boolean) || [];
        const filteredOnSubName = tempArr?.filter(val => val.assignmentOrgName === assignment?.orgName)
        setAssignmentToRender(filteredOnSubName);

        const studentDetails = submittedStudents.map(({name, rollNo}) => [{name, rollNo}]).flat();
        setStudentInfo(studentDetails)
        setSelectTedGrade((new Set([""])))
        
        const submittingStudentName = [...new Set(filteredOnSubName.map(item => item.name))]
        const notSubmittedStudents = studentData?.filter(val => !submittingStudentName.includes(val.name)) || [];
        setNotSubmittedData(notSubmittedStudents);
    }
    
    const detectRealtimeChanges = () => {
        const { department, fullSubName } = assignment
        let tableName = '';
        if (Object.keys(assignment).length) tableName = `studentsSem${[...assignment?.sem][0]}`
        
        supabase.channel('get-1stSem-student-data')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: `${tableName}`,
                filter: `department=eq.${department}`
            }, (payload) => {
                const { new: newStudentData } = payload
                
                const newEntryIndex = allStudentData.findIndex(val => val.uniqId === newStudentData.uniqId)

                if (newEntryIndex !== -1) {
                    allStudentData[newEntryIndex] = newStudentData
                    assignmentDataExtractor(allStudentData, fullSubName)
                }
            }
        ).subscribe()
    };
    detectRealtimeChanges();

    const handleGrade = (e, item, indx) => {
        setSelectTedGrade(e)
        const grade = Array.from(e)[0]

        const newItem = { ...item, grade };
        !grade && delete newItem.grade
        
        const newAssignmentArr = [...assignmentToRender]
        newAssignmentArr[indx] = newItem
        setAssignmentToRender(newAssignmentArr);

        const extractedAssignmentEntry = notNullStudentAssignmentData.find(val => val.name === item.name)['submittedAssignments']
        const temp = extractedAssignmentEntry[item.fullSubName]
       
        const getIndex = temp.findIndex(val => val.myFileName === newItem.myFileName)
        temp[getIndex] = newItem

        const assignmentToUpload = {
            ...extractedAssignmentEntry,
            [item.fullSubName]: temp
        }

        const updatedStudentData = {
            ...notNullStudentAssignmentData,
            [notNullStudentAssignmentData.findIndex(val => val.name === item.name)]: {
                ...notNullStudentAssignmentData[notNullStudentAssignmentData.findIndex(val => val.name === item.name)],
                ['submittedAssignments']: assignmentToUpload
            }
        }
        setAssignmentWithGrade(Object.values(updatedStudentData))
    };

    const updateWithGrades = async () => {
        try {
            for (const assignment of assignmentWithGrade) {
                const gradeExistence = Object.values(assignment?.submittedAssignments)
                ?.map(val => (val
                    ?.map(val => val?.grade)
                    ?.filter(Boolean)
                ))?.flat();
                
                if(!gradeExistence.length) return

                const {data: updatedGradeData, error: gradeError} = await supabase
                    .from(assignment?.tableName)
                    .update({submittedAssignments: assignment?.submittedAssignments})
                    .neq('submittedAssignments', null)
                    .eq('usnId', assignment['usnId'])

                if (gradeError) {
                    console.error('An unexpected error occurred in updating students with grade:', gradeError);
                    toast.error('Error in updating students with grade', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                            padding: '16px'
                        }
                    })
                }

                if (updatedGradeData) {
                    toast.success('Grades updated successfully', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                            padding: '16px'
                        }
                    })
                }
            }
        } catch (error) {
            console.error('An unexpected error occurred in updating students with grade:', error);
            toast.error('Error in updating students with grade', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    padding: '16px'
                }
            })
        } finally {
            setModalStatus(false)
            setAssignmentWithGrade(false)
            setSelectTedGrade(new Set([""]))
        }
    };

    const updateGradeToast = () => {
        if (assignmentWithGrade) {
            toast.promise(updateWithGrades(), {
                loading: 'Updating grades...',
                success: 'Grades updated successfully',
                error: 'Error in updating grades'
            }, {style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    padding: '16px'
                }
            })
        } else {
            toast.error('Please grade at least one student', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                    padding: '16px'
                }
            })
        }
    };
    
    const getGradeColor = (grade) => {
        const gradeItem = gradeArr.find(item => item.value === grade);
        if (gradeItem) return gradeItem.color;
        else return 'bg-gray-400, text-gray-900' ;
    };

    return (
        <Modal 
        size={'full'} 
        className=' bg-slate-800 overflow-y-auto'
        isOpen={modalStatus} 
        onClose={() => setModalStatus(false)}>
            <ModalContent>
            {(setModalStatus) => (<>
                <ModalHeader className=" font-robotoMono text-yellow-200 pb-3 border-b-1 mx-3 border-green-300">
                    Submitted assignments {assignmentToRender?.length > 0 && <>
                        ({assignmentToRender?.length}) 
                    </>}
                </ModalHeader>

                <ModalBody>
                    {/* question assignment */}
                    <div className=' border-b w-fit border-green-400 pb-3'>
                        <div className='bg-[#385368] rounded-xl mt-5 p-3 flex flex-col gap-y-3 group w-full sm:w-fit overflow-hidden cursor-pointer group transition-all line-clamp-1' >
                            <div className='text-cyan-200 text-lg font-bold font-robotoMono tracking-wider mb-2 line-clamp-1 w-fit  group-hover:translate-x-1 group-hover:-translate-y-[3px] transition-all'>
                                {assignment?.orgName}
                            </div>

                            <div className='text-gray-300 font-onest tracking-wider flex flex-wrap gap-1.5 xl:gap-2.5 group-hover:translate-x-1  group-hover:-translate-y-1 transition-all'>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.sem}</span>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.department}</span>
                                <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.subject}</span>
                            </div>

                            <div className=' font-robotoMono text-sm bg-slate-950 text-green-300 w-fit px-3 py-1 rounded-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-all'>
                                Deadline: {assignment.submitDeadline && formatter.format(parseDate(assignment.submitDeadline))}
                            </div>
                        </div>
                    </div>
                    
                    {/* assignment list */}
                    {assignmentToRender?.length > 0 ? (
                        <div className=' grid grid-cols-1 sm:grid-cols-2 postLg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-10'>
                            {assignmentToRender.map((item, indx) => (
                                <div 
                                className=' bg-slate-900 rounded-lg overflow-hidden py-3 px-4 w-full relative'
                                key={indx}>
                                    {/* index no */}
                                    <span className=' absolute p-2 bg-slate-950 right-0 top-0 text-violet-300 rounded-bl-xl font-oxanium font-bold'>
                                        {indx+1}
                                    </span>

                                    {/* name */}
                                    <div className=' text-slate-200 font-mavenPro text-[1.1rem]'>
                                        {item.myFileOrgName} 
                                    </div>

                                    {/* sem, dept, sub */}
                                    <div className=' text-yellow-300 font-robotoMono tracking-wide mt-6 flex gap-2'>
                                        <span className=' bg-[#2e3e67] rounded-lg px-2 py-1 h-fit'>
                                            {item.sem}
                                        </span>
                                        
                                        <span className=' bg-[#2e3e67] rounded-lg px-2 py-1 h-fit'>
                                            {item.dept}
                                        </span>
                                        
                                        <span className=' bg-[#2e3e67] rounded-lg px-2 py-1 h-fit'>
                                            {item.subName}
                                        </span>
                                    </div>

                                    {/* deadline, submission date */}
                                    <div className=' mt-6 font-jaldi text-green-300 tracking-wider flex flex-col gap-y-3 text-[1.05rem]'>
                                        <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                            Deadline: {formatter.format(parseDate(item.deadline))}
                                        </span>
                                        
                                        <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                            Submission date: {formatter.format(parseDate(item.submittedDate))}
                                        </span>
                                    </div>

                                    {/* download and grade */}
                                    <div className=' flex items-center justify-between mt-9'>
                                        <button className=' text-green-400 text-[17px] bg-green-900 p-2 rounded-xl active:scale-110 transition-all group-hover:-translate-x-1'
                                        onClick={() => handleFileDownloadToast(item)}>
                                            <FaDownload/>
                                        </button>
                                        
                                        <div className=' flex items- center justify-center gap-x-3'>
                                            {item?.grade && (
                                                <div className={` ${getGradeColor(item?.grade)} w-fit px-2 h-[2.14rem] rounded-xl flex items-center justify-center gap-x-3 font-bold font-oxanium tracking-wider`}>
                                                    {item?.grade}
                                                    <span>{gradeArr.find(val => val.value === item?.grade).score}</span>
                                                </div>
                                            )}

                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <button className=' text-yellow-300 text-[26px] bg-yellow-900 p-1 rounded-xl active:scale-110 transition-all group-hover:-translate-x-1 border-none'
                                                    onClick={() => setSelectTedGrade(new Set([""]))}>
                                                        <MdOutlineGrade/>
                                                    </button>
                                                </DropdownTrigger>

                                                <DropdownMenu 
                                                selectionMode="single"
                                                selectedKeys={selectTedGrade}
                                                onSelectionChange={(e) => handleGrade(e, item, indx)}
                                                className=' bg-slate-800 rounded-xl text-slate-200 font-oxanium'
                                                closeOnSelect={false}
                                                aria-label="Action event example" >
                                                    {gradeArr.map(dropdownItem => (
                                                        <DropdownItem key={dropdownItem.value}
                                                        className={`${dropdownItem.color}`}>
                                                            <div className=' font-bold space-x-5'>
                                                                <span>{dropdownItem.value}</span>
                                                                <span>{dropdownItem.score}</span>
                                                            </div>
                                                        </DropdownItem>
                                                    ))}
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    {/* submitted by and roll no */}
                                    <div className=' text-indigo-300 tracking-wide font-robotoMono font-bold mt-3 py-2 px-3 rounded-lg bg-slate-950 flex flex-col gap-y-3'>
                                        <span>
                                            Submitted By: {item?.name}
                                        </span>
                                        <span>
                                            Roll no: {studentInfo.flatMap(val => val.name === item.name && val.rollNo)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className=' w-full bg-slate-950 p-3 text-lg font-robotoMono rounded-lg text-white'>
                            No assignment have been submitted yet
                        </div>
                    )}

                    <div className=' flex items-center justify-between'>
                        <Button color="primary" variant="shadow" className=' font-robotoMono tracking-wide text-[1rem]' onPress={updateGradeToast}>
                            Update
                        </Button>
                        
                        <Button color="danger" variant="shadow" className=' font-robotoMono tracking-wide text-[1rem]' onPress={() => setModalStatus(false)}>
                            Close
                        </Button>
                    </div>
                </ModalBody>

                <ModalFooter>
                    {/* not submitted by */}
                    {(notSubmittedData.length > 0) && (
                        <div className=' w-full bg-slate-700 mt-7 p- text-lg font-robotoMono rounded-lg overflow-hidden text-white'>
                            <div className=' text-cyan-200 bg-slate-900 w-full py-2.5 px-3 font-bold tracking-wide'>
                                Not Submitted by
                            </div>

                            <div className=' grid grid-cols-1 xmd:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-2 sm:gap-4 px-3 pb-3'>
                                {notSubmittedData.map((students, indx) => (
                                    <div className=' text-indigo-300 tracking-wide font-robotoMono mt-3 p-2 rounded-lg bg-slate-950 flex flex-col gap-y-4 text-sm sm:text-[.95rem]'
                                    key={indx}>
                                        <span className=' line-clamp-1 font-bold'>
                                            Name: {students?.name}
                                        </span>

                                        <div className=' flex flex-wrap gap-2'>
                                            <span className=' bg-slate-800 px-2 py-1 rounded-md text-purple-300'>
                                                Roll: {students.rollNo}
                                            </span>
                                            <span className=' bg-slate-800 px-2 py-1 rounded-md text-yellow-200'>
                                                {students.department}
                                            </span>
                                            <span className=' bg-slate-800 px-2 py-1 rounded-md text-green-300'>
                                                {formatSemester(`${students.semester}`)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </ModalFooter>
            </>)}
            </ModalContent>
        </Modal>
    )
}

export default SubmittedResponses;
