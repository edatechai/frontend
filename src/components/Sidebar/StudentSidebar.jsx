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
   
    <div className='bg-blue-700 flex-col min-h-screen lg:min-h-screen lg:pl-5 pl-3 lg:pr-3 pr-3 border-r rounded-tr-3xl border-r-slate200 lg:min-w-[250px] justify-between flex '>
    <ul className='mt-5'>
      <div className='mb-10 text-white ml-4'>Logo</div>
      <SidebarButton to='/' label='Dashboard' active="dashboard" icon={<MdOutlineDashboard />}/>
      <SidebarButton 
      to='/profile'
      // click={()=> alert("Page is under Development")} 
      label='Profile' active="settings" icon={<FiUsers />}/>
      {/* <SidebarButton to='/dashboard/addcustomer' label='Class Room' active="settings" icon={<LuUserPlus />}/> */}
      <SidebarButton to='/recommendation' label='Recommendation' active="settings" icon={<GrDocumentUpdate />}/>
      <SidebarButton click={()=> alert("Page is under Development")} label='Report' active="Report" icon={<HiOutlineDocumentReport />}/>
      <SidebarButton click={()=> alert("Page is under Development")} label='Settings' active="settings" icon={<MdOutlineSettings />}/>
      </ul>

      <div className='flex flex-col'>
        <div className='mb-10'>
          <div className='cursor-pointer flex items-center' onClick={logout}>
            <IoIosLogOut size={20} className='mr-2' color='white' />
            {/* <div className='hidden lg:visible'>Logout</div> */}
          </div>
        </div>
        <div className='text-left text-white'>EDAT</div>
        <div className='text-[10px] text-left mb-5 text-white'>All Rights Reserved ©2024</div>
      </div>
   </div>
    </>
   
     
  
  );
};

export default Sidebar;