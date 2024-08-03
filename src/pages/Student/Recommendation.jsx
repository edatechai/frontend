import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import { useUpdateBioMutation} from '../../features/api/apiSlice';

const Index = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
  
  return (
    <div className='mt-7 px-7 flex  justify-center'>
        <div className='min-w-[70%] max-w-[70%]'>
            <div className='rounded-[5px] border-[1px] border-slate300 py-5 px-5 '>
                <div className='flex items-end gap-3'>
                <div>
                  <div className="avatar placeholder">
                    <div className="bg-slate-400 text-neutral-content w-24 rounded-full">
                       <span className="text-3xl text-white">{userInfo?.fullName[0]}</span>
                    </div>
                  </div>
                </div>

                    <div className='mb-3'>
                        <div className='font-bold text-xl'>{userInfo?.fullName}</div>
                        <div className='text-slate-500'>{userInfo?.role}</div>
                    </div>

                </div>

                 <div className='mt-7'>
                    <div className='text-slate-800 font-medium'>
                    Hello {userInfo?.fullName}, Based on your goals and aspirations, best Next Learning Objectives to revise:

                     <div className='mt-7 font-light'>
                       
                     </div>

                    
                    </div>
                </div> 

                {/* <div className='mt-7 w-full'>
                    <button onClick={handleUpdate} className='btn w-full bg-blue-600 text-white'>
                        {
                            userInfo?.bio ? 'Update Bio' : 'Submit'
                        }
                        
                        </button>
                </div> */}
           
            </div>
            
        </div>
        
    </div>
  )
}

export default Index
