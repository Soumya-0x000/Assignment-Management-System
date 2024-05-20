import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { supabase } from '../../CreateClient';
import toast from 'react-hot-toast';
import SlidingTabs from '../../common/SlidingTabs';
import { nameLogo } from '../../common/customHooks';
import { HiOutlineIdentification } from "react-icons/hi";
import { MdOutlineEmail } from "react-icons/md";
import { FiLock, FiUnlock } from "react-icons/fi";
import { MdOutlinePerson2, MdOutlinePortrait } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import { MailIcon } from "../landingPage/icons/MailIcon";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { TbListNumbers } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { useSelector } from "react-redux";

const navArr = [
    { name: 'Name', val: 'name', title: '' },
    { name: 'Email', val: 'emailId' },
    { name: 'Password', val: 'password' },
    { name: 'Id', val: 'uniqId' },
];

const TeacherHomePage = () => {
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
        MSc: []
    });
    const [selected, setSelected] = useState(navArr[0].name);
    const [pswdVisibility, setPswdVisibility] = useState(false);

    useEffect(() => {
        toast.promise(
            (async () => {
                try {
                    const { data, error } = await supabase
                        .from('teachers')
                        .select('*')
                        .eq('uniqId', teacherId)
        
                    if (error) {
                        console.error('Error querying database:', error.message);
                        alert(`No teacher found with the provided credentials.`);
                        return;
                    } else {
                        setTeacherData(data[0])
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
                error: 'An unexpected error occurred'
            }, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            }
        )
    }, []);

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
                        disabled
                        className=' w-full bg-transparent'
                    />
                </div>
                
            default:
                break;
        }
    };

    return (
        <div className=' flex flex-col items-center gap-y-8 h-screen overflow-y-auto bg-slate-700 py-3 px-5'>
            {/* navbar */}
            <div className=' w-full'>
                <div className='w-full bg-slate-900 rounded-lg flex items-center justify-between px-2 md:px-4 py-2'>
                    <SlidingTabs 
                        tabs={navArr.map((a) => a.name)} 
                        selected={selected} 
                        setSelected={setSelected} 
                    />

                    <div className='flex flex-col-reverse items-end gap-y-2 justify-center gap-x-3'>
                        <div className='h-14 w-14 bg-slate-700 text-green-300 flex items-center justify-center text-lg font-robotoMono tracking-wider rounded-full'>
                            {nameLogo(teacherData.name)}
                        </div>
                    </div>
                </div>

                <div className='bg-slate-800 rounded-lg py-2 mt-3 px-2 lg:px-5 '>
                    <div className='text-slate-300 font-mavenPro'>
                        {switchValues(selected)}
                    </div>
                </div>
            </div>

            {/* department */}
            <div className=' w-full flex flex-col md:flex-row items-center justify-between gap-x-4 gap-y-3'>
                {department.map((dept, i) => (
                    <div className=' bg-gradient-to-br from-green-500 to-indigo-600 text-white px-3 py-3 rounded-lg w-full md:w-1/2 h-full'
                    key={dept + i}>
                        <div className=' text-xl border-b-2 pb-1 font-onest'>
                            {dept}
                        </div>

                        {Object.entries(teacherData?.[dept]).length !== 0 ? (
                            <div className=' grid grid-cols-2  gap-x-4 gap-y-2 mt-3'>
                                {teacherData?.[dept].map((val, index) => (
                                    <React.Fragment key={index}>
                                        {Object.entries(val).map(([key, val], indx) => (
                                            <div className=' bg-slate-800 rounded-lg px-3 py-2' key={indx}>
                                                {val !== '' && (
                                                    <div>
                                                        <span className=' font-bold font-robotoMono tracking-wider text-gray-300'>{key}: </span> 
                                                        <span className=' font-bold font-onest tracking-wider text-gray-300'>{val}</span>
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

            <EditTeacher
                title={teacherData.title}
                name={teacherData.name}
                email={teacherData.emailId}
                password={teacherData.password}
                id={teacherData.uniqId}
                mcaSub={teacherData.MCA}
                mscSub={teacherData.MSc}
            />
        </div>
    )
}

export default TeacherHomePage;


const EditTeacher = ({
    title,
    name,
    email,
    password,
    mcaSub,
    mscSub,
}) => {
    const { teacherId } = useParams();
    const [commonAttributes, setCommonAttributes] = useState({
        title: title || "",
        name: name || "", 
        email: email || "", 
        password: password || "",
        dept: "",
        sem: "",
        subject: ""
    });
    const [isVisible, setIsVisible] = useState(false);
    const inputFields = [
        { label: 'Name', name: 'name', type: 'text', icon: <BsPersonLinesFill /> },
        { label: 'Email', name: 'email', type: 'email', icon: <MailIcon /> },
        { label: 'Password', name: 'password', type: 'password', icon: isVisible ? <BiSolidLockOpen /> : <BiSolidLock /> }
    ];
    const [isResetting, setIsResetting] = useState(false);
    const [MCAData, setMCAData] = useState(mcaSub || [{}]);
    const [MScData, setMScData] = useState(mscSub || [{}]);
    const [saveInstance, setSaveInstance] = useState({
        MCA: false,
        MSc: false
    });

    useEffect(() => {
        setCommonAttributes({
            ...commonAttributes,    
            title, name, email, password
        })
        setMCAData(mcaSub)
        setMScData(mscSub)
    }, [title, name, email, password])

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
        setIsResetting(true);
        setCommonAttributes({
            title,
            name, 
            email, 
            password,
            dept: "",
            sem: "",
            subject: ""
        });
        setMCAData(mcaSub);
        setMScData(mscSub);
        setSaveInstance({
            MCA: false,
            MSc: false
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase
                .from('teachers')
                .update({
                    title: commonAttributes.title.trim(), 
                    name: commonAttributes.name.trim(), 
                    emailId: commonAttributes.email.trim(), 
                    password: commonAttributes.password.trim(),
                    MSc: MScData || [{}],
                    MCA: MCAData || [{}]
                })
                .eq('uniqId', teacherId)

            if (error) {
                toast.error(`Can't update`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
            } else {
                toast.success(`Successfully inserted ${commonAttributes.name} as Teacher`, {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
                window.location.reload()
                handleReset()
            }
        } catch (error) {
            console.error(error.message);
            toast.error('Error occurred during updating...')
        }
    };

    const handleSubmitToast = (e) => {
        e.preventDefault();
        const checkCondition = commonAttributes.name.trim().length > 4 &&
        commonAttributes.email.trim().length > 6 &&
        commonAttributes.email.includes('@') &&
        commonAttributes.password.trim().length >= 6;
        
        if ((Object.keys(MCAData).length > 0 || Object.keys(MScData).length > 0)) {
            if (checkCondition) {
                toast.promise(handleSubmit(e), {
                    loading: 'Updating process started...',
                    success: 'Successfully updated!',
                    error: 'Failed to update.',
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                })
            } else toast('Fill up all required fields...', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        } else toast(() => (
            <span>
                Click
                <span className="text-cyan-400 mx-2 font-bold font-onest">
                    Save Instance
                </span>
                to proceed
            </span>
        ), {
            icon: '⚠️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            }
        })
    };

    return (
        <form className='mt-12 w-full max-w-[80rem] space-y-8 relative flex flex-col justify-center'>
            <div className=' w-full flex flex-col items-center gap-y-8'>
                {inputFields.map((field, index) => (
                    <div className=" w-full flex gap-x-4"
                    key={index}>
                        {field.name === 'name' && (
                            <div className=" w-[40%] min-w-[8rem] max-w-[13rem]">
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

                        <div className='relative w-full transition-all'>
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

                <Dropdowns 
                    commonAttributes={commonAttributes}
                    isResetting={isResetting}
                    setIsResetting={setIsResetting}
                    setCommonAttributes={setCommonAttributes}
                    setSaveInstance={setSaveInstance}
                    setMCAData={setMCAData}
                    setMScData={setMScData}
                    handleReset={handleReset}
                />
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
                    Submit
                </Button>
            </div>
        </form>
    );
};



const Dropdowns = ({
    commonAttributes,
    setCommonAttributes, 
    isResetting,
    setSaveInstance,
    setIsResetting,
    setMCAData,
    setMScData,
}) => {
    const [deptSelectedKeys, setDeptSelectedKeys] = useState(new Set());
    const [semSelectedKeys, setSemSelectedKeys] = useState(new Set());
    const [subjectSelectedKeys, setSubjectSelectedKeys] = useState(new Set());
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);

    const deptSelectedValue = useMemo(
        () => Array.from(deptSelectedKeys).join(", ").replaceAll("_", " "),
        [deptSelectedKeys]
    );

    const semSelectedValue = useMemo(
        () => Array.from(semSelectedKeys).join(", ").replaceAll("_", " "),
        [semSelectedKeys]
    );

    const subjectSelectedValue = useMemo(
        () => Array.from(subjectSelectedKeys).join(", ").replaceAll("_", " "),
        [subjectSelectedKeys]
    );

    const dropdowns = [
        {
            label: 'Department',
            stateKey: 'dept',
            icon: <SiGoogleclassroom className="text-[1.25rem] text-default-400 pointer-events-none flex-shrink-0" />,
            items: teacherAssignClassDetails.dept,
            selectedKeys: deptSelectedKeys,
            setSelectedKeys: setDeptSelectedKeys,
            selectedValue: deptSelectedValue
        },
        {
            label: 'Semester',
            stateKey: 'sem',
            icon: <TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />,
            items: teacherAssignClassDetails.sem,
            selectedKeys: semSelectedKeys,
            setSelectedKeys: setSemSelectedKeys,
            selectedValue: semSelectedValue
        },
        {
            label: 'Subject',
            stateKey: 'subject',
            icon: <MdOutlinePortrait className="text-[1.25rem] text-default-400 pointer-events-none flex-shrink-0" />,
            items: teacherAssignClassDetails.subject,
            selectedKeys: subjectSelectedKeys,
            setSelectedKeys: setSubjectSelectedKeys,
            selectedValue: subjectSelectedValue
        },
    ];

    const mapIndexesToValues = (indexes, items) => {
        return indexes.map(index => items[index]);
    };

    const saveInstance = (dept, sem, subject, e) => {
        e.preventDefault();
        const formattedCourses = formatCourses(sem, subject);

        if (dept === 'MCA') {
            setMCAData(formattedCourses);
            setSaveInstance(prev => ({
                ...prev, MCA: true
            }));
            toast.success(`${dept} instance created`, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            setDeptSelectedKeys(new Set());
            setSemSelectedKeys(new Set());
            setSubjectSelectedKeys(new Set());
        } else if (dept === 'MSc') {
            setMScData(formattedCourses);
            setSaveInstance(prev => ({
                ...prev, MSc: true
            }));
            toast.success(`${dept} instance created`, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            setDeptSelectedKeys(new Set());
            setSemSelectedKeys(new Set());
            setSubjectSelectedKeys(new Set());
        } else {
            setMScData(formattedCourses);
            setSaveInstance(prev => ({ ...prev }));
            toast.success(`${dept} instance created`, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
            setDeptSelectedKeys(new Set());
            setSemSelectedKeys(new Set());
        }
    };

    useEffect(() => {
        if (isResetting) {
            setDeptSelectedKeys(new Set());
            setSemSelectedKeys(new Set());
            setSubjectSelectedKeys(new Set());
            setIsResetting(false);
        } else {
            const dept = mapIndexesToValues(Array.from(deptSelectedKeys), teacherAssignClassDetails.dept).join(', ');
            const sem = mapIndexesToValues(Array.from(semSelectedKeys), teacherAssignClassDetails.sem).join(', ');
            const subject = mapIndexesToValues(Array.from(subjectSelectedKeys), teacherAssignClassDetails.subject).join(', ');
            setCommonAttributes(prevState => ({
                ...prevState, dept, sem, subject
            }));
        }
    }, [isResetting, deptSelectedKeys, semSelectedKeys, subjectSelectedKeys]);

    return (
        <div className="grid grid-cols-4 gap-x-4 gap-y-8 w-full">
            {dropdowns.map((dropdown, index) => (
                <div 
                key={index} 
                className={`w-full ${
                dropdown.stateKey === 'dept' ? 'col-span-4 preLg:col-span-1' :
                dropdown.stateKey === 'subject' ? 'col-span-4' :
                dropdown.stateKey === 'sem' && 'col-span-4 preLg:col-span-3' }`}>
                    <Dropdown className={` w-full`}>
                        <DropdownTrigger className="w-full">
                            <Button 
                            endContent={dropdown.icon}
                            className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${commonAttributes[dropdown.stateKey] ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                            variant="bordered">
                                {dropdown.selectedKeys.size > 0
                                    ? Array.from(dropdown.selectedKeys).map((key) => dropdown.items[key]).join(', ')
                                    : dropdown.label}
                            </Button>
                        </DropdownTrigger>

                        <DropdownMenu 
                        aria-label={`Multiple selection example`}
                        closeOnSelect={false}
                        disallowEmptySelection
                        className="w-full bg-slate-900 text-green-500 rounded-xl" 
                        selectionMode= {dropdown.stateKey !== 'dept' ? "multiple" : 'single'}
                        selectedKeys={dropdown.selectedKeys}
                        onSelectionChange={dropdown.setSelectedKeys}>
                            {dropdown.items.map((item, itemIndex) => (
                                <DropdownItem key={itemIndex}>{item}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            ))}

            <div className="col-span-4">
                <button className="bg-[#fdd833] text-yellow-800 font-onest font-bold rounded-xl px-4 py-2 absolute right-[6.5rem] bottom-0"
                onClick={(e) => saveInstance(commonAttributes.dept, commonAttributes.sem, commonAttributes.subject, e)}>
                    Save Instance
                </button>
            </div>
        </div>
    );
};

const formatCourses = (sem, subject) => {
    return sem.split(', ').map((semester, index) => ({ [`${semester}`]: subject.split(', ')[index] }));
};
