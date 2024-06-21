import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { supabase } from '../../../CreateClient';
import toast from 'react-hot-toast';
import { setMode, setTeachers } from '../../../reduxStore/reducers/AdminDashboardSlice';
import { nameLogo } from '../../../common/customHooks';
import { motion } from 'framer-motion';
import { childVariants, staggerVariants } from '../../../common/Animation';
import { RenderDeptClass } from './RenderDeptClass';

const TeacherCard = () => {
    const { dataForCanvas } = useSelector(state => state.adminDashboard) ?? {};
    const [showPswd, setShowPswd] = useState(new Array(dataForCanvas.length).fill(false));
    const [deleteModalOpen, setDeleteModalOpen] = useState(new Array(dataForCanvas.length).fill(false));
    const dispatch = useDispatch();

    const handlePswdVisibility = (index) => {
        const tempArr = [...showPswd];
        tempArr[index] = !tempArr[index];
        setShowPswd(tempArr);
    };

    const handleDeleteTeacher = async(id, name) => {
        try {
            const { data, error } = await supabase
                .from('teachers')
                .delete()
                .eq('uniqId', id);

            if (error) {
                console.error('Error deleting row:', error.message);
                toast.error(`${name} is not removed...`)
                return;
            } else {
                toast.success(`${name} deleted successfully...`);
                const tempArr = [...dataForCanvas];
                const newTeachers = tempArr.filter(mentor => mentor.uniqId !== id);
                dispatch(setMode('teacher'))
                dispatch(setTeachers(newTeachers))
            }
        } catch (error) {
            toast.error('Error occurred during deletion...')
            console.error('An unexpected error occurred:', error);
        }
    };

    const handleDeleteTeacherToast = (id, name) => {
        toast.promise(handleDeleteTeacher(id, name), {
            loading: 'Deleting teacher...',
            success: 'Deletion initiated...!',
            error: 'Failed to initiate deletion...'
        }, {style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        }})
    };

    const handleDeleteMiddleware = (index) => {
        setDeleteModalOpen(prevState => {
            const tempArr = [...deleteModalOpen]
            tempArr[index] = !prevState[index]
            return tempArr
        })
    };

    return (
        <div className=' w-full h-full overflow-y-auto flex flex-wrap'>
            <motion.div className='grid md:grid-cols-2 xl:grid-cols-3 overflow-y-auto gap-5 sm:gap-7 lg:gap-9 xl:gap-14 2xl:gap-16'
            variants={staggerVariants}
            initial='initial'
            animate='animate'>
                {dataForCanvas?.map((data, indx) => (
                    data && (
                        <motion.div 
                        key={data.emailId + indx}
                        className=' p-2 bg-[#121118bb] rounded-lg group h-fit'
                        variants={childVariants}>
                            {/* private details */}
                            <div className='w-full flex justify-between gap-x-6 md:gap-x-2 relative'>
                                {/* name email */}
                                <div className=' space-y-2 w-full'>
                                    <p className='text-[1.3rem] text-[#5bffd0fb] font-onest tracking-wide line-clamp-1'>
                                        {data.title} {data.name}
                                    </p>

                                    <div className=' md:max-w-[14.5rem] preLg:max-w-[20rem] bg-[#31404d] rounded-lg pl-2 pr-3 line-clamp-1 flex flex-col items-start justify-start'>
                                        <div className='text-[#b7fa87e8] flex items-center gap-x-3 font-mavenPro py-1 line-clamp-1'>
                                            <MdOutlineMailOutline className=' text-xl'/> 
                                            <span>
                                                {data.emailId}
                                            </span>
                                        </div>

                                        <div className='text-[#b7fa87e8] flex items-center gap-x-3 font-mavenPro py-1 w-full'>
                                            <button className=' text-xl' onClick={() => handlePswdVisibility(indx)}>
                                                {showPswd[indx] ? <MdOutlineLockOpen/> : <MdOutlineLock/> }
                                            </button>

                                            <input 
                                                type={showPswd[indx] ? "text" : "password"}
                                                className='outline-none bg-transparent w-full font-mavenPro'
                                                value={data.password}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* logo */}
                                <div className='mt-3 min-w-14 max-w-14 min-h-14 max-h-14 bg-[#1c6c6a] font-mavenPro font-bold text-[1.4rem] text-cyan-200 tracking-wider rounded-full overflow-hidden flex items-center justify-center mr-1'>
                                    {nameLogo(data.name)}
                                </div>

                                {/* delete btn */}
                                <button className=' absolute p-2 right-0 text-red-500 text-xl -bottom-7 hidden group-hover:block'
                                onClick={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                    <FiTrash2 className=' rounded-full'/>
                                </button>

                                {/* delete confirmation modal */}
                                <Modal className=' bg-slate-600'
                                backdrop="blur"
                                isOpen={deleteModalOpen[indx]} 
                                onClose={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                    <ModalContent>
                                        <ModalHeader className="flex flex-col gap-1 text-lg font-robotoMono text-white">
                                            Deletion confirmation
                                        </ModalHeader>

                                        <ModalBody className=' text-xl font-mavenPro text-cyan-200'>
                                            You want to remove {data?.name} ?
                                        </ModalBody>

                                        <ModalFooter className=" mt-3 flex justify-between">
                                            <Button color="danger" 
                                            variant="shadow"
                                            className=' font-robotoMono text-[1rem]' 
                                            onPress={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                                Close
                                            </Button>

                                            <Button 
                                            color='primary'
                                            variant='shadow'
                                            className=" font-robotoMono text-[1rem]" 
                                            onClick={() => handleDeleteTeacherToast(data?.uniqId, data?.name)}
                                            onPress={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                                Delete
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </div>

                            <RenderDeptClass data={data}/>
                        </motion.div>
                    )
                ))}
            </motion.div>
        </div>
    )
}

export default TeacherCard;
