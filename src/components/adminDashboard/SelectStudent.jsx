import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Radio, RadioGroup } from '@nextui-org/react'
import React, { useState } from 'react'
import { PiStudentBold } from 'react-icons/pi'

const SelectStudent = ({sidebarHold}) => {
    const [studentData, setStudentData]= useState({
        dept: 'MCA',
        sem: 'all'
    });

    const handleDropDown = (name, val) => {
        setStudentData({
            ...studentData,
            [name]: val
        })
    };

    return (
        <Dropdown className=''>
            <DropdownTrigger>
                <button className=' rounded-lg text-xl bg-[#8446ffe8] w-full h-10 text-white flex items-center justify-center gap-x-3 border-none outline-none'>
                    <PiStudentBold className=' text-2xl'/>
                    <span className={`${sidebarHold ? 'block' : 'hidden group-hover:block'}`}>Students</span>
                </button>
            </DropdownTrigger>

            <div className=' flex'>
                <DropdownMenu aria-label="Static Actions"
                value={studentData.sem}
                onAction={(key) => handleDropDown('semester', key)}>
                    <DropdownItem key={'all'}>All semesters</DropdownItem>
                    <DropdownItem key={'1'}>1st semester</DropdownItem>
                    <DropdownItem key={'2'}>2nd semester</DropdownItem>
                    <DropdownItem key={'3'}>3rd semester</DropdownItem>
                    <DropdownItem key={'4'}>4th semester</DropdownItem>
                </DropdownMenu>
                
            </div>
                <RadioGroup
                value={studentData.dept}
                onValueChange={handleDropDown}>
                    <Radio value="mca">MCA</Radio>
                    <Radio value="msc">MSc</Radio>
                </RadioGroup>
        </Dropdown>
    )
}

export default SelectStudent;
