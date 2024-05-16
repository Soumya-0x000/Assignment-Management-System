import React, { useEffect, useState } from 'react';
import { supabase } from '../../CreateClient';
import { formatSemester, nameLogo, shorthandSemester, tableList } from '../../common/customHooks';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import SlidingTabs from '../../common/SlidingTabs';
import { HiOutlineIdentification } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock, FiUnlock } from "react-icons/fi";
import { MdOutlinePerson2 } from "react-icons/md";

const navArr = [
    { name: 'Id', val: 'uniqId' },
    { name: 'Name', val: 'name', title: '' },
    { name: 'Email', val: 'emailId' },
    { name: 'Password', val: 'password' },
];

const HomePage = () => {
    const { adminId } = useParams();
    const [count, setCount] = useState({
        mcaStudents: { sem1: 0, sem2: 0, sem3: 0, sem4: 0 },
        mscStudents: { sem1: 0, sem2: 0, sem3: 0, sem4: 0 },
        teachers: 0,
        admin: 0,
    });
    const [adminDetails, setAdminDetails] = useState({
        uniqId: '',
        name: '',
    });
    const [trackCallingTime, setTrackCallingTime] = useState(0);
    const [studentArr, setStudentArr] = useState([]);
    const [adminTeacherArr, setAdminTeacherArr] = useState([]);
    const [selected, setSelected] = useState(navArr[0].name);
    const [pswdVisibility, setPswdVisibility] = useState(false)

    useEffect(() => {
        const fetchInitialData = async () => {
            setTrackCallingTime((prev) => prev + 1);

            try {
                let mcaStudentsCount = { sem1: 0, sem2: 0, sem3: 0, sem4: 0 };
                let mscStudentsCount = { sem1: 0, sem2: 0, sem3: 0, sem4: 0 };
                let teachersCount = 0;
                let adminCount = 0;

                // Fetch data for students
                const studentPromises = tableList.map(async (val) => {
                    const { data: studentData, error: studentError } = await supabase.from(val).select('*');

                    if (studentData.length > 0) {
                        studentData.forEach((record) => {
                            if (record.department === 'MCA') {
                                mcaStudentsCount[`sem${record.semester}`]++;
                            } else if (record.department === 'MSc') {
                                mscStudentsCount[`sem${record.semester}`]++;
                            }
                        });
                    }
                });

                // Fetch data for teachers
                const { data: teachersData, error: teachersError } = await supabase.from('teachers').select('*');

                if (teachersData) {
                    teachersCount = teachersData.length;
                }

                // Fetch data for admin
                const { data: adminData, error: adminError } = await supabase.from('admin').select('*');

                if (adminData) {
                    adminCount = adminData.length;

                    const adminAccDetails = adminData.find((admin) => admin.uniqId === adminId);
                    setAdminDetails(adminAccDetails);
                }

                await Promise.all(studentPromises);

                setCount({
                    mcaStudents: mcaStudentsCount,
                    mscStudents: mscStudentsCount,
                    teachers: teachersCount,
                    admin: adminCount,
                });
            } catch (error) {
                toast.error('Error occurred while fetching data');
            }
        };

        if (trackCallingTime === 0) {
            toast.promise(
                fetchInitialData(),
                {
                    loading: 'Loading...',
                    success: 'Data fetched successfully',
                    error: 'Error occurred while fetching data',
                },
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            setTrackCallingTime(1);
        }
    }, [trackCallingTime, adminId]);

    useEffect(() => {
        setStudentArr([
            { title: 'MCA Students', data: count.mcaStudents, prefix: 'MCA' },
            { title: 'MSc Students', data: count.mscStudents, prefix: 'MSC' },
        ]);

        setAdminTeacherArr([
            { title: 'Admins', count: count.admin },
            { title: 'Teachers', count: count.teachers },
        ]);
    }, [count]);

    const switchValues = (selected) => {
        switch (selected) {
            case 'Id':
                return <div className=' flex items-center gap-x-5'>
                    <HiOutlineIdentification className=' text-[1.7rem] text-green-500'/>
                    {adminDetails.uniqId}
                </div>

            case 'Name':
                return <div className=' flex items-center gap-x-5'>
                    <MdOutlinePerson2 className=' text-[1.75rem] text-blue-500'/>
                    {adminDetails.title} {adminDetails.name}
                </div>
                
            case 'Email':
                return <div className=' flex items-center gap-x-5'>
                    <MdOutlineEmail className=' text-2xl text-yellow-500'/> {adminDetails.emailId}
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
                        value={adminDetails.password}
                        disabled
                        className=' w-full bg-transparent'
                    />
                </div>
                
            default:
                break;
        }
    };

    return (
        <>
            <div className='w-full bg-slate-800 rounded-lg flex items-center justify-between px-4 h-[5rem]'>
                <SlidingTabs 
                    tabs={navArr.map((a) => a.name)} 
                    selected={selected} 
                    setSelected={setSelected} 
                />

                <div className='flex flex-col-reverse items-end gap-y-2 justify-center gap-x-3'>
                    <div className='h-14 w-14 bg-slate-950 text-green-300 flex items-center justify-center text-lg font-robotoMono tracking-wider rounded-full'>
                        {nameLogo(adminDetails.name)}
                    </div>
                </div>
            </div>

            <div className='bg-slate-900 rounded-lg py-2 mt-3 px-5 h-12'>
                <p className='text-slate-300 font-mavenPro text-lg'>{switchValues(selected)}</p>
            </div>

            <div className='grid grid-cols-4 preXl:gap-x-4 place-items-center gap-y-4 pt-3 '>
                <div className='col-span-4 preXl:col-span-3 grid sm:grid-cols-2 place-items-center gap-x-4 gap-y-4 w-full h-full'>
                    {studentArr.map((category, index) => (
                        <div key={index} className='bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-mavenPro text-lg px-6 rounded-xl w-full h-full flex items-center justify-center py-3'>
                            <div className='w-full '>
                                <div className='mb-2 bg-slate-800 rounded-full px-4 py-1 md:py-2 w-fit text-[1rem] md:text-md'>
                                    Currently we have
                                </div>

                                <div className='mt-4 w-full border-b-1 pb-1 border-b-indigo-300 font-bold tracking-wider'>
                                    {category.title}
                                </div>

                                <div className='grid grid-cols-1 preLg:grid-cols-2 gap-3 mt-3'>
                                    {Object.entries(category.data).map(([semester, count], i) => (
                                        <div className='bg-slate-800 rounded-full py-2 flex md:px-5 items-center justify-center' key={i}>
                                            <div className='hidden 3xl:block text-md'>
                                                {formatSemester(semester.split('sem')[1])}: {count} {count === 1 ? 'student' : 'students'}
                                            </div>

                                            <div className='block 3xl:hidden text-sm'>
                                                {shorthandSemester(formatSemester(semester.split('sem')[1]))}: {count} {count === 1 ? 'student' : 'students'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='col-span-4 preXl:col-span-1 gap-4 text-white font-mavenPro text-lg rounded-lg w-full h-full flex preXl:flex-col justify-between'>
                    {adminTeacherArr.map((category, index) => (
                        <div key={index} className='w-full rounded-xl py-3 px-2 sm:px-5 bg-gradient-to-br from-indigo-600 to-violet-600'>
                            <div className='mb-2 bg-slate-800 rounded-full px-4 py-2 w-fit text-sm sm:text-md lg:text-lg flex gap-x-1.5'>
                                <span className='hidden xsm:block'>Currently</span> we have
                            </div>

                            <div className='mt-2 border-b-1 border-b-indigo-300'/>
                            
                            <div className='mt-2 sm:text-xl'>{category.count} {category.title.toLowerCase()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;
