import React from 'react'
import { useSelector } from 'react-redux';

const TeacherCard = () => {
    const { dataForCanvas } = useSelector(state => state.adminDashboard) ?? {};
    console.log(dataForCanvas)

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {dataForCanvas?.map((data, indx) => (
                data && (
                    <div className='ring'
                    key={data.emailId + indx}>
                        <div>
                            <p>{data.title} {data.name}</p>
                            <p>{data.emailId}</p>
                            <p>{data.password}</p>
                            <div>
                                {data.MCA.map((sub, i) => (
                                    <span className=''
                                    key={sub+i}>
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            ))}
        </div>
    )
}

export default TeacherCard;
