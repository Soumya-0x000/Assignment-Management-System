import React from 'react'
import Sidebar from './Sidebar'
import Canvas from './Canvas'
import { Toaster } from 'react-hot-toast'

const AdminDashboard = () => {
    return <>
        <Toaster/>
        <div className='flex gap-x-3 bg-slate-700 h-screen'>
            <Sidebar/>
            <Canvas/>
        </div>
    </>
}

export default AdminDashboard