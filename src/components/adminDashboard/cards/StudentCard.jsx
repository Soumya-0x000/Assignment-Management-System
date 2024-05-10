import React from 'react'
import { useSelector } from 'react-redux';

const StudentCard = () => {
    const { dataForCanvas } = useSelector(state => state.adminDashboard);
    console.log(dataForCanvas)

    return (
        <div>StudentCard</div>
    )
}

export default StudentCard;
