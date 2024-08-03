import React,{useState} from 'react'
import { useSelector } from 'react-redux'
import { useUpdateBioMutation} from '../../features/api/apiSlice';

const Index = () => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const [updateBio, { isLoading }] = useUpdateBioMutation();

    const [bio, setBio] = useState()

    console.log(bio)

    const handleUpdate = async () => {
        try {
         const res =  await updateBio({ id:userInfo?._id, bio: bio }).unwrap();
         console.log(res)
         if(res.status === true){
          alert('Bio updated successfully')
        
         }
        } catch (error) {
          console.error('Error updating pass score:', error);
          alert(error)
        }
      };
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
                    Hello {userInfo?.fullName}, so great to have you here! I'm excited to get to know you better. Can you tell me a bit more about yourself? what are your
                     passions and dreams? What do you love to do in your free time? And what are your goals and aspirations for the future? I'm all ears!

                     <div className='mt-7 font-light'>
                        {
                            userInfo?.bio && ( <>My Bio data:  {userInfo?.bio}</> )
                        }
                     
                     </div>

                     <div className='mt-5'>
                     <textarea 
                     value={bio}
                     onChange={(e) => setBio(e.target.value)}
                      className="textarea textarea-bordered w-full min-h-[200px]" placeholder="your goals and aspirations"></textarea>
                     </div>
                    
                    </div>
                </div>

                <div className='mt-7 w-full'>
                    <button onClick={handleUpdate} className='btn w-full bg-blue-600 text-white'>
                        {
                            userInfo?.bio ? 'Update Bio' : 'Submit'
                        }
                        
                        </button>
                </div>
           
            </div>
            
        </div>
        
    </div>
  )
}

export default Index
