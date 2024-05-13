import { useEffect, useMemo, useState } from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { MailIcon } from "../../landingPage/icons/MailIcon";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";
import { supabase } from "../../../CreateClient";
import toast from "react-hot-toast";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
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
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(commonAttributes)
        try {
            const { data, error } = await supabase
                .from('teachers')
                // .insert({
                //     title: commonAttributes.title, 
                //     name: commonAttributes.name, 
                //     emailId: commonAttributes.email, 
                //     password: commonAttributes.password 
                // })

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
    };

    return (
        <form className=' w-full space-y-8'>
            <div className=' w-full flex flex-col items-center gap-y-8'>
                {inputFields.map((field, index) => (
                    <div className=" w-full flex gap-x-2"
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
    setIsResetting
}) => {
    const [deptSelectedKeys, setDeptSelectedKeys] = useState(new Set());
    const [semSelectedKeys, setSemSelectedKeys] = useState(new Set());
    const [subjectSelectedKeys, setSubjectSelectedKeys] = useState(new Set());
    const {teacherAssignClassDetails} = useSelector(state => state.adminDashboard);

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

    useEffect(() => {
        if (isResetting) {
            setDeptSelectedKeys(new Set());
            setSemSelectedKeys(new Set());
            setSubjectSelectedKeys(new Set());
            setIsResetting(false);
        } else {
            setCommonAttributes(prevState => ({
                ...prevState,
                dept: teacherAssignClassDetails.dept[Array.from(deptSelectedKeys).join(", ").replaceAll("_", " ")],
                sem: teacherAssignClassDetails.sem[Array.from(semSelectedKeys).join(", ").replaceAll("_", " ")],
                subject: teacherAssignClassDetails.subject[Array.from(subjectSelectedKeys).join(", ").replaceAll("_", " ")]
            }));
        }
    }, [isResetting, deptSelectedKeys, semSelectedKeys, subjectSelectedKeys])
    
    return (
        <div className="grid grid-cols-4 gap-x-4 gap-y-8 w-full">
            {dropdowns.map((dropdown, index) => (
                <div key={index} className={`w-full ${dropdown.stateKey === 'subject' ? 'col-span-4' : 'col-span-2'}`}>
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
                        aria-label={`Multiple selection example for ${dropdown.label}`}
                        closeOnSelect={false}
                        disallowEmptySelection
                        className="w-full bg-slate-900 text-green-500 rounded-xl" 
                        selectionMode="multiple"
                        selectedKeys={dropdown.selectedKeys}
                        onSelectionChange={dropdown.setSelectedKeys}>
                            {dropdown.items.map((item, itemIndex) => (
                                <DropdownItem key={itemIndex}>{item}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
            ))}
        </div>
    );
};
