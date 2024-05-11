import React, { useState } from 'react'
import { MdOutlineMailOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const StudentCard = () => {
    const { dataForCanvas } = useSelector(state => state.adminDashboard) ?? {};
    const [showPswd, setShowPswd] = useState(new Array(dataForCanvas.length).fill(false));
    const [deleteModalOpen, setDeleteModalOpen] = useState(new Array(dataForCanvas.length).fill(false));
    const dispatch = useDispatch();
    console.log(dataForCanvas)

    const handlePswdVisibility = (index) => {
        const tempArr = [...showPswd];
        tempArr[index] = !tempArr[index];
        setShowPswd(tempArr);
    };

    return (
        <div className=' w-full h-full overflow-y-auto flex flex-wrap'>
            <div className='flex items-center justify-center flex-wrap overflow-y-auto gap-5 sm:gap-7 lg:gap-9 xl:gap-14 2xl:gap-16'>
                {dataForCanvas?.map((data, indx) => (
                    data && (
                        <div className='flex flex-col items-center justify-center p-2 bg-[#121118bb] rounded-lg group'
                        key={data.emailId + indx}>
                            {/* private details */}
                            <div className='w-full flex justify-between gap-x-10 relative'>
                                {/* name email */}
                                <div className=' space-y-2 w-full'>
                                    {/* name */}
                                    <p className='text-[1.3rem] font-bold text-[#5bffd0fb] font-onest tracking-wide'>
                                        {data.name}
                                    </p>

                                    {/* email */}
                                    <div className=' w-full bg-[#31404d] rounded-lg pr-7'>
                                        <div className='text-[#20e9b0e8] flex items-center gap-x-3 font-mavenPro py-1 pl-3 w-full'>
                                            <MdOutlineMailOutline className=' text-xl'/> {data.emailId}
                                        </div>

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
                                    </div>
                                </div>

                                {/* logo */}
                                <div className='mt-3 min-w-14 max-w-14 min-h-14 max-h-14 bg-[#c993ff] shadow-md shadow-orange-500 font-bold text-violet-800 rounded-full overflow-hidden flex items-center justify-center mr-1'>
                                    {...data.name.split(' ').map(a => ([...a][0]))}
                                </div>

                                {/* delete btn */}
                                <button className=' absolute right-0 text-red-500 text-xl -bottom-6 hidden group-hover:block'
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

                                            <Button className="bg-cyan-200 text-cyan-800" onClick={() => handleDeleteTeacherToast(data?.uniqId, data?.name)}
                                            onPress={() => handleDeleteMiddleware(indx, data?.uniqId)}>
                                                Delete
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                            </div>

                            {/* MCA */}
                            <div className=' mt-5 w-full'>
                                <div className='pb-1 mb-2 w-full border-b-1 border-yellow-200 '>
                                    <p className='text-[1.1rem] font-bold text-[#5bffd0fb] font-onest tracking-wide'>
                                        MCA
                                    </p>
                                </div>

                                <div className='grid grid-cols-2 gap-x-5 gap-y-3 place-content-center place-items-center'>
                                    {data.MCA && data.MCA.map((sub, i) => (
                                        <div className=' flex items-center justify-center gap-x-2 rounded-lg p-2 bg-[#3746b8] text-[#ffffa3e8] text-[.9rem] font-robotoMono font-bold w-full'
                                        key={i}>
                                            <span>{Object.entries(sub)[0][0]}:</span>
                                            <span>{Object.entries(sub)[0][1]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* MSc */}
                            <div className=' mt-5 w-full'>
                                <div className='pb-1 mb-2 w-full border-b-1 border-yellow-200 '>
                                    <p className='text-[1.1rem] font-bold text-[#5bffd0fb] font-onest tracking-wide'>
                                        MSc
                                    </p>
                                </div>

                                <div className='grid grid-cols-2 gap-x-5 gap-y-3 place-content-center place-items-center'>
                                    {data.MSc && data.MSc.map((sub, i) => (
                                        <div className=' flex items-center justify-center gap-x-2 rounded-lg p-2 bg-[#3746b8] text-[#ffffa3e8] text-[.9rem] font-robotoMono font-bold w-full'
                                        key={i}>
                                            <span>{Object.entries(sub)[0][0]}:</span>
                                            <span>{Object.entries(sub)[0][1]}</span>
                                        </div>
                                    ))}
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
