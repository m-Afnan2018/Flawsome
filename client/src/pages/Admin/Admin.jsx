import React from 'react'
import style from './Admin.module.css'
import { Outlet } from 'react-router-dom'
import Sidebar from 'components/core/Admin/Sidebar';

const Admin = () => {
    return (
        <div className={style.Admin}>
            <Sidebar />
            <div className={style.Outlet}>
                <Outlet />
            </div>
        </div>
    )
}

export default Admin