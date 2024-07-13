import React, { useState } from 'react';
import SidebarButton from '../cta/sidebarButton';
import { MdOutlineDashboard, MdOutlineSettings } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { LuUserPlus } from "react-icons/lu";
import { GrDocumentUpdate } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { LuUser } from "react-icons/lu";
import { useSelector } from 'react-redux';






const Sidebar = () => {

  const userInfo = useSelector((state) => state.user.userInfo);
  console.log("userr info", userInfo)


  const logout = async ()=>{
    localStorage.removeItem('Token');
    window.location.href = '/';

  }
  return (

    <>
   
    <div className='flex-col lg:min-h-screen lg:pl-5 pl-3 lg:pr-3 pr-3 border-r border-r-slate200 lg:min-w-[250px] justify-between flex '>
    <ul className='mt-5'>
      <div className='justify-center flex bg-slate400 lg:w-20 lg:h-20 w-[30px] h-[30px] rounded-full items-center mb-5'>
      <LuUser className='lg:w-[34px] lg:h-[34px]' color='white'/>
      </div>
      <div className='py-2 lg:font-medium font-normal '>Hello {userInfo?.firstName} {userInfo?.lastName}</div>
      <SidebarButton 
      
       to='/super-admin' label='Dashboard'  icon={<MdOutlineDashboard />}/>
      <SidebarButton click={()=> alert("Page is under Development")} label='Profile'  icon={<FiUsers />}/>
      {/* <SidebarButton to='' label='Class Room' active="settings" icon={<LuUserPlus />}/> */}
      <SidebarButton to='/dashboard/create-organization' label='Create Organization'  icon={<GrDocumentUpdate />}/>
      <SidebarButton click={()=> alert("Page is under Development")}  label='Report'  icon={<HiOutlineDocumentReport />}/>
      <SidebarButton to='/dashboard/settings' label='Settings' icon={<MdOutlineSettings />}/>
      </ul>

      <div>
        <div>
          <ul>
            <div className='mb-10'>
            <div className='cursor flex items-center  ' onClick={logout} active="settings">
              <IoIosLogOut />
              <div className='ml-3'>Logout</div>
               </div>
            </div>
            <div className='text-center'>Company Logo</div>
            <div className='text-[10px] text-center mb-5'>All Right Reserved @2024</div>
          </ul>
        
        </div>
        
      </div>
   </div>
    </>
   
     
  
  );
};

export default Sidebar;