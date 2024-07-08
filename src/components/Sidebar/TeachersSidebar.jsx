import React, { useState } from 'react';
import SidebarButton from '../cta/sidebarButton';
import { MdOutlineDashboard, MdOutlineSettings } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { LuUserPlus } from "react-icons/lu";
import { GrDocumentUpdate } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { LuUser } from "react-icons/lu";






const Sidebar = () => {
  const logout = async () => {
    localStorage.removeItem('Token');
    window.location.href = '/';
  };
  return (

    <>
   
    <div className='flex-col lg:min-h-screen lg:pl-5 pl-3 lg:pr-3 pr-3 border-r border-r-slate200 lg:min-w-[250px] justify-between flex '>
    <ul className='mt-5'>
      <SidebarButton to='/' label='Dashboard' active="dashboard" icon={<MdOutlineDashboard />}/>
      <SidebarButton to='/dashboard/profile' label='Profile'  icon={<FiUsers />}/>
      <SidebarButton to='/dashboard/class-room' label='Class Room'  icon={<LuUserPlus />}/>
      <SidebarButton to='/dashboard/update' label='Update'  icon={<GrDocumentUpdate />}/>
      <SidebarButton to='/dashboard/report' label='Report' icon={<HiOutlineDocumentReport />}/>
      <SidebarButton to='/dashboard/settings' label='Settings' icon={<MdOutlineSettings />}/>
      </ul>

      <div className='flex flex-col'>
        <div className='mb-10'>
          <div className='cursor-pointer flex items-center' onClick={logout}>
            <IoIosLogOut size={20} className='mr-2' /> Logout
          </div>
        </div>
        <div className='text-center'>Company Logo</div>
        <div className='text-[10px] text-center mb-5'>All Rights Reserved ©2024</div>
      </div>
   </div>
    </>
   
     
  
  );
};

export default Sidebar;