import React, { useEffect, useMemo, useState } from 'react'
import { BsPersonLinesFill } from 'react-icons/bs';
import { MailIcon } from '../landingPage/icons/MailIcon';
import { BiCalendar, BiSolidLock, BiSolidLockOpen } from 'react-icons/bi';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { formatSemester } from '../../common/customHooks';
import { SiGoogleclassroom } from 'react-icons/si';
import { TbListNumbers } from 'react-icons/tb';
import toast from 'react-hot-toast';
import { supabase } from '../../CreateClient';

const UpdateData = ({ studentData, setStudentData, usnId }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [updatedStudentData, setUpdatedStudentData] = useState({
        name: studentData.name || '',
        emailId: studentData.emailId || '',
        password: studentData.password || '',
        usnId: studentData.usnId || '',
        birthDate: studentData.birthDate || '',
        semester: studentData.semester || '',
        department: studentData.department || '',
    });
    const [tableName, setTableName] = useState(localStorage.getItem('studentTableName'))
    const [currentTableName, setCurrentTableName] = useState('studentsSem');
    
    useEffect(() => {
        setTableName(localStorage.getItem('studentTableName'))
    }, [currentTableName]);

    useEffect(() => {
        setUpdatedStudentData(studentData);
    }, [studentData]);

    const inputFields = [
        { label: 'Email', name: 'emailId', type: 'email', icon: <MailIcon /> },
        { label: 'Password', name: 'password', type: 'password', icon: isVisible ? <BiSolidLockOpen /> : <BiSolidLock /> },
        { label: 'Date of Birth', name: 'birthDate', type: 'date', icon: <BiCalendar /> }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedStudentData({
            ...updatedStudentData,
            [name]: value
        });
    };

    const handleDropDown = (name, val) => {
        setUpdatedStudentData({
            ...updatedStudentData,
            [name]: val
        })
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        try {
            console.log(typeof(+updatedStudentData.semester))
            console.log(typeof(+studentData.semester))
            console.log(currentTableName)
            if (+updatedStudentData.semester === +studentData.semester) {
                const { data: responseData, error: responseError } = await supabase
                    .from(tableName)
                    .update({
                        emailId: updatedStudentData.emailId.trim(),
                        password: updatedStudentData.password.trim(),
                        birthDate: updatedStudentData.birthDate.trim(),
                        semester: updatedStudentData.semester,
                    })
                    .eq('usnId', usnId)

                if (responseError) {
                    toast.error('Error updating data...', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    })
                    console.error('Error updating data into student table:', error.message);
                } else {
                    toast.success('Successfully updated', {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        }
                    });
                    setStudentData(updatedStudentData);
                    handleReset()
                }
            } else {
                console.log(updatedStudentData)
                const { data: responseData, error: responseError } = await supabase
                    .from(currentTableName)
                    .insert({
                        name: updatedStudentData.name.trim(),
                        emailId: updatedStudentData.emailId.trim(),
                        password: updatedStudentData.password.trim(),
                        birthDate: updatedStudentData.birthDate.trim(),
                        semester: updatedStudentData.semester,
                        department: updatedStudentData.department.trim(),
                        usnId: updatedStudentData.usnId.trim(),
                        rollNo: updatedStudentData.rollNo
                    })
                    console.log(responseData)
                    console.log(responseError)
                if (responseError === null && responseData === null) {
                    const { error: delError } = await supabase
                        .from(tableName)
                        .delete()
                        .eq('usnId', usnId)

                    if (delError) {
                        toast.error('Error deleting data...', {
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        })
                        console.error('Error deleting data into student table:', error.message);
                    } else {
                        toast.success(`${updatedStudentData.semester > studentData.semester 
                            ? 'Promoted' : 'Demoted'
                        }`,{style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                            }
                        });
                        setStudentData(updatedStudentData);
                        localStorage.setItem('studentTableName', currentTableName);
                    }
                }
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
            toast.error('Error occurred', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            });
        }
    };

    const handleUpdateToast = (e) => {
        e.preventDefault();
        
        const checkCondition = 
            updatedStudentData.name.trim().length > 4 &&
            updatedStudentData.emailId.trim().length > 6 &&
            updatedStudentData.emailId.includes('@') &&
            updatedStudentData.password.trim().length >= 6 &&
            updatedStudentData.birthDate !== '' &&
            updatedStudentData.semester !== '' 

        const hasChanged = Object.keys(updatedStudentData).some(key => updatedStudentData[key] !== studentData[key])

        if(!checkCondition) {
            toast('Fill up all required fields...', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        } else if (!hasChanged) {
            toast('No changes detected', {
                icon: '⚠️',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        } else {
            toast.promise(handleUpdate(e), {
                loading: 'updating...',
                success: 'Successfully updated',
                error: 'Failed to update',
            }, {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        }
    };

    const handleReset = () => {
        setUpdatedStudentData({
            name: studentData.name,
            emailId: studentData.emailId,
            password: studentData.password,
            birthDate: studentData.birthDate,
            semester: studentData.semester,
            department: studentData.department,
        })
    };

    useEffect(() => {
        setCurrentTableName(prevTableName => 'studentsSem' + updatedStudentData.semester);
    }, [updatedStudentData.semester]);

    return (
        <form className=' w-full space-y-8'>
            {inputFields.map((field, index) => (
                <div key={index} className='relative w-full transition-all'>
                    <input
                        autoFocus={field.name === 'emailId'}
                        type={field.name === 'password' ? isVisible ? 'text' : 'password' : field.type}
                        name={field.name}
                        id={field.name}
                        className={`border-2 rounded-xl pl-4 pr-12 focus:border-b-2 focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 focus:border-green-500 focus:placeholder:-translate-x-7 transition-all ${updatedStudentData[field.name] ? 'border-green-500' : ''} peer`}
                        value={updatedStudentData[field.name]}
                        onChange={handleChange}
                        min={field.name === 'password' ? 6 : 3}
                        max={field.name === 'password' ? 16 : undefined}
                        required={true}
                    />

                    <label
                    htmlFor={field.name}
                    className={`text-md text-green-500 pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${updatedStudentData[field.name] ? '-translate-y-[3.1rem] translate-x-[.5rem] text-sm' : ''} peer-focus:-translate-y-[3.1rem] peer-focus:translate-x-[.5rem] peer-focus:text-sm transition-all`}>
                        {field.name !== 'dateOfBirth' && field.label}
                    </label>

                    <div
                    className={`${field.name === 'password' && 'cursor-pointer hover:scale-110 active:scale-90'} text-2xl text-default-400 absolute right-3 top-1/2 -translate-y-1/2 bg-slate-800 p-1 rounded-lg transition-all`}
                    onClick={() => field.name === 'password' && setIsVisible(!isVisible)}>
                        {field.icon}
                    </div>
                </div>
            ))}

            <div className=' flex gap-x-3 gap-y-8 flex-col sm:flex-row'>
                {/* department */}
                <Dropdown className=' w-full'>
                    <DropdownTrigger className=' w-full'>
                        <Button 
                        endContent={<SiGoogleclassroom className="text-[1.25rem] text-default-400 pointer-events-none flex-shrink-0" />}
                        className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${studentData.department ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                        variant="bordered">
                            {updatedStudentData.department ? updatedStudentData.department : 'Select Department'}
                        </Button>
                    </DropdownTrigger>

                    <DropdownMenu aria-label="Static Actions" className=' w-full bg-slate-900 text-green-500 rounded-xl '
                    onAction={(key) => handleDropDown('department', key)}>
                        <DropdownItem key={updatedStudentData.department}>{updatedStudentData.department}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                {/* semester */}
                <Dropdown className=' w-full'>
                    <DropdownTrigger className=' w-full'>
                        <Button 
                        endContent={<TbListNumbers className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
                        className={`border-2 rounded-xl px-4 focus:border-b-2 transition-colors focus:outline-none bg-slate-950 w-full h-[3.8rem] font-onest text-green-500 ${studentData.department ? 'border-green-500' : ''} focus:border-green-500 flex items-center justify-between text-md`}
                        variant="bordered">
                            {updatedStudentData.semester ? formatSemester(`${updatedStudentData.semester}`) : 'Select semester'}
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
                onClick={(e) => handleUpdateToast(e)}>
                    Update
                </Button>
            </div>
        </form>
    )
}

export default UpdateData;
