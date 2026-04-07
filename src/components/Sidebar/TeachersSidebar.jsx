import React, { useState } from 'react';
import { useLogoutMutation, apiSlice } from '../features/api/apiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from '../features/user/userSlice';
import SidebarButton from '../cta/sidebarButton';
import { MdOutlineDashboard, MdOutlineSettings } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { LuUserPlus } from "react-icons/lu";
import { GrDocumentUpdate } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { LuUser } from "react-icons/lu";




const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();
  const logout = async () => {
    await logoutApi().catch(() => {});
    localStorage.removeItem('Token');
    dispatch(setUserInfo(null));
    dispatch(apiSlice.util.resetApiState());
    navigate('/');
  };
  return (

    <>
   
   <div className='bg-blue-700 flex-col min-h-screen lg:min-h-screen lg:pl-5 pl-3 lg:pr-3 pr-3 border-r rounded-tr-3xl border-r-slate200 lg:min-w-[250px] justify-between flex '>
    <ul className='mt-5'>
      <SidebarButton to='/' label='Dashboard' active="dashboard" icon={<MdOutlineDashboard />}/>
      <SidebarButton click={()=> alert("Page is under Development")} label='Profile'  icon={<FiUsers />}/>
      <SidebarButton to='/dashboard/class-room' label='Class Room'  icon={<LuUserPlus />}/>
      <SidebarButton click={()=> alert("Page is under Development")} label='Update'  icon={<GrDocumentUpdate />}/>
      <SidebarButton click={()=> alert("Page is under Development")} label='Report' icon={<HiOutlineDocumentReport />}/>
      {/* <SidebarButton to='/dashboard/settings' label='Settings' icon={<MdOutlineSettings />}/> */}
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