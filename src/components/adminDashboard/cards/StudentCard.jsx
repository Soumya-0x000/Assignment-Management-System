import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React, { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi';
import { MdOutlineLock, MdOutlineLockOpen, MdOutlineMailOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { PiIdentificationBadge } from "react-icons/pi";
import { setMode, setStudents } from '../../../reduxStore/reducers/AdminDashboardSlice';
import { formatSemester, nameLogo } from '../../../common/customHooks';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import toast from 'react-hot-toast';
import { supabase } from '../../../CreateClient';

const StudentCard = () => {
    const { dataForCanvas } = useSelector(state => state.adminDashboard) ?? {};
    const [showPswd, setShowPswd] = useState(new Array(dataForCanvas.length).fill(false));
    const [deleteModalOpen, setDeleteModalOpen] = useState(new Array(dataForCanvas.length).fill(false));
    const dispatch = useDispatch();

    const handlePswdVisibility = (index) => {
        const tempArr = [...showPswd];
        tempArr[index] = !tempArr[index];
        setShowPswd(tempArr);
    };

    const handleDeleteStudent = async(id, name, tableName) => {
        try {
            const { data, error } = await supabase
                .from(tableName)
                .delete()
                .eq('uniqId', id);

            if (error) {
                console.error('Error deleting row:', error.message);
                toast.error(`${name} is not removed...`)
                return;
            } else {
                toast.success(`${name} deleted successfully...`);
                const tempArr = [...dataForCanvas];
                const newStudents = tempArr.filter(mentor => mentor.uniqId !== id);
                dispatch(setMode('student'))
                dispatch(setStudents(newStudents))
            }
        } catch (error) {
            toast.error('Error occurred during deletion...')
            console.error('An unexpected error occurred:', error);
        }
    };

    const handleDeleteStudentToast = (id, name, tableName) => {
        toast.promise(handleDeleteStudent(id, name, tableName), {
            loading: 'Deleting student...',
            success: 'Deletion initiated...!',
            error: 'Failed to initiate deletion...'
        })
    };

    const handleDeleteMiddleware = (index) => {
        setDeleteModalOpen(prevState => {
            const tempArr = [...deleteModalOpen]
            tempArr[index] = !prevState[index]
            return tempArr
        })
    };

    return (
        <div className=' w-full h-full overflow-y-auto flex justify-center flex-wrap'>
            <div className='flex items-center justify-center flex-wrap overflow-y-auto gap-5 sm:gap-7 lg:gap-9 xl:gap-14 2xl:gap-16'>
                {dataForCanvas?.map((data, indx) => (
                    data && (
                        <div className='flex flex-col items-center justify-center p-2 bg-[#121118bb] rounded-lg group max-w-[28rem]'
                        key={data.emailId + indx}>
                            {/* private details */}
                            <div className='w-full flex justify-between gap-x-4 md:gap-x-10 relative'>
                                {/* name email */}
                                <div className=' space-y-2 w-full'>
                                    {/* name */}
                                    <p className='text-[1.3rem] font-bold text-[#5bffd0fb] font-onest tracking-wide line-clamp-1'>
                                        {data.name}
                                    </p>

                                    {/* personal details */}
                                    <div className=' w-full bg-[#31404d] rounded-lg pr-7'>
                                        {/* email */}
                                        <div className='text-[#20e9b0e8] flex items-center gap-x-3 font-mavenPro py-1 pl-3 max-w-[220px] line-clamp-'>
                                            <MdOutlineMailOutline className=' text-xl'/>
                                            <input 
                                                disabled
                                                className=' bg-transparent outline-none border-none w-full'
                                                value= {data.emailId}
                                            />
                                        </div>

                                        {/* password */}
                                        <div className='text-[#20e9b0e8] flex items-center gap-x-3 font-mavenPro py-1 pl-3 w-full'>
                                            <button className=' text-xl' onClick={() => handlePswdVisibility(indx)}>
                                                {showPswd[indx] ? <MdOutlineLockOpen/> : <MdOutlineLock/> }
                                            </button>

                                            <input 
                                                type={showPswd[indx] ? "text" : "password"}
                                                className='outline-none bg-transparent w-full text-[#20e9b0e8] font-mavenPro'
                                                value={data.password}
                                                disabled
                                            />
                                        </div>

                                        {/* usnId */}
                                        <div className='text-[#20e9b0e8] flex items-center gap-x-3 font-mavenPro py-1 pl-3 max-w-[200px] line-clamp-'>
                                            <PiIdentificationBadge className=' text-xl'/>
                                            <input 
                                                disabled
                                                className=' bg-transparent outline-none border-none w-full'
                                                value= {data.usnId}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* logo */}
                                <div className='mt-3 min-w-14 max-w-14 min-h-14 max-h-14 bg-[#c993ff] shadow-md shadow-orange-500 font-bold text-violet-800 rounded-full overflow-hidden flex items-center justify-center mr-1'>
                                    {nameLogo(data.name)}
                                </div>

                                {/* delete btn */}
                                <button className=' absolute right-0 text-red-500 text-xl bottom-1 hidden group-hover:block'
                                onClick={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                    <FiTrash2/>
                                </button>

                                {/* delete confirmation modal */}
                                <Modal 
                                backdrop="transparent"
                                isOpen={deleteModalOpen[indx]} 
                                onClose={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                    <ModalContent>
                                        <ModalHeader className="flex flex-col gap-1 text-lg">
                                            Deletion confirmation
                                        </ModalHeader>

                                        <ModalBody className=' text-xl'>
                                            You want to remove {data?.name} ?
                                        </ModalBody>

                                        <ModalFooter className=" mt-3 flex justify-between">
                                            <Button color="danger" variant="flat" onPress={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                                Close
                                            </Button>

                                            <Button className="bg-cyan-200 text-cyan-800" onClick={() => handleDeleteStudentToast(data?.uniqId, data?.name, data?.tableName)}
                                            onPress={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                                Delete
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </div>

                            {/* Academic details */}
                            <div className=' mt-5 w-full'>
                                <div className='pb-1 mb-2 w-full border-b-1 border-yellow-200 '>
                                    <p className='text-[1.1rem] font-bold text-[#5bffd0fb] font-onest tracking-wide'>
                                        Academic details
                                    </p>
                                </div>

                                <div className='grid grid-cols-2 gap-x-2 md:gap-x-5 gap-y-3 place-content-center place-items-center'>
                                    <div className=' flex items-center justify-center gap-x-2 rounded-lg p-2 bg-[#3746b8] text-[#ffffa3e8] text-[.9rem] font-robotoMono font-bold w-full'>
                                        <span>Department:</span>
                                        <span>{data?.department}</span>
                                    </div>
                                    
                                    <div className=' flex items-center justify-center gap-x-2 rounded-lg p-2 bg-[#3746b8] text-[#ffffa3e8] text-[.9rem] font-robotoMono font-bold w-full'>
                                        <span>{formatSemester(`${data?.semester}`)}</span>
                                    </div>
                                </div>

                                <div className='mt-2 flex items-center justify-center gap-x-2 rounded-lg p-2 bg-[#3746b8] text-[#ffffa3e8] text-[.9rem] font-robotoMono font-bold w-full'>
                                    <span>Date of birth: {dayjs(data.birthDate).locale('en').format('DD MMMM, YYYY')}</span>
                                </div>
                            </div>                            
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default StudentCard;
