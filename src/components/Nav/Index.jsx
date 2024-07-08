import React from 'react'
import { useSelector } from 'react-redux'
import { useGetAccountByIdQuery } from '../../features/api/apiSlice'

const Index = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    console.log("userr info", userInfo);
    const { data, error, isLoading } = useGetAccountByIdQuery(userInfo.accountId);
    console.log("my data", data);
  return (
    <div className="navbar bg-base-100">

    <div className="flex-1 lg:px-4">
    <div className=" w-[50px] h-[50px] mr-2 lg:mr-5 lg:w-[60px] lg:h-[60px] items-center justify-center rounded-full flex bg-slate-400 ">Logo</div>
      <div className=" lg:text-3xl lg:font-extrabold font-medium">{data?.accountName}</div>
    </div>

    <div className="flex-none gap-2 lg:px-10">
    
      <div className="dropdown dropdown-end">
        <div className='flex items-center gap-2'>
             <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-20 rounded-full">
            <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </div>
        {/* <div className=''>
            <div className='text-sm font-medium'>{userInfo?.fullName}</div>
            <div className='text-sm font-light'>{userInfo.email}</div>

        </div> */}
        </div>
       
       
        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li>
          <div className='text-sm font-semibold'>{userInfo?.fullName}</div>
            <div className='text-sm font-light'>{userInfo.email}</div>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
  )
}

export default Index
