import RReact, {useState, useRef} from 'react'
import { useCreateClassRoomMutation, useGetAllClassRoomsQuery, useDeleteClassRoomMutation } from "../../features/api/apiSlice"
import { useSelector } from "react-redux"


const Index = ()=>{
    const [createClassRoom, {isLoading, data}] = useCreateClassRoomMutation()
    const {data: classRooms, isLoading: isLoadingClassRooms} = useGetAllClassRoomsQuery()
    const [deleteClassRoom, { isLoading: isDeleting }] = useDeleteClassRoomMutation();
    const userInfo = useSelector((state) => state.user.userInfo);
    const dialogRef = useRef(null);
    


    console.log("all class rooms", classRooms)
      
    const[classRoomName, setClassRoomName] = useState()
    const[subject, setSubject] = useState()

    const handleSubmit = async()=>{
        const payload = {
            accountId:userInfo?.accountId,
            classRoomName,
            subject
        }
        try {
          const response =  await createClassRoom(payload).unwrap()
          console.log(response)
            if(response.status){
                dialogRef.current.close()
              return  alert(response.message)
            }
            alert(response.message)
            dialogRef.current.close();


        }catch(error){
            console.log(error)
        }

    }

    const handleDelete = async (id) => {
        // add a confirm pop
        if (window.confirm("Are you sure you want to delete this class room?, this action can not be undone, also not that all the paticipants in this class will be deleted too")) {
            try {
            const response = await deleteClassRoom(id).unwrap();
            console.log(response);
            if (response.status) {
                alert(response.message);
            }
        } catch (error) {
            console.log(error);
        } 
        }
       
    };

    return(
        <>
        {/* create class modal */}
       
        <dialog id="my_modal_3" className="modal" ref={dialogRef}>
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Create a new Classroom</h3>

    <div className="mt-4">
       <label className="form-control w-full min-w-full">
        <div className="label">
           <span className="label-text font-medium">Classroom Name</span>
        </div>
           <input 
           value={classRoomName}
           disabled={isLoading}
           onChange={(e) => setClassRoomName(e.target.value)}
           
           type="text" placeholder="Class name e.g Jss 1 A" className="input input-bordered  min-w-full" />
 
         </label>
    </div>
    <div className="mt-4">
    <label className="form-control w-full min-w-full">
  <div className="label">
    <span className="label-text font-medium">Select A Subject</span>
  </div>
  <select  disabled={isLoading}   onChange={(e) => setSubject(e.target.value)} className="select select-bordered">
    <option disabled selected>Pick one below</option>
    <option value="Mathematics">Mathematics</option>
    <option value="English">English</option>
    <option value="Biology">Biology</option>
    <option value="Chemistry">Chemistry</option>
    <option value="Physic">Physis</option>
  </select>
</label>
    </div>

    <div className="mt-4">
        <button onClick={handleSubmit} className="btn min-w-full">
           {
            isLoading ? ( <div className="flex justify-center">Loading...</div>) : 
            "Create Class"
           } 
        </button>

    </div>

    
  </div>
         </dialog>


         <div className="flex flex-row justify-end mb-5">
            <button onClick={()=>document.getElementById('my_modal_3').showModal()} className="btn ">
                 Create Classroom
            </button>
            </div>
             {
                classRooms?.length > 0 ? (
                    <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
       
        <th>Classroom Name</th>
        <th>Number of Students in class</th>
        <th>Number of Teachers in class</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}

      {
        classRooms?.map((i, index)=>{
            return(
                <tr key={index}>
        <td>
          <div className="flex items-center gap-3">
            
            <div>
              <div className="font-bold">{i.classTitle}</div>
            </div>
          </div>
        </td>
        <td>
          {i.numberOfStudents.length}
        </td>
        <td>
            {i.numberOfTeachers.length}
        </td>
        <th>
          {/* <button className="btn btn-ghost btn-xs">Edit</button> */}
          <button 
          onClick={() => handleDelete(i._id)}
           className="btn btn-ghost btn-xs">Delete</button>
        </th>
      </tr> 
            )
        })
      }

    </tbody>
  </table>
</div>
                ) : (<div className="flex justify-center items-center"> No Classroom created yet </div> )
             }
            
        </>
       
    )
}

export default Index