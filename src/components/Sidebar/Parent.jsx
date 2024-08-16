import React, { useState } from "react";
import SidebarButton from "../cta/sidebarButton";
import { MdOutlineDashboard, MdOutlineSettings } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { LuUserPlus } from "react-icons/lu";
import { GrDocumentUpdate } from "react-icons/gr";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { IoIosLogOut } from "react-icons/io";
import { LuUser } from "react-icons/lu";

const Sidebar = () => {
  const logout = async () => {
    localStorage.removeItem("Token");
    window.location.href = "/";
  };
  return (
    <>
      <div className="bg-blue-700 flex-col min-h-screen lg:min-h-screen lg:pl-5 pl-3 lg:pr-3 pr-3 border-r rounded-tr-3xl border-r-slate200 lg:min-w-[250px] justify-between flex ">
        <ul className="mt-5">
          <div className="justify-center flex bg-slate400 w-20 h-20 rounded-full items-center mb-5">
            <LuUser className="" color="white" size="34" />
          </div>
          <SidebarButton
            to="/parent"
            label="Dashboard"
            active="dashboard"
            icon={<MdOutlineDashboard />}
          />
          {/* <SidebarButton to='/dashboard/customers' label='Profile' active="settings" icon={<FiUsers />}/>
      <SidebarButton to='/dashboard/addcustomer' label='Class Room' active="settings" icon={<LuUserPlus />}/>
      <SidebarButton to='/dashboard/update' label='Update' active="settings" icon={<GrDocumentUpdate />}/>
      <SidebarButton to='/dashboard/report' label='Report' active="Report" icon={<HiOutlineDocumentReport />}/>
      <SidebarButton to='/dashboard/settings' label='Settings' active="settings" icon={<MdOutlineSettings />}/> */}
        </ul>

        <div>
          <div className="flex flex-col">
            <div className="mb-10">
              <div
                className="cursor-pointer flex items-center text-white"
                onClick={logout}
              >
                <IoIosLogOut size={20} className="mr-2 text-white" /> Logout
              </div>
            </div>
            <div className="text-[10px] text-center mb-5 text-white">
              All Rights Reserved ©2024
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
