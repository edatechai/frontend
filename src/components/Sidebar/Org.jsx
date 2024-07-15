// import React, { useState } from 'react';
// import SidebarButton from '../cta/sidebarButton';
// import { MdOutlineDashboard, MdOutlineSettings } from "react-icons/md";
// import { FiUsers } from "react-icons/fi";
// import { LuUserPlus } from "react-icons/lu";
// import { GrDocumentUpdate } from "react-icons/gr";
// import { HiOutlineDocumentReport } from "react-icons/hi";
// import { IoIosLogOut } from "react-icons/io";
// import { LuUser } from "react-icons/lu";
// import { useSelector } from 'react-redux';
// import { useGetAccountByIdQuery } from '../../features/api/apiSlice';






// const Sidebar = () => {
//   const userInfo = useSelector((state) => state.user.userInfo);
//   console.log("userr info", userInfo)
//   const { data, error, isLoading } = useGetAccountByIdQuery(userInfo.accountId);
  

//   console.log("my ddata", data)


  

//   const logout = async ()=>{
//     localStorage.removeItem('Token');
//     window.location.href = '/';

//   }
//   return (
//     <>
   
//     <div className='flex-col lg:min-h-screen lg:pl-5 pl-3 lg:pr-3 pr-3 border-r border-r-slate200 lg:min-w-[250px] justify-between flex '>
//     <ul className='mt-5'>
//       <div className='justify-center flex bg-slate400 w-20 h-20 rounded-full items-center mb-5'>
//       <LuUser className='' color='white' size="34"/>
//       </div>
//       <div className='py-2 font-medium'>Hello {userInfo?.fullName}</div>
//       <SidebarButton to='/dashboard' label='Dashboard' active="dashboard" icon={<MdOutlineDashboard />}/>
//       <SidebarButton to='/dashboard/customers' label='Profile' active="settings" icon={<FiUsers />}/>
//       <SidebarButton to='/dashboard/addcustomer' label='Class Room' active="settings" icon={<LuUserPlus />}/>
//       <SidebarButton to='/dashboard/update' label='Update' active="settings" icon={<GrDocumentUpdate />}/>
//       <SidebarButton to='/dashboard/report' label='Report' active="Report" icon={<HiOutlineDocumentReport />}/>
//       <SidebarButton to='/dashboard/settings' label='Settings' active="settings" icon={<MdOutlineSettings />}/>
//       </ul>

//       <div>
//         <div>
//           <ul>
//             <div className='mb-10'>
//                <div className='cursor' onClick={logout} active="settings" icon={<IoIosLogOut />}>Logout</div>
//             </div>
           
            
//             <div className='text-center'>Company Logo</div>
//             <div className='text-[10px] text-center mb-5'>All Right Reserved @2024</div>
//           </ul>
        
//         </div>
        
//       </div>
//    </div>
//     </>
   
     
  
//   );
// };

// export default Sidebar;

import React from 'react';
import SidebarButton from '../cta/sidebarButton';
import { MdOutlineDashboard, MdOutlineSettings } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { LuUserPlus } from "react-icons/lu";
import { GrDocumentUpdate } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { LuUser } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { useGetAccountByIdQuery } from '../../features/api/apiSlice';

const Sidebar = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log("userr info", userInfo);
  const { data, error, isLoading } = useGetAccountByIdQuery(userInfo.accountId);
  console.log("my data", data);

  const logout = async () => {
    localStorage.removeItem('Token');
    window.location.href = '/';
  };

  return (
    <div className='flex flex-col min-h-screen border-r border-r-slate-200 lg:pl-5 pl-3 lg:pr-3 pr-3 lg:min-w-[250px] justify-between'>
      <ul className='mt-5'>
        <SidebarButton to='/' label='Dashboard' active="dashboard" icon={<MdOutlineDashboard />} />
        <SidebarButton click={()=> alert("Page is under Development")} label='Profile' active="settings" icon={<FiUsers />} />
        {/* <SidebarButton to='/dashboard/class-room' label='Class Room' active="settings" icon={<LuUserPlus />} /> */}
        <SidebarButton click={()=> alert("Page is under Development")} label='Update' active="settings" icon={<GrDocumentUpdate />} />
        <SidebarButton click={()=> alert("Page is under Development")} label='Report' active="Report" icon={<HiOutlineDocumentReport />} />
        <SidebarButton to='dashboard/org-settings' label='Settings' active="settings" icon={<MdOutlineSettings />} />
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
  );
};

export default Sidebar;
