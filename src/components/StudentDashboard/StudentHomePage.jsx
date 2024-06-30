import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../CreateClient';
import { HiOutlineIdentification } from 'react-icons/hi';
import { MdOutlineEmail, MdOutlinePerson2 } from 'react-icons/md';
import { FiLock, FiUnlock } from 'react-icons/fi';
import ShiftingCountdown, { NavigationActions } from '../../common/Animation';
import UpdateData from './UpdateData';
import { useDispatch } from 'react-redux';
import { setStudentInfo } from '../../reduxStore/reducers/StudentDashboardSlice';
import { PiIdentificationBadge } from "react-icons/pi";
import UploadResponses from './UploadResponses';

const navArr = [
    { name: 'Name', val: 'name' },
    { name: 'Roll no', val: 'rollNo' },
    { name: 'Email', val: 'emailId' },
    { name: 'Password', val: 'password' },
    { name: 'USN Id', val: 'usnId' },
];

const StudentHomePage = () => {
    const navigate = useNavigate();
    const tableName = useMemo(() => {
        return localStorage.getItem('studentTableName')
    }, []);
    const { usnid } = useParams();
    const [studentData, setStudentData] = useState({
        name: '',
        emailId: '',
        password: '',
        usnId: '',
        birthDate: '',
        semester: '',
        department: '',
    });
    const [pswdVisibility, setPswdVisibility] = useState(false);
    const [selected, setSelected] = useState(navArr[0].name);
    const dispatch = useDispatch();

    useEffect(() => {
        if (tableName === null) navigate('/')
    }, []);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const { data, error } = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('usnId', usnid)
                    .single();

                if (error) {
                    console.error('Error querying database:', error.message);
                    toast.error('No student found with the provided credentials.', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    return;
                }

                if (!data) {
                    console.error('No data received from database.');
                    toast.error('No student found with the provided credentials.');
                    return;
                } else {
                    setStudentData(data);
                    dispatch(setStudentInfo(data))
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
        };

        if (tableName !== null) {
            toast.promise(fetchStudentData(), {
                loading: 'Loading student data...',
                success: 'Student data loaded successfully!',
                error: 'Failed to load student data.',
            }, {style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    }, [tableName, usnid]);

    const switchValues = (selected) => {
        switch (selected) {
            case 'USN Id':
                return <div className=' flex items-center gap-x-2 lg:gap-x-5 text-[12px] sm:text-lg'>
                    <HiOutlineIdentification className=' text-[1.5rem] lg:text-[1.7rem] text-green-500'/>
                    {studentData.usnId}
                </div>

            case 'Name':
                return <div className=' flex items-center gap-x-5  text-[16px] lg:text-lg'>
                    <MdOutlinePerson2 className=' text-[1.7rem] text-blue-500'/>
                    {studentData.name}
                </div>

            case 'Roll no':
                return <div className=' flex items-center gap-x-5'>
                    <PiIdentificationBadge className=' text-2xl text-violet-400'/>Roll no: {studentData.rollNo}
                </div>
                
            case 'Email':
                return <div className=' flex items-center gap-x-5'>
                    <MdOutlineEmail className=' text-2xl text-yellow-500'/> {studentData.emailId}
                </div>

            case 'Password':
                return <div className=' flex items-center gap-x-5 w-full'>
                    <button onClick={() => setPswdVisibility(!pswdVisibility)}>
                        {pswdVisibility 
                            ? <FiUnlock className=' text-2xl text-red-500'/> 
                            : <FiLock className=' text-2xl text-red-500'/> 
                        }
                    </button>

                    <input 
                        type={`${pswdVisibility ? 'text' : 'password'}`} 
                        value={studentData.password}
                        className=' w-full bg-transparent'
                        disabled
                    />
                </div>
                
            default:
                break;
        }
    };

    return (
        <div className=' flex flex-col items-center gap-y-8 h-screen overflow-y-auto bg-slate-700 py-3 xmd:px-3 px-2 sm:px-5'>
            {/* navbar */}
            <div className=' w-full'>
                <NavigationActions
                    navArr={navArr}
                    selected={selected} 
                    setSelected={setSelected}
                    personName={studentData.name}
                    userMode={['students', studentData.tableName]}
                    userId={studentData.uniqId}
                />

                <div className='bg-slate-800 rounded-lg py-2 mt-3 px-2 lg:px-5 h-12 flex items-center justify-start'>
                    <div className='text-slate-300 font-mavenPro w-full'>
                        {switchValues(selected)}
                    </div>
                </div>
            </div>

            <ShiftingCountdown date={studentData?.birthDate}/>

            {/* assignments */}
            <div className=' mt-8 w-full'>
                <UploadResponses/>
            </div>

            {/* content */}
            <div className=' mt-8 w-full lg:w-[50rem xl:w-[70rem]'>
                <UpdateData
                    studentData={studentData}
                    setStudentData={setStudentData}
                    usnId={usnid}
                />
            </div>
        </div>
    );
};

export default StudentHomePage;
