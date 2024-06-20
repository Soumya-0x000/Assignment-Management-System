import React, { useEffect, useState } from 'react'
import { supabase } from '../../../CreateClient';
import toast from 'react-hot-toast';
import { nameLogo } from '../../../common/customHooks';
import { FaRegTrashCan } from "react-icons/fa6";
import { FaUserCheck } from "react-icons/fa";
import { 
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, 
    Button, useDisclosure 
} from '@nextui-org/react';

const PendingAdmins = () => {
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [modalDetail, setModalDetail] = useState({
        head: '',
        detail: '',
        actionType: '',
        action: () => {}
    })

    useEffect(() => {
        (async() => {
            const {data: pendingData, error: pendingError} = await supabase
                .from('pendingAdmin')
                .select('*')
                .order('createdAt', { ascending: true });

            if (pendingError) {
                console.error('Error occurred during fetching', pendingError.message);
                toast.error('Error occurred during fetching', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    }
                })
                return
            }

            setPendingAdmins(pendingData)
        })();
    }, []);

    const deleteAdmin = async() => {
        try {
            const {data: delData, error: delError} = await supabase
                .from('pendingAdmin')
                .delete()
                .eq('emailId', pendingAdmins[0].emailId)

            if (delError) {
                console.error('Error occurred during deleting', delError.message);
                setTimeout(async() => {
                    const {data: approveData, error: approveError} = await supabase
                        .from('pendingAdmin')
                        .upsert({
                            title: pendingAdmins[0].title,
                            name: pendingAdmins[0].name,
                            emailId: pendingAdmins[0].emailId,
                            password: pendingAdmins[0].password,
                            createdAt: new Date().toISOString()
                        }, { onConflict: ['emailId'] })
                }, 400);
                return
            }

            setPendingAdmins(pendingAdmins.filter((admin) => admin.emailId !== admin.emailId))
        } catch (error) {
            console.error('Error occurred during deleting', error);
            toast.error('Error occurred during deletion', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
            return
        }
    };

    const approveAdmin = async() => {
        try {
            const {data: approveData, error: approveError} = await supabase
                .from('admin')
                .insert([{
                    title: pendingAdmins[0].title,
                    name: pendingAdmins[0].name,
                    emailId: pendingAdmins[0].emailId,
                    password: pendingAdmins[0].password
                }])

            if (approveError) {
                console.error('Error occurred during approving', approveError);
                return
            }

            const {data: delData, error: delError} = await supabase
                .from('pendingAdmin')
                .delete()
                .eq('emailId', pendingAdmins[0].emailId)
            
            setPendingAdmins(pendingAdmins.filter((admin) => admin.emailId !== admin.emailId));
            
            if (delError) {
                console.error('Error occurred during approving', delError.message);
                setTimeout(async() => {
                    const {data: delData, error: delError} = await supabase
                        .from('admin')
                        .delete()
                        .eq('emailId', admin.emailId)
                }, 400);
                return
            }

            toast.success('Successfully approved', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
        } catch (error) {
            console.error(error.message);
            toast.error('Error occurred during approving', {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                }
            })
            return
        }
    };

    const handleModal = ({head, detail, actionType}, callBack) => {
        onOpen();
        setModalDetail({ head, detail, actionType, action: callBack });
    }

    const handleActionToast = () => {
        const loadingText = modalDetail.actionType.slice(0, -1)+'ing'

        toast.promise(modalDetail.action(), {
            loading: loadingText,
            success: `done`,
            error: 'something went wrong'
        }, {style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        }}).then(
            onClose()
        )
    };

    return (
        <div className=' bg-slate-800 rounded-lg px-2 py-3 w-full'>
            <span className=' text-slate-200 font-onest tracking-wider font-bold text-lg'>
                Pending admins
            </span>

            <div className=' grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 mt-3'>
                {(pendingAdmins.length > 0) ? pendingAdmins.map((admin, index) => (
                    <div key={index} className='flex flex-col gap-y-2 bg-slate-900 rounded-lg px-2 py-3'>
                        <div className=' flex gap-x-2'>
                            <div className='min-w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center'>
                                <span className='text-md text-slate-200 font-bold tracking-wide font-oxanium'>{nameLogo(admin.name)}</span>
                            </div>

                            <div className='flex flex-col items-start w-full justify-center gap-y-5 bg-slate-700 rounded-lg p-2'>
                                <div className='flex items-center gap-x-3 font-mono text-lg text-cyan-200'>
                                    {admin.title} {admin.name}
                                </div>

                                <div className='text-slate-200 text-[1rem] font-onest tracking-wider'>
                                    {admin.emailId}
                                </div>
                            </div>
                        </div>

                        <div className=' w-full flex items-center justify-between'>
                            <button
                            onClick={() => handleModal(
                                { 
                                    head: 'Delete admin ⚠️', 
                                    detail: `Are you sure, you want to delete ${admin.name}`,
                                    actionType: 'Remove'
                                }, deleteAdmin
                            )}
                            className='text-red-500 hover:text-red-400 text-xl hover:scale-110 transition-all hover:bg-[#711c1c] rounded-full p-2'>
                                <FaRegTrashCan/>
                            </button>
                            
                            <button
                            onClick={() => handleModal(
                                {
                                    head: 'Approve admin ✅', 
                                    detail: `Are you sure, you want to approve ${admin.name} as admin?`,
                                    actionType: 'Approve' 
                                }, approveAdmin
                            )}
                            className='text-green-400 hover:text-green-500 hover:bg-green-900 rounded-full p-2 text-[1.4rem] hover:scale-110 transition-all'>
                                <FaUserCheck/>
                            </button>
                        </div>
                    </div>
                )) : (
                    <span className='text-slate-300 font-robotoMono text-xl bg-slate-900 rounded-lg pl-4 py-3'>
                        No pending admins
                    </span>
                )}
            </div>
            
            <Modal backdrop={'blur'} className=' bg-slate-600' isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                {(onClose) => (<>
                    <ModalHeader className=" text-cyan-200 font-robotoMono text-xl tracking-wider">{modalDetail.head}</ModalHeader>

                    <ModalBody className=' text-green-300 font-mono text-lg'>
                        <span className='bg-slate-900 rounded-lg p-2'>
                            {modalDetail.detail}    
                        </span>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" variant="shadow" className=' font-robotoMono font-bold tracking-wider' onPress={onClose}>
                            Close
                        </Button>

                        <Button color="primary" className=' font-robotoMono font-bold tracking-wider' onPress={handleActionToast}>
                            {modalDetail.actionType}
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default PendingAdmins;
