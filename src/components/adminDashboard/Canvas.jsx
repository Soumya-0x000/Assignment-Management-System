import React from 'react'
import { useSelector } from 'react-redux'

const Canvas = () => {
    const {students} = useSelector(state => state.adminDashboard);
    console.log(students)

    return (
        <div>Canvas</div>
    )
}

export default Canvas;
