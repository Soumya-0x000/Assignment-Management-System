import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';
import { HiOutlineIdentification } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock, FiUnlock } from "react-icons/fi";
import { MdOutlinePerson2 } from "react-icons/md";
import { NavigationActions } from '../../common/Animation';
import { EditOwnData } from './EditOwnData';
import { 
    Button, 
    Modal, 
    ModalBody, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    useDisclosure 
} from '@nextui-org/react';
import FileUploader from './FileUploader';
import GivenAssignments from './GivenAssignments';
import { useDispatch } from 'react-redux';
import { setDeptSemClasses } from '../../reduxStore/reducers/TeacherAuthSLice';

const navArr = [
    { name: 'Name', val: 'name', title: '' },
    { name: 'Email', val: 'emailId' },
    { name: 'Password', val: 'password' },
    { name: 'Id', val: 'uniqId' },
];

const TeacherHomePage = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const department = ['MCA', 'MSc'];
    const { teacherId } = useParams();
    const [teacherData, setTeacherData] = useState({
        uniqId: '',
        title: "",
        name: "", 
        emailId:"", 
        password: "",
        dept: "",
        sem: "",
        subject: "",
        MCA: [],
        MSc: [],
        MCAassignments: [],
        MScassignments: []
    });
    const [assignments, setAssignments] = useState([]);
    const [selected, setSelected] = useState(navArr[0].name);
    const [pswdVisibility, setPswdVisibility] = useState(false);
    const [currentSemSub, setCurrentSemSub] = useState({
        sem: '',
        subject: '',
        dept: ''
    });
    const [assignmentSubject, setAssignmentSubject] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
        toast.promise(
            (async () => {
                try {
                    const { data, error } = await supabase
                        .from('teachers')
                        .select('*')
                        .eq('uniqId', teacherId);
                    
                    if (error) {
                        console.error('Error querying database:', error.message);
                        toast.error('No teacher found with the provided credentials.');
                        return;
                    }
    
                    if (!data || data.length === 0) {
                        console.error('No data received from database.');
                        toast.error('No teacher found with the provided credentials.');
                        return;
                    }
    
                    const teacherData = data[0];
                    
                    teacherData.MCA = sortDept(teacherData.MCA);
                    teacherData.MSc = sortDept(teacherData.MSc);
                    setTeacherData(teacherData);

                    console.log(teacherData)
                    if (teacherData.MCAassignments || teacherData.MScassignments) {
                        const totalAssignments = [
                            ...(teacherData.MCAassignments !== null ? teacherData.MCAassignments : []),
                            ...(teacherData.MScassignments !== null ? teacherData.MScassignments : [])
                        ];
    
                        setAssignments(totalAssignments);
                    }
                } catch (error) {
                    console.error('An unexpected error occurred:', error.message);
                    toast.error('An unexpected error occurred', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                }
            })(), {
                loading: 'Loading',
                success: 'Response received',
                error: 'Error occurred to get response'
            }, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            }
        )
    }, []);

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
                    dispatch(setDeptSemClasses(subjectData[0]))
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

    useEffect(() => {
        setAssignments(assignments)
    }, [assignments])

    const switchValues = (selected) => {
        switch (selected) {
            case 'Id':
                return <div className=' flex items-center gap-x-2 lg:gap-x-5  text-[12px] sm:text-lg'>
                    <HiOutlineIdentification className=' text-[1.5rem] lg:text-[1.7rem] text-green-500'/>
                    {teacherData.uniqId}
                </div>

            case 'Name':
                return <div className=' flex items-center gap-x-5  text-[16px] lg:text-lg'>
                    <MdOutlinePerson2 className=' text-[1.7rem] text-blue-500'/>
                    {teacherData.title} {teacherData.name}
                </div>
                
            case 'Email':
                return <div className=' flex items-center gap-x-5'>
                    <MdOutlineEmail className=' text-2xl text-yellow-500'/> {teacherData.emailId}
                </div>

            case 'Password':
                return <div className=' flex items-center gap-x-5'>
                    <button onClick={() => setPswdVisibility(!pswdVisibility)}>
                        {pswdVisibility 
                            ? <FiUnlock className=' text-2xl text-red-500'/> 
                            : <FiLock className=' text-2xl text-red-500'/> 
                        }
                    </button>

                    <input 
                        type={`${pswdVisibility ? 'text' : 'password'}`} 
                        value={teacherData.password}
                        className=' w-full bg-transparent'
                        disabled
                    />
                </div>
                
            default:
                break;
        }
    };

    const handleUploadingModal = (e, sem, subject, dept) => {
        e.preventDefault();

        const isolateSubjects = subject.split(',').map(key => key.trim())
        if(isolateSubjects.length > 1) {
            console.log(isolateSubjects)
            setAssignmentSubject(isolateSubjects)
        } else {
            onOpen();
            setCurrentSemSub({ sem, subject, dept })
        }
    };

    return (
        <div className=' flex flex-col items-center gap-y-8 h-screen overflow-y-auto bg-slate-700 py-3 xmd:px-3 sm:px-5'>
            {/* navbar */}
            <div className=' w-full'>
                <NavigationActions
                    navArr={navArr}
                    selected={selected} 
                    setSelected={setSelected}
                    personName={teacherData.name}
                />

                <div className='bg-slate-800 rounded-lg py-2 mt-3 px-2 lg:px-5 h-12 flex items-center justify-start'>
                    <div className='text-slate-300 font-mavenPro w-full'>
                        {switchValues(selected)}
                    </div>
                </div>
            </div>

            {/* department */}
            <div className=' w-full flex flex-col md:flex-row items-center justify-between gap-x-4 gap-y-3'>
                {department.map((dept, i) => (
                    <div className=' bg-gradient-to-tl from-green-500 to-indigo-600 text-white px-3 py-3 rounded-lg w-full md:w-1/2 h-full'
                    key={dept + i}>
                        <div className=' text-xl border-b-2 pb-1 font-onest'>
                            {dept}
                        </div>

                        {Object.entries(teacherData?.[dept]).length !== 0 ? (
                            <div className=' cursor-pointer grid grid-cols-2  gap-x-4 gap-y-2 mt-3'>
                                {teacherData?.[dept].map((val, index) => (
                                    <React.Fragment key={index}>
                                        {Object.entries(val).map(([key, val], indx) => (
                                            <div className=' bg-slate-800 rounded-lg px-3 py-2' key={indx}
                                            onClick={(e) => handleUploadingModal(e, key, val, dept)}>
                                                {val !== '' && (
                                                    <div>
                                                        <span className=' font-bold font-robotoMono tracking-wider text-gray-300 text-sm lg:text-md xl:text-[1rem]'>{key}: </span> 
                                                        <span className=' font-bold font-onest tracking-wider text-gray-300 text-sm lg:text-md xl:text-[1rem]'>{val}</span>
                                                    </div>
                                                )} 
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (    
                            <div className=' font-bold font-robotoMono tracking-wider bg-slate-800 w-full mt-3 py-2 px-3 rounded-lg text-gray-300'>No classes for {dept}</div> 
                        )}
                    </div>
                ))}
            </div>

            {/* given assignments */}
            <GivenAssignments
                assignments={assignments}
                setAssignments={setAssignments}
                teacherId={teacherId}
            />

            {/* edit own data */}
            <EditOwnData
                title={teacherData.title}
                name={teacherData.name}
                email={teacherData.emailId}
                password={teacherData.password}
                teacherId={teacherData.uniqId}
                mcaSub={teacherData.MCA}
                mscSub={teacherData.MSc}
            />

            {assignmentSubject.length > 1 && (
                <Modal 
                backdrop={'blur'} 
                className=' bg-slate-700 text-slate-200 relative' 
                isOpen={isOpen} 
                onClose={onClose}>
                    <ModalContent>
                    {(onClose) => (<>
                        <ModalHeader className="flex flex-col gap-1">Upload Assignments</ModalHeader>

                        <ModalBody>
                            Whose assignment you want to upload?
                        </ModalBody>

                        <ModalFooter>
                            <Button color="danger" className=' text-md' onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>)}
                    </ModalContent>
                </Modal>
            )}

            {/* Upload assignments modal */}
            <Modal 
            backdrop={'blur'} 
            className=' bg-slate-700 text-slate-200 relative' 
            isOpen={isOpen} 
            onClose={onClose}>
                <ModalContent>
                {(onClose) => (<>
                    <ModalHeader className="flex flex-col gap-1">Upload Assignments</ModalHeader>

                    <ModalBody>
                        <FileUploader 
                            currentValue={currentSemSub} 
                            teacherId={teacherId}
                            onClose={onClose}
                            setAssignments={setAssignments}
                            assignments={assignments}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" className=' text-md' onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default TeacherHomePage;



const sortDept = (dept) => {
    if (!Array.isArray(dept)) return [];

    return dept
        .filter(entry => Object.keys(entry).length > 0)
        .sort((a, b) => {
            const aKey = Object.keys(a)[0];
            const bKey = Object.keys(b)[0];
            return aKey.localeCompare(bKey, undefined, { numeric: true });
        });
};
