import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa';
import { useDateFormatter } from "@react-aria/i18n";
import { parseDate } from '../../common/customHooks';
import toast from 'react-hot-toast';
import { supabase } from '../../CreateClient';

const SubmittedResponses = ({ modalStatus, setModalStatus, assignment }) => {
    let formatter = useDateFormatter({dateStyle: "full"});
    const [assignmentToRender, setAssignmentToRender] = useState({})

    const handleFileDownloadToast = (item) => {
        console.log(item)
    };

    useEffect(() => {
        (async() => {
            try {
                const tableName = `studentsSem${[...assignment?.sem][0]}`
                const { department, subject, fullSubName } = assignment

                const {data: studentData, error: studentError} = await supabase
                    .from(tableName)
                    .select('*')
                    .eq('department', department)
                    .not('submittedAssignments', 'is', null)

                console.log(studentData)

                setAssignmentToRender(studentData)
            } catch (error) {
                console.error('An unexpected error occurred:', error);
                toast.error('Error in getting student responses', {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                        padding: '16px'
                    }
                })
            }
        })()
    }, [assignment]);

    return (
        <div>
            <Modal 
            size={'full'} 
            className=' bg-slate-800 overflow-y-auto'
            isOpen={modalStatus} 
            onClose={() => setModalStatus(false)}>
                <ModalContent>
                {(setModalStatus) => (<>
                    <ModalHeader className=" font-robotoMono text-yellow-200 pb-3 border-b-1 mx-3 border-green-300">
                        Submitted assignments 
                    </ModalHeader>

                    <ModalBody>
                        <div className=' border-b w-fit border-green-400 pb-3'>
                            <div className='bg-[#385368] rounded-xl mt-5 p-3 flex flex-col gap-y-3 group w-full sm:w-fit overflow-hidden cursor-pointer group transition-all line-clamp-1' >
                                <div className='text-cyan-200 text-lg font-bold font-robotoMono tracking-wider mb-2 line-clamp-1 w-fit  group-hover:translate-x-1 group-hover:-translate-y-[3px] transition-all'>
                                    {assignment?.orgName}
                                </div>

                                <div className='text-gray-300 font-onest tracking-wider flex flex-wrap gap-1.5 xl:gap-2.5 group-hover:translate-x-1  group-hover:-translate-y-1 transition-all'>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.sem}</span>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.department}</span>
                                    <span className=' bg-slate-950 rounded-lg py-1 px-3 text-[14px]'>{assignment.subject}</span>
                                </div>

                                <div className=' font-robotoMono text-sm bg-slate-950 text-green-300 w-fit px-3 py-1 rounded-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-all'>
                                    Deadline: {assignment.submitDeadline && formatter.format(parseDate(assignment.submitDeadline))}
                                </div>
                            </div>
                        </div>
                        {console.log(assignmentToRender)}
                        {assignmentToRender?.length > 0 ? (
                            <div className=' flex flex-wrap items-center gap-4 mt-10'>
                                {assignmentToRender.map((item, indx) => (
                                    <div 
                                    className=' bg-slate-900 rounded-lg overflow-hidden py-3 px-4 w-full sm:w-fit relative'
                                    key={indx}>
                                        <span className=' absolute p-2 bg-slate-950 right-0 top-0 text-violet-300 rounded-bl-xl font-oxanium font-bold'>{indx+1}</span>

                                        <div className=' text-slate-200 font-mavenPro text-[1.1rem]'>
                                            {item.myFileOrgName}
                                        </div>

                                        <div className=' text-yellow-300 font-robotoMono tracking-wide mt-6 space-x-2'>
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                {item.sem}
                                            </span>
                                            
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                {item.dept}
                                            </span>
                                            
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                {item.subName}
                                            </span>
                                        </div>

                                        <div className=' mt-6 font-jaldi text-green-300 tracking-wider flex flex-col gap-y-3 text-[1.05rem]'>
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                Deadline: {formatter.format(parseDate(item.deadline))}
                                            </span>
                                            
                                            <span className=' bg-[#2e3e67] rounded-lg px-2 py-1'>
                                                Submitted date: {formatter.format(parseDate(item.submittedDate))}
                                            </span>
                                        </div>

                                        <div className=' flex items-center justify-between mt-9'>
                                            <button className=' text-green-400 text-[17px] bg-green-900 p-2 rounded-xl active:scale-110 transition-all group-hover:-translate-x-1'
                                            onClick={() => handleFileDownloadToast(item)}>
                                                <FaDownload/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className=' w-full bg-slate-950 p-3 text-lg font-robotoMono rounded-lg text-white'>
                                You have not submitted any assignment
                            </div>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" variant="shadow" className=' font-robotoMono tracking-wide text-[1rem]' onPress={() => setModalStatus(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                </>)}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default SubmittedResponses;
