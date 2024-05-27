import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { CiLogout } from 'react-icons/ci';
import { useParams } from 'react-router-dom';
import { supabase } from '../../CreateClient';
import { HiOutlineIdentification } from 'react-icons/hi';
import { MdOutlineEmail, MdOutlinePerson2 } from 'react-icons/md';
import { FiLock, FiUnlock } from 'react-icons/fi';
import { FlyoutLink, userActions } from '../../common/Animation';
import SlidingTabs from '../../common/SlidingTabs';
import { nameLogo } from '../../common/customHooks';
import UpdateData from './UpdateData';
import { useSelector } from 'react-redux';

const navigationItems = [
    { name: 'Name', val: 'name' },
    { name: 'Email', val: 'emailId' },
    { name: 'Password', val: 'password' },
    { name: 'USN Id', val: 'usnId' },
];

const logoutOptions = [
    { text: 'LogOut', icon: <CiLogout /> },
];

const StudentHomePage = () => {
    const { tableName } = useSelector(state => state.studentDashboard);
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
    const [selected, setSelected] = useState(navigationItems[0].name);

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
    }, [tableName, usnid]);

    const memoizedStudentInfo = useMemo(() => {
        if (studentData) {
            return {
                name: studentData.name,
                emailId: studentData.emailId,
                usnId: studentData.usnId,
                dateOfBirth: studentData.birthDate,
                semester: studentData.semester,
                department: studentData.department,
            };
        }
        return null;
    }, [studentData]);

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
                
            case 'Email':
                return <div className=' flex items-center gap-x-5'>
                    <MdOutlineEmail className=' text-2xl text-yellow-500'/> {studentData.emailId}
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
        <div className=' flex flex-col items-center gap-y-8 h-screen overflow-y-auto bg-slate-700 py-3 xmd:px-3 sm:px-5'>
            {/* navbar */}
            <div className=' w-full'>
                <div className='w-full bg-slate-900 rounded-lg flex items-center justify-between px-2 md:px-4 py-2'>
                    <SlidingTabs 
                        tabs={navigationItems.map((a) => a.name)} 
                        selected={selected} 
                        setSelected={setSelected} 
                    />

                    {memoizedStudentInfo && (
                        <FlyoutLink FlyoutContent={userActions} array={logoutOptions}>
                            <div className='flex flex-col-reverse items-end gap-y-2 justify-center gap-x-3 cursor-pointer'>
                                <div className='h-14 w-14 bg-slate-700 text-green-300 flex items-center justify-center text-lg font-robotoMono tracking-wider rounded-full overflow-hidden'>
                                    <div className='flex items-center justify-center gap-x-2'>
                                        {nameLogo(studentData.name)}
                                    </div>
                                </div>
                            </div>
                        </FlyoutLink>
                    )}
                </div>

                <div className='bg-slate-800 rounded-lg py-2 mt-3 px-2 lg:px-5 h-12 flex items-center justify-start'>
                    <div className='text-slate-300 font-mavenPro'>
                        {switchValues(selected)}
                    </div>
                </div>
            </div>

            {/* content */}
            <div className=' mt-8 w-full lg:w-[50rem] xl:w-[70rem]'>
                <UpdateData
                    studentData={studentData}
                    setStudentData={setStudentData}
                    tableName={tableName}
                    usnId={usnid}
                />
            </div>
        </div>
    );
};

export default StudentHomePage;
