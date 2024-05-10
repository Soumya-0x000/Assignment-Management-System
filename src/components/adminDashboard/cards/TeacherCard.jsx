import React from 'react'
import { useSelector } from 'react-redux';

const TeacherCard = () => {
    const { dataForCanvas } = useSelector(state => state.adminDashboard) ?? {};

    return (
        <div className=' w-full h-full overflow-y-auto flex items-cente justify-cente'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-content-center gap-5 sm:gap-7 lg:gap-9 xl:gap-14 2xl:gap-16'>
                {dataForCanvas?.map((data, indx) => (
                    data && (
                        <div className='flex flex-col items-center justify-center p-2 bg-[#f5f5f5]'
                        key={data.emailId + indx}>
                            <p className='text-[1.2rem] font-bold text-[#299b7ae8]'>{data.title} {data.name}</p>
                            <p className='text-[#299b7ae8]'>{data.emailId}</p>
                            <div className='flex flex-wrap gap-2'>
                                {data.MCA && data.MCA.map((sub, i) => (
                                    <div className='inline-block rounded-lg p-2 bg-[#f5f5f5] text-[#299b7ae8]' key={i}>
                                        <p className='text-[1.1rem] font-bold'>{Object.entries(sub)[0]}</p>
                                        <p className='text-[1rem]'>{Object.entries(sub)[1]}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <div className='flex flex-wrap gap-2'>
                                {data.MSc && data.MSc.map((sub, i) => (
                                    <div className='inline-block rounded-lg p-2 bg-[#f5f5f5] text-[#299b7ae8]' key={i}>
                                        <p className='text-[1.1rem] font-bold'>{Object.entries(sub)[0]}</p>
                                        <p className='text-[1rem]'>{Object.entries(sub)[1]}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    )
}

export default TeacherCard;
