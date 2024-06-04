import React, { useEffect, useState } from 'react';
import { supabase } from '../../CreateClient';
import { formatSemester, shorthandSemester, tableList } from '../../common/customHooks';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { HiOutlineIdentification } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock, FiUnlock } from "react-icons/fi";
import { MdOutlinePerson2 } from "react-icons/md";
import { BiSolidLock, BiSolidLockOpen } from 'react-icons/bi';
import { MailIcon } from '../landingPage/icons/MailIcon';
import { BsPersonLinesFill } from 'react-icons/bs';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { NavigationActions } from '../../common/Animation';
import AllSubjects from './pages/AllSubjects';

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
    const [pswdVisibility, setPswdVisibility] = useState(false);

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

                if (teachersData) teachersCount = teachersData.length

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
            toast.promise(fetchInitialData(), {
                loading: 'Loading...',
                success: 'Data fetched successfully',
                error: 'Error occurred while fetching data',
            }, {style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
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
                return <div className=' flex items-center gap-x-2 lg:gap-x-5  text-[15px] sm:text-lg'>
                    <HiOutlineIdentification className=' text-[1.5rem] lg:text-[1.7rem] text-green-500'/>
                    {adminDetails.uniqId}
                </div>

            case 'Name':
                return <div className=' flex items-center gap-x-5  text-[16px] lg:text-lg'>
                    <MdOutlinePerson2 className=' text-[1.7rem] text-blue-500'/>
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
        <div className=' flex flex-col items-center gap-y-16 h-full'>  
            <div className=' w-full'>
                <NavigationActions
                    navArr={navArr}
                    selected={selected} 
                    setSelected={setSelected}
                    personName={adminDetails.name}
                />

                <div className='bg-slate-800 rounded-lg py-3 mt-3 px-2 lg:px-5 '>
                    <div className='text-slate-300 font-mavenPro'>
                        {switchValues(selected)}
                    </div>
                </div>
            </div>

            <div className=' w-full grid grid-cols-4 preXl:gap-x-4 place-items-center gap-y-4 pt-3'>
                <div className='col-span-4 preXl:col-span-3 grid sm:grid-cols-2 place-items-center gap-x-4 gap-y-4 w-full h-full'>
                    {studentArr.map((category, index) => (
                        <div key={index} className='bg-gradient-to-br from-cyan-700 to-violet-600 text-white font-mavenPro text-lg px-6 rounded-xl w-full h-full flex items-center justify-center py-3'>
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

                <div className='col-span-4 preXl:col-span-1 gap-x-2 gap-y-3 xsm:gap-x-4 xsm:gap-y-4 text-white font-mavenPro text-lg rounded-lg w-full h-full flex preXl:flex-col justify-between'>
                    {adminTeacherArr.map((category, index) => (
                        <div key={index} className='w-full rounded-xl py-3 px-2 sm:px-5 bg-gradient-to-br from-cyan-700 to-violet-600'>
                            <div className='mb-2 bg-slate-800 rounded-full px-2 lg:px-4 py-1 md:py-2 w-fit text-[.8rem] md:text-md'>
                                Currently we have
                            </div>

                            <div className='mt-2 border-b-1 border-b-indigo-300'/>
                            
                            <div className='mt-2 sm:text-xl'>{category.count} {category.title.toLowerCase()}</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className=' mt-[4rem] xl:mt-[5rem] w-full'>
                <EditAdmin 
                    id={adminDetails.uniqId}
                    title={adminDetails.title}
                    name={adminDetails.name}
                    email={adminDetails.emailId}
                    password={adminDetails.password}
                />
            </div>

            <div className=' mt-8 pb-5'>
                <AllSubjects/>
            </div>
        </div>
    );
};

export default HomePage;

const EditAdmin = ({ id, title, name, email, password }) => {
    const [commonAttributes, setCommonAttributes] = useState({
        id: "",
        title: "",
        name: "", 
        email:"", 
        password: "",
    });
    const [isVisible, setIsVisible] = useState(false);
    const inputFields = [
        { label: 'Name', name: 'name', type: 'text', icon: <BsPersonLinesFill /> },
        { label: 'Email', name: 'email', type: 'email', icon: <MailIcon /> },
        { label: 'Password', name: 'password', type: 'password', icon: isVisible ? <BiSolidLockOpen /> : <BiSolidLock /> }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCommonAttributes({
            ...commonAttributes,
            [name]: value
        });
    };

    const handleDropDown = (name, val) => {
        setCommonAttributes({
            ...commonAttributes,
            [name]: val
        })
    };

    const handleReset = () => {
        setCommonAttributes({title, name, email, password});
    };

    useEffect(() => {
        setCommonAttributes({
            id: id || "",
            title: title || "",
            name: name || "",
            email: email || "",
            password: password || "",
        });
    }, [id, title, name, email, password]);    

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('admin')
                .update({
                    title: commonAttributes.title,
                    name: commonAttributes.name, 
                    emailId: commonAttributes.email, 
                    password: commonAttributes.password 
                })
                .eq('uniqId', commonAttributes.id)

            if (error) {
                toast.error(`Can't update`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            } else {
                toast.success(`Successfully updated`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
                setCommonAttributes({
                    id: commonAttributes.id,
                    title: commonAttributes.title,
                    name: commonAttributes.name, 
                    email: commonAttributes.email, 
                    password: commonAttributes.password
                })
            }
        } catch (error) {
            console.error(error.message);
            toast.error('Error occurred during inserting', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    const handleSubmitToast = (e) => {
        e.preventDefault();
        const isAnyFieldChanged =
            commonAttributes.title.trim() !== title ||
            commonAttributes.name.trim() !== name ||
            commonAttributes.email.trim() !== email ||
            commonAttributes.password.trim() !== password;
        
        const isMaintainingStandards = 
            commonAttributes.name.trim().length > 4 &&
            commonAttributes.email.trim().length > 6 &&
            commonAttributes.email.includes('@') &&
            commonAttributes.password.trim().length >= 6;
        
        if (isAnyFieldChanged && isMaintainingStandards) {
            toast.promise(handleSubmit(e), {
                loading: 'Updating...',
                success: 'Process initiated!',
                error: 'Failed to initiate process.',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } else {
            toast('Modify any value to update', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    }
    
    return (
        <form className=' w-full space-y-8 pb-6'>
            <div className=' w-full flex flex-col items-center gap-y-8'>
                {inputFields.map((field, index) => (
                    <div key={index} className={` w-full transition-all ${field.name === 'name' && ' grid grid-cols-4 gap-x-4 gap-y-8'}`}>
                        {field.name === 'name' && (
                            <div className=" col-span-4 sm:col-span-1">
                                <Dropdown className=' w-full'>
                                    <DropdownTrigger className=' w-full'>
                                        <Button 
                                        className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${commonAttributes.title ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                                        variant="bordered">
                                            {commonAttributes.title ? commonAttributes.title : 'Select title'}
                                        </Button>
                                    </DropdownTrigger>

                                    <DropdownMenu aria-label="Static Actions" className=' w-full bg-slate-900 text-green-500 rounded-xl '
                                    onAction={(key) => handleDropDown('title', key)}>
                                        <DropdownItem key={'Dr.'}>Dr.</DropdownItem>
                                        <DropdownItem key={'Mr.'}>Mr.</DropdownItem>
                                        <DropdownItem key={'Mrs.'}>Mrs.</DropdownItem>
                                        <DropdownItem key={'Miss'}>Miss</DropdownItem>
                                        <DropdownItem key={'Prof.'}>Prof.</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        )}

                        <div className={`${field.name === 'name' && ' col-span-4 sm:col-span-3' } relative`}>
                            <input
                                autoFocus={index === 0}
                                type={field.name === 'password' ? isVisible ? 'text' : 'password' : field.type}
                                name={field.name}
                                id={field.name}
                                className={`border-2 rounded-xl pl-4 pr-12 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${commonAttributes[field.name] ? 'border-green-500' : ''} focus:border-green-500 focus:placeholder:-translate-x-7 transition-all peer`}
                                value={commonAttributes[field.name]}
                                onChange={handleChange}
                                min={field.name === 'password' ? 6 : 3}
                                max={field.name === 'password' ? 16 : undefined}
                                required={true}
                            />

                            <label
                            htmlFor={field.name}
                            className={`text-md text-green-500 pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${commonAttributes[field.name] ? '-translate-y-[3.1rem] translate-x-[.5rem] text-sm' : ''} peer-focus:-translate-y-[3.1rem] peer-focus:translate-x-[.5rem] peer-focus:text-sm transition-all`}>
                                {field.label}
                            </label>

                            <div className={`${field.name === 'password' && 'cursor-pointer hover:scale-110 active:scale-90'} text-2xl text-default-400 absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-lg transition-all`}
                            onClick={() => field.name === 'password' && setIsVisible(!isVisible)}>
                                {field.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* buttons */}
            <div className=' w-full flex justify-between'>
                <Button className=" font-onest text-md tracking-wide"
                color='danger'
                onClick={handleReset}>
                    Reset
                </Button>

                <Button 
                type='submit'
                className="bg-[#23fda2ed] text-green-800 font-bold font-onest text-md tracking-wide"
                onClick={(e) => handleSubmitToast(e)}>
                    Update
                </Button>
            </div>
        </form>
    );
};
