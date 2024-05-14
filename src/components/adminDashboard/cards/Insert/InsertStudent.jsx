import React, { useEffect, useState } from 'react';
import { 
    Button, 
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem, 
} from "@nextui-org/react";
import { MdAdminPanelSettings } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import { BiCalendar, BiSolidLock, BiSolidLockOpen  } from "react-icons/bi";
import { TbListNumbers } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import toast from 'react-hot-toast';
import { formatSemester } from '../../../../common/customHooks';
import { supabase } from '../../../../CreateClient';
import { MailIcon } from '../../../landingPage/icons/MailIcon';

export const InsertStudent = () => {
    const [studentRegisterData, setStudentRegisterData] = useState({
        name: "", 
        email:"", 
        password: "",
        usnId: "",
        dateOfBirth: "",
        semester: "",
        dept: "",
    });
    const [tableName, setTableName] = useState('studentsSem');
    const [isVisible, setIsVisible] = useState(false);
    const inputFields = [
        { label: 'Name', name: 'name', type: 'text', icon: <BsPersonLinesFill /> },
        { label: 'Email', name: 'email', type: 'email', icon: <MailIcon /> },
        { label: 'Password', name: 'password', type: 'password', icon: isVisible ? <BiSolidLockOpen /> : <BiSolidLock /> },
        { label: 'USN ID', name: 'usnId', type: 'text', icon: <MdAdminPanelSettings /> },
        { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', icon: <BiCalendar /> }
    ];
        
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentRegisterData({
            ...studentRegisterData,
            [name]: value
        });
    };

    const handleDropDown = (name, val) => {
        setStudentRegisterData({
            ...studentRegisterData,
            [name]: val
        })
    };

    const handleRegister = async (e) => {
        e.preventDefault();
    
        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('emailId', studentRegisterData.email)
                .eq('usnId', studentRegisterData.usnId);
    
            if (error) {
                console.error('Error fetching data:', error.message);
                return;
            } else if (data.length > 0) {
                toast.error('User already exists...');
                return;
            }
    
            const { data: studentData, error: studentError } = await supabase
                .from(tableName)
                .insert([{
                    name: studentRegisterData.name.trim(),
                    emailId: studentRegisterData.email.trim(),
                    password: studentRegisterData.password.trim(),
                    birthDate: studentRegisterData.dateOfBirth.trim(),
                    semester: studentRegisterData.semester.trim(),
                    usnId: studentRegisterData.usnId.trim(),
                    department: studentRegisterData.dept.trim()
                }]);

            if (studentError) {
                toast.error('Error inserting data...')
                console.error('Error inserting data into student table:', error.message);
            } else {
                toast.success('Successfully inserted...')
                handleReset()
            }
            
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            toast.error('Error occurred...');
        }
    };
    
    useEffect(() => {
        setTableName(prevTableName => 'studentsSem' + studentRegisterData.semester);
    }, [studentRegisterData.semester]);

    const handleReset = () => {
        setStudentRegisterData({
            name: "", 
            email:"", 
            password: "",
            usnId: "",
            dateOfBirth: "",
            semester: "",
            dept: "",
        })
    };

    const handleRegisterToast = (e) => {
        e.preventDefault();
        if(
            studentRegisterData.name.trim().length > 4 &&
            studentRegisterData.email.trim().length > 6 &&
            studentRegisterData.email.includes('@') &&
            studentRegisterData.password.trim().length >= 6 &&
            studentRegisterData.birthdate !== '' &&
            studentRegisterData.semester !== '' &&
            studentRegisterData.usnId.trim().length > 6 &&
            studentRegisterData.department !== ''
        ) {
            toast.promise(handleRegister(e), {
                loading: 'Registering...',
                success: 'Successfully Registered',
                error: 'Failed to Register',
            })
        } else toast('Fill up all required fields...', {
            icon: '⚠️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        })
    };

    return ( 
        <form className=' w-full space-y-8'>
            {inputFields.map((field, index) => (
                <div key={index} className='relative w-full transition-all'>
                    <input
                        autoFocus={field.name === 'name'}
                        type={field.name === 'password' ? isVisible ? 'text' : 'password' : field.type}
                        name={field.name}
                        id={field.name}
                        className={`border-2 rounded-xl pl-4 pr-12 focus:border-b-2 focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 focus:border-green-500 focus:placeholder:-translate-x-7 transition-all ${studentRegisterData[field.name] ? 'border-green-500' : ''} peer`}
                        value={studentRegisterData[field.name]}
                        onChange={handleChange}
                        min={field.name === 'password' ? 6 : 3}
                        max={field.name === 'password' ? 16 : undefined}
                        required={true}
                    />

                    <label
                    htmlFor={field.name}
                    className={`text-md text-green-500 pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${studentRegisterData[field.name] ? '-translate-y-[3.1rem] translate-x-[.5rem] text-sm' : ''} peer-focus:-translate-y-[3.1rem] peer-focus:translate-x-[.5rem] peer-focus:text-sm transition-all`}>
                        {field.name !== 'dateOfBirth' && field.label}
                    </label>

                    <div
                    className={`${field.name === 'password' && 'cursor-pointer hover:scale-110 active:scale-90'} text-2xl text-default-400 absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-lg transition-all`}
                    onClick={() => field.name === 'password' && setIsVisible(!isVisible)}>
                        {field.icon}
                    </div>
                </div>
            ))}

            <div className=' flex gap-x-3 gap-y-8 flex-col md:flex-row'>
                {/* department */}
                <Dropdown className=' w-full'>
                    <DropdownTrigger className=' w-full'>
                        <Button 
                        endContent={<SiGoogleclassroom className="text-[1.25rem] text-default-400 pointer-events-none flex-shrink-0" />}
                        className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${studentRegisterData.dept ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                        variant="bordered">
                            {studentRegisterData.dept ? studentRegisterData.dept : 'Select Department'}
                        </Button>
                    </DropdownTrigger>

                    <DropdownMenu aria-label="Static Actions" className=' w-full bg-slate-900 text-green-500 rounded-xl '
                    onAction={(key) => handleDropDown('dept', key)}>
                        <DropdownItem key={'MCA'}>MCA</DropdownItem>
                        <DropdownItem key={'MSc'}>MSc</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                {/* semester */}
                <Dropdown className=' w-full'>
                    <DropdownTrigger className=' w-full'>
                        <Button 
                        endContent={<TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${studentRegisterData.dept ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                        variant="bordered">
                            {studentRegisterData.semester ? formatSemester(studentRegisterData.semester) : 'Select semester'}
                        </Button>
                    </DropdownTrigger>

                    <DropdownMenu aria-label="Static Actions" className=' w-full bg-slate-900 text-green-500 rounded-xl '
                    onAction={(key) => handleDropDown('semester', key)}>
                        <DropdownItem key={'1'}>1st semester</DropdownItem>
                        <DropdownItem key={'2'}>2nd semester</DropdownItem>
                        <DropdownItem key={'3'}>3rd semester</DropdownItem>
                        <DropdownItem key={'4'}>4th semester</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>

            <div className=' flex items-center justify-between'>
                <Button className=" font-onest text-md tracking-wide"
                color='danger'
                onClick={handleReset}>
                    Reset
                </Button>

                <Button 
                type='submit'
                className="bg-[#23fda2ed] text-green-800 font-bold font-onest text-md tracking-wide"
                onClick={(e) => handleRegisterToast(e)}>
                    Register
                </Button>
            </div>
        </form>
    )
};
