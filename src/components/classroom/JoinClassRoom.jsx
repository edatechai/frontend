import RReact, {useState, useRef} from 'react'
import {  useGetAllClassRoomByAccountIdQuery, useJoinClassMutation, useFindMyClassesQuery, useGetQuizResultByUserIdQuery } from "../../features/api/apiSlice"
import { useSelector } from "react-redux"
import { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { FaChartPie } from "react-icons/fa";
import { MdOutlineInsertChartOutlined } from "react-icons/md";
import { FiCheckSquare } from "react-icons/fi";
import StrengthsAndweaknesses from '../Analysis/strengthsAndweaknesses';


const Index = ()=>{
    
    const userInfo = useSelector((state) => state.user.userInfo);
    const {data: classes} = useGetAllClassRoomByAccountIdQuery(userInfo?.accountId)
    const {data:myClasses} = useFindMyClassesQuery(userInfo._id)
    const {
      data: quizResult,
      isLoading: quizResultLoading,
      isSuccess: quizResultSuccess,
      isError: quizResultError,

    } = useGetQuizResultByUserIdQuery(userInfo._id)

    console.log("all here",quizResult)

    const [joinClass, {isLoading}] = useJoinClassMutation()
    const dialogRef = useRef(null);
    const [classesData, setClassesData] = useState([])



    console.log("my classes", myClasses)
    

    const[classRoom, setClassRoom] = useState()

    const handleSubmit = async()=>{
        console.log("this is data", classRoom)
    // filter classes where clesses id is classRoom
    const filteredClasses = classes?.filter((item)=>item._id === classRoom)
    console.log("filtered classes", filteredClasses[0])
    const payload ={
        classId:filteredClasses[0]._id,
        ...userInfo
    }
    console.log(payload)

    try{
 const response = await joinClass(payload)
    response
    console.log(response)
    if(response.data.status === false){
        dialogRef.current.close();
      return  alert(response.data.message)
    }

    if(response.data.status === true){
        dialogRef.current.close();
        return  alert(response.data.message)
    }
    }catch(error){
        alert(error)
    }

    }


    return(
        <>
        {/* create class modal */}
       
        <dialog id="my_modal_3" className="modal" ref={dialogRef}>
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Join a classroom</h3>

    <div className="mt-4">
    <label className="form-control w-full min-w-full">
  <div className="label">
    <span className="label-text font-medium">Select a classroom</span>
  </div>

  <select 
//   disabled={isLoading} 
  onChange={(e) => setClassRoom(e.target.value)} className="select select-bordered">
    <option disabled selected>Pick one below</option>
    {classes?.map((i, index) => (
        // <option key={index} value={classItem}>{classItem}</option>
        <option value={i._id} key={index}>{i?.classTitle}</option>
    ))}
</select>


</label>
    </div>

    <div className="mt-4">
        <button onClick={handleSubmit} className="btn min-w-full">
           {
            isLoading ? ( <div className="flex justify-center">Loading...</div>) : 
            "Join Classroom"
           } 
        </button>

    </div>

    
  </div>
         </dialog>


         <div className='min-w-[100%] max-w-[100%] mb-5 mt-10'>
             <StrengthsAndweaknesses myClasses={myClasses} quizResult={quizResult} />
            </div>


         <div className="flex flex-row justify-end mb-5">
            <button onClick={()=>document.getElementById('my_modal_3').showModal()} className="btn bg-blue-600 font-normal text-white hover:bg-black ">
                 Join a class
            </button>
            </div>
            
            
            <div className='flex flex-row justify-between'>
                <div className='px-2 min-w-[70%]'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2'>
    {
        myClasses?.classes?.map((i, index) => {
            return (
                <div key={index} className="">
                    <div className="card bg-white text-primary-content lg:w-[100%] lg:h-[250px] p-3  ">
                        <div className="card-body lg:px-3 px-3  ">
                            <h2 className="card-title text-green-700 p-2 bg-green-50 text-sm lg:text-lg rounded-sm font-normal">{i?.classTitle}</h2>
                            <p className='text-slate-800'>Welcome to {i?.classTitle}</p>
                            <div className="card-actions justify-end lg:justify-start  mt-3">
                            <Link
                                to="/dashboard/class-room" 
                                state={{ data: i?._id }} 
                                 >
                                   <button className="btn bg-blue-600 font-normal text-white hover:bg-black">Enter Classroom</button> 
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }
</div>
     

                </div>
                <div className='lg:px-5 w-full'>
                    <div className=''>
                    
                        <div className='flex flex-row justify-between gap-2'>
                            <div className='card card-body bg-white flex flex-row items-center px-2 py-2'>
                                <div className='h-10 w-10 justify-center items-center flex bg-blue-100 rounded-full'>
                                  <FaChartPie className='text-blue-700' />  
                                </div>
                                <div>
                                    <div className=' text-slate-500'>Completed Quiz</div>
                                    <p className='text-lg'>{quizResult?.data.length}</p>
                                </div>
                            
                            </div>
                            <div className='card card-body bg-white flex flex-row items-center px-2 py-2'>
                                <div className='h-10 w-10 justify-center items-center flex bg-green-100 rounded-full'>
                                  <MdOutlineInsertChartOutlined className='text-green-700' />  
                                </div>
                                <div>
                                    <div className=' text-slate-500'>Total Score</div>
                                    <p className='text-lg'>{myClasses?.classes?.length}</p>
                                </div>
                            
                            </div>

                        </div>

       <div className='py-5'>
        <div className='flex flex-row justify-between'>
        <div>Quiz taken</div>
        <div>View all</div>

        </div>

        {
          quizResultLoading ? ( <div className="skeleton h-20 w-full"></div>
        ) :(

          <>
          {
            quizResult?.data.length > 0 ? (
              
              <>
              {
                quizResult?.data.map((item, index) => {
                  return (
                      <div key={index} className="collapse collapse-plus bg-white mt-2 mb-2">
          <input type="radio" name="my-accordion-3" defaultChecked />
          <div className="collapse-title text-xl font-medium">
             <div className='flex items-center'>
                <div className='h-10 w-10 rounded-md bg-blue-600 flex justify-center items-center'>
                <FiCheckSquare className='text-white' />
                </div>
                <div className='px-3'>
                    <div className='text-slate-500 text-[14px] '>{item?.category}</div>
                    <div className='text-sm'>Score :{item?.scorePercentage}</div>
                </div>
             </div>
            </div>
          <div className="collapse-content">
            {
              item?.quizResults?.map((i, index)=>{
                return (
                  <div key={index}>
                  <p className='py-3 font-medium'>Question: {i?.question}</p>
                  <p>Correct Option : {i.correctAnswer}</p>
                  <p>Correct Answer : {i.correctOption}</p>
                  <p>Your Answer : {i.selectedAnswer}</p>
                  {
                    i?.isCorrect ? (<div className='font-medium text-green-600'> Your answer is correct</div>) : (<div className='font-medium text-red-500'>Your answer is wrong</div>)
                  }
                  {
                    !i?.isCorrect ? ( <div className='mt-3'>
                    <p className='text-slate-900 font-medium '>Mistake Analysis</p>
                    <div className='flex flex-row gap-2'>
                     <p>
                       {
                        i?.analysis
                       }
                       <div className="divider"></div>
                     </p>
                    
                    </div>
            
                </div>): (<div className="divider"></div>)
                  }
                 
                  </div>

                )
              })
            }
           
           
          </div>
        </div>

                  )
                })
              }
              </>
              
              ): (<div>No Data found </div>)
          }
          
          </>

          
        
        )
        }
       

      







       </div>    
                    </div>
                </div>

            </div>


    
        </>
       
    )
}

export default Index