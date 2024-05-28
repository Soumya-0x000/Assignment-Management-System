import { useEffect, useMemo, useState } from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { MailIcon } from "../../../landingPage/icons/MailIcon";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import { supabase } from "../../../../CreateClient";
import toast from "react-hot-toast";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Textarea } from "@nextui-org/react";
import { TbListNumbers } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { MdOutlinePortrait } from "react-icons/md";
import { useSelector } from "react-redux";

export const InsertTeacher = () => {
    const [commonAttributes, setCommonAttributes] = useState({
        title: "",
        name: "", 
        email:"", 
        password: "",
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
    const [MCAData, setMCAData] = useState({});
    const [MScData, setMScData] = useState({});
    const [saveInstance, setSaveInstance] = useState({
        MCA: false,
        MSc: false
    })

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
            title: "",
            name: "", 
            email:"", 
            password: "",
            dept: "",
            sem: "",
            subject: ""
        });
        setMCAData({});
        setMScData({});
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
                .insert({
                    title: commonAttributes.title.trim(), 
                    name: commonAttributes.name.trim(), 
                    emailId: commonAttributes.email.trim(), 
                    password: commonAttributes.password.trim(),
                    MSc: MScData || [{}],
                    MCA: MCAData || [{}]
                })

            if (error) {
                toast.error(`Can't insert`, {
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
                handleReset()
            }
        } catch (error) {
            console.error(error.message);
            toast.error('Error occurred during inserting...')
        }
    };

    const handleSubmitToast = (e) => {
        e.preventDefault();
        if (
            (Object.keys(MCAData).length > 0 || Object.keys(MScData).length > 0) 
            && (saveInstance.MCA || saveInstance.MSc)
        ) {
            if (
                commonAttributes.name.trim().length > 4 &&
                commonAttributes.email.trim().length > 6 &&
                commonAttributes.email.includes('@') &&
                commonAttributes.password.trim().length >= 6
            ) {
                toast.promise(handleSubmit(e), {
                    loading: 'Insertion process started...',
                    success: 'Successfully inserted!',
                    error: 'Failed to insert.',
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
        <form className=' w-full space-y-8 relative'>
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
    const [allSubNames, setAllSubNames] = useState([]);
    const [subjectsData, setSubjectsData] = useState([]);
    const { teacherAssignClassDetails } = useSelector(state => state.adminDashboard);

    useEffect(() => {
        const fetchSubjects = async () => {
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
                    setSubjectsData(subjectData[0]);
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
        };

        fetchSubjects();
    }, []);

    useEffect(() => {
        if (subjectsData) {
            const updatedSubNames = [];
            const deptKey = Array.from(deptSelectedKeys).join(', ');
            const deptSubjects = subjectsData[teacherAssignClassDetails.dept[deptKey]];
            
            if (deptSubjects) {
                Array.from(semSelectedKeys).forEach(semKey => {
                    const semName = teacherAssignClassDetails.sem[semKey].split(' ').join('');
                    const subjectsForSem = deptSubjects[semName]?.map(item => item.name) || [];
                    updatedSubNames.push(...subjectsForSem);
                });
            }
            
            setAllSubNames(updatedSubNames);
        }
    }, [deptSelectedKeys, semSelectedKeys, teacherAssignClassDetails, subjectsData]);

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
            items: (deptSelectedKeys.size > 0 && semSelectedKeys.size > 0) ? allSubNames : [],
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

        if (Object.keys(formattedCourses).length > 0 && dept && sem && subject) {
            if (dept === 'MCA') {
                setMCAData(formattedCourses);
                setSaveInstance(prev => ({ ...prev, MCA: true }));
                toast.success(`${dept} instance created`, {
                    style: { borderRadius: '10px', background: '#333', color: '#fff' }
                });
            } else if (dept === 'MSc') {
                setMScData(formattedCourses);
                setSaveInstance(prev => ({ ...prev, MSc: true }));
                toast.success(`${dept} instance created`, {
                    style: { borderRadius: '10px', background: '#333', color: '#fff' }
                });
            }
            setDeptSelectedKeys(new Set());
            setSemSelectedKeys(new Set());
            setSubjectSelectedKeys(new Set());
        } else {
            toast.error('Select some values', {
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
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
            const subject = mapIndexesToValues(Array.from(subjectSelectedKeys), allSubNames).join(', ');
            setCommonAttributes(prevState => ({ ...prevState, dept, sem, subject }));
        }
    }, [isResetting, deptSelectedKeys, semSelectedKeys, subjectSelectedKeys]);

    const handleCheckDeptSemValue = (dropdown) => {
        if (dropdown.stateKey === 'subject' && (deptSelectedKeys.size === 0 || semSelectedKeys.size === 0)) {
            toast.error('Select Department and Semester first', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
    };

    return (
        <div className="grid grid-cols-4 gap-x-4 gap-y-8 w-full">
            {dropdowns.map((dropdown, index) => (
                <div 
                key={index} 
                className={`w-full ${
                    dropdown.stateKey === 'dept' ? 'col-span-4 preLg:col-span-1' :
                    dropdown.stateKey === 'subject' ? 'col-span-4' :
                    dropdown.stateKey === 'sem' && 'col-span-4 preLg:col-span-3' 
                }`}>
                    <Dropdown className="w-full">
                        <DropdownTrigger className="w-full">
                            <Button 
                                endContent={dropdown.icon}
                                className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${commonAttributes[dropdown.stateKey] ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                                variant="bordered"
                                onClick={() => handleCheckDeptSemValue(dropdown)}>
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
                            selectionMode={dropdown.stateKey !== 'dept' ? "multiple" : 'single'}
                            selectedKeys={dropdown.selectedKeys}
                            onSelectionChange={dropdown.setSelectedKeys}>
                            {dropdown?.items?.map((item, itemIndex) => (
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
