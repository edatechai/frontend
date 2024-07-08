import React from 'react'
import { useSelector } from 'react-redux'

const Index = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
  return (
    <div className='mt-7 px-7 flex gap-5 justify-between'>
        <div className='min-w-[70%]'>
            <div className='rounded-[5px] border-[1px] border-slate300 py-5 px-5 '>
                <div className='flex items-end gap-3'>
                <div>
                    <div className="avatar">
                     <div className="w-24 mask mask-squircle">
                       <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                    </div>
                       </div>
                </div>

                    <div className='mb-3'>
                        <div className='font-bold text-xl'>{userInfo?.fullName}</div>
                        <div className='text-slate-500'>{userInfo?.role}</div>
                    </div>

                </div>

                <div className='mt-7'>
                    <div className='text-slate-500 font-light'>
                    Welcome to our math class! I'm {userInfo?.fullName} and I'm thrilled to
                     embark on this mathematical journey with you. Together, we'll explore concepts from basic arithmetic to advanced algebra, uncovering the beauty of numbers along the way.
                     My goal is to make math both fun and accessible for everyone. Let's dive in and discover the wonders of mathematics!"
                    </div>
                </div>
           
            </div>
            
        </div>
        <div className='min-w-[27%]'>
            <div className='rounded-[5px] border-[1px] border-slate300 py-5 px-5 '>
             right
            </div>
           
        </div>
    </div>
  )
}

export default Index
