import React from 'react'
import Sidebar from './Sidebar'
import Canvas from './Canvas'
import { Toaster } from 'react-hot-toast'

const AdminDashboard = () => {
    return <>
        <Toaster/>
        <div className='flex bg-slate-700 h-screen overflow-y-auto'>
            <Sidebar/>
            <Canvas/>
        </div>
    </>
}

export default AdminDashboard