import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../../CreateClient";
import toast from "react-hot-toast";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Textarea } from "@nextui-org/react";
import { TbListNumbers } from "react-icons/tb";
import { SiGoogleclassroom } from "react-icons/si";
import { useSelector } from "react-redux";

const ClassManagement = ({
    commonAttributes, 
    setCommonAttributes, 
    isResetting,
    setIsResetting,
    setSaveInstance,
    setMCAData,
    setMScData,
    MScData,
    MCAData,
}) => {
    const [deptSelectedKeys, setDeptSelectedKeys] = useState(new Set());
    const [sem1SelectedKeys, setSem1SelectedKeys] = useState(new Set());
    const [sem2SelectedKeys, setSem2SelectedKeys] = useState(new Set());
    const [sem3SelectedKeys, setSem3SelectedKeys] = useState(new Set());
    const [sem4SelectedKeys, setSem4SelectedKeys] = useState(new Set());
    const [individualSemSubjects, setIndividualSemSubjects] = useState({ 
        sem1: [], 
        sem2: [], 
        sem3: [], 
        sem4: [] 
    });
    const { teacherAssignClassDetails, deptSemSubjects } = useSelector(state => state.adminDashboard);
    const [subjectsData, setSubjectsData] = useState(deptSemSubjects);

    useMemo(() => {
        setSubjectsData(deptSemSubjects)
    }, [deptSemSubjects])

    // useEffect(() => {
    //     if (MCAData?.length > 0) {
    //         console.log(MCAData?.length, MScData)
    //         const separatedVal = MCAData.map(val => Object.entries(val).map(([key, innerVal]) => innerVal))
    //         console.log(separatedVal)

    //         console.log(teacherAssignClassDetails.sem.find(val => 'MCA'))
    //     } else if (MScData?.length > 0) {
    //         console.log(MScData?.length, MScData)
    //         const separatedVal = MScData.map(val => Object.entries(val).map(([key, innerVal]) => innerVal))
    //         console.log(separatedVal)
    //     }
    // }, []);

    useEffect(() => {
        if (subjectsData) {
            const updatedSubjects = { sem1: [], sem2: [], sem3: [], sem4: [] };
            const deptKey = Array.from(deptSelectedKeys).join(', ');
            const deptSubjects = subjectsData[teacherAssignClassDetails.dept[deptKey]];

            if (deptSubjects) {
                updatedSubjects.sem1 = deptSubjects['1stSem']?.map(item => item.name) || [];
                updatedSubjects.sem2 = deptSubjects['2ndSem']?.map(item => item.name) || [];
                updatedSubjects.sem3 = deptSubjects['3rdSem']?.map(item => item.name) || [];
                updatedSubjects.sem4 = deptSubjects['4thSem']?.map(item => item.name) || [];
            }
            
            setIndividualSemSubjects(updatedSubjects);
        }
    }, [deptSelectedKeys, subjectsData]);

    const dropdowns = [
        {
            label: 'Department',
            stateKey: 'dept',
            icon: <SiGoogleclassroom className="text-[1.25rem] text-default-400 pointer-events-none flex-shrink-0" />,
            items: teacherAssignClassDetails.dept,
            selectedKeys: deptSelectedKeys,
            setSelectedKeys: setDeptSelectedKeys,
        },
        {
            label: '1st Semester',
            stateKey: 'sem1',
            icon: <TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />,
            items: individualSemSubjects.sem1,
            selectedKeys: sem1SelectedKeys,
            setSelectedKeys: setSem1SelectedKeys,
        },
        {
            label: '2nd Semester',
            stateKey: 'sem2',
            icon: <TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />,
            items: individualSemSubjects.sem2,
            selectedKeys: sem2SelectedKeys,
            setSelectedKeys: setSem2SelectedKeys,
        },
        {
            label: '3rd Semester',
            stateKey: 'sem3',
            icon: <TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />,
            items: individualSemSubjects.sem3,
            selectedKeys: sem3SelectedKeys,
            setSelectedKeys: setSem3SelectedKeys,
        },
        {
            label: '4th Semester',
            stateKey: 'sem4',
            icon: <TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />,
            items: individualSemSubjects.sem4,
            selectedKeys: sem4SelectedKeys,
            setSelectedKeys: setSem4SelectedKeys,
        },
    ];

    const saveInstance = (dept, semSubjects, e) => {
        e.preventDefault();
        const formattedCourses = [
            {'1stSem': Array.from(semSubjects.sem1).map(key => individualSemSubjects['sem1'][key]).join(', ')},
            {'2ndSem': Array.from(semSubjects.sem2).map(key => individualSemSubjects['sem2'][key]).join(', ')},
            {'3rdSem': Array.from(semSubjects.sem3).map(key => individualSemSubjects['sem3'][key]).join(', ')},
            {'4thSem': Array.from(semSubjects.sem4).map(key => individualSemSubjects['sem4'][key]).join(', ')},
        ];

        if (dept && Object.values(formattedCourses).some(subject => subject !== '')) {
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
            setSem1SelectedKeys(new Set());
            setSem2SelectedKeys(new Set());
            setSem3SelectedKeys(new Set());
            setSem4SelectedKeys(new Set());
        } else {
            toast.error('Select some values', {
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
        }
    };

    useEffect(() => {
        if (isResetting) {
            setDeptSelectedKeys(new Set());
            setSem1SelectedKeys(new Set());
            setSem2SelectedKeys(new Set());
            setSem3SelectedKeys(new Set());
            setSem4SelectedKeys(new Set());
            setIsResetting(false);
        } else {
            const dept = Array.from(deptSelectedKeys).map(key => teacherAssignClassDetails.dept[key]).join(', ');
            
            const semesters = teacherAssignClassDetails.sem
                .map(key => key.split(' ').join(''))
                .filter((_, index) => {
                    return [sem1SelectedKeys, sem2SelectedKeys, sem3SelectedKeys, sem4SelectedKeys][index].size > 0;
                });
            
            const subjects = [
                Array.from(sem1SelectedKeys).map(key => individualSemSubjects['sem1'][key]).join(', '),
                Array.from(sem2SelectedKeys).map(key => individualSemSubjects['sem2'][key]).join(', '),
                Array.from(sem3SelectedKeys).map(key => individualSemSubjects['sem3'][key]).join(', '),
                Array.from(sem4SelectedKeys).map(key => individualSemSubjects['sem4'][key]).join(', '),
            ].filter(Boolean);

            setCommonAttributes(prevState => ({ ...prevState, dept, semesters, subjects }));
        }
    }, [isResetting, deptSelectedKeys, sem1SelectedKeys, sem2SelectedKeys, sem3SelectedKeys, sem4SelectedKeys, individualSemSubjects]);

    const handleCheckDeptValue = (dropdown) => {
        if (dropdown.stateKey !== 'dept' && deptSelectedKeys.size === 0) {
            toast('Select Department first', {
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
                <div key={index} className={`w-full ${dropdown.stateKey === 'dept' && 'col-span-4 preLg:col-span-1'} ${dropdown.stateKey === 'sem1' && 'col-span-4 preLg:col-span-3'} col-span-4`}>
                    <Dropdown className="w-full col-span-4">
                        <DropdownTrigger className="w-full">
                            <Button 
                                endContent={dropdown.icon}
                                className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${commonAttributes[dropdown.stateKey] ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                                variant="bordered"
                                onClick={() => handleCheckDeptValue(dropdown)}>
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
                        selectionMode= {dropdown.stateKey === 'dept' ? "single" : "multiple"}
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
                onClick={(e) => saveInstance(commonAttributes.dept, {
                    sem1: sem1SelectedKeys,
                    sem2: sem2SelectedKeys,
                    sem3: sem3SelectedKeys,
                    sem4: sem4SelectedKeys
                }, e)}>
                    Save Instance
                </button>
            </div>
        </div>
    );
};

export default ClassManagement;
