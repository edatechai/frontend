import RReact, {useState, useRef} from 'react'
import {  useDeleteObjectiveMutation, useCreateObjectiveMutation, useFindAllObjectivesQuery, useUploadObjectiveMutation} from "../../features/api/apiSlice"
import { useSelector } from "react-redux"
import axios from 'axios'


const Index = ()=>{
    const [createObjective, {isLoading, data}] = useCreateObjectiveMutation()
    const { data: allObjectives,isLoading: isLoadingObjectives } = useFindAllObjectivesQuery()
    const [uploadObjective, { isLoading:uploading, error }] = useUploadObjectiveMutation();
   // const {data: classRooms, isLoading: isLoadingClassRooms} = useGetAllClassRoomsQuery()
     const [deleteObjective, { isLoading: isDeleting }] = useDeleteObjectiveMutation();
    const userInfo = useSelector((state) => state.user.userInfo);
    const dialogRef = useRef(null);
    

   // console.log("all class rooms", classRooms)
      
   // const[classRoomName, setClassRoomName] = useState()
   

    const[objCode, setObjCode] = useState('')
    const[category, setCategory] = useState('')
    const[topic, setTopic] = useState('')
    const[objective, setObjective] = useState('')
    const[subject, setSubject] = useState('')
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async()=>{
        const payload = {
            subject,
            objCode,
            category,
            objective,
            topic
        }
        try {
          const response =  await createObjective(payload).unwrap()
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
        if (window.confirm("Are you sure you want to delete this Objective?, this action can not be undone")) {
            try {
            const response = await deleteObjective(id).unwrap();
            console.log(response);
            if (response.status) {
                alert(response.message);
            }
        } catch (error) {
            console.log(error);
        } 
        }
       
    };



   

    const handleUpload = async () => {

      if (!file) return alert('please upload a csv file');
  
      const payload = { file };

  
      try {
        
        await uploadObjective(payload).unwrap();
        alert("Objective uploaded successfully");
       // console.log('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file', error);
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
    <h3 className="font-bold text-lg">Create Learning objective</h3>

    <div className="mt-4">
       <label className="form-control w-full min-w-full">
        <div className="label">
           <span className="label-text font-medium">Object Code</span>
        </div>
           <input 
           value={objCode}
           disabled={isLoading}
           onChange={(e) => setObjCode(e.target.value)}
           
           type="text" placeholder="Objective code" className="input input-bordered  min-w-full" />
 
         </label>
    </div>

    <div className="mt-4">
       <label className="form-control w-full min-w-full">
        <div className="label">
           <span className="label-text font-medium">Subject</span>
        </div>
           <input 
           value={subject}
           disabled={isLoading}
           onChange={(e) => setSubject(e.target.value)}
           
           type="text" placeholder="Subject" className="input input-bordered  min-w-full" />
 
         </label>
    </div>

    <div className="mt-4">
       <label className="form-control w-full min-w-full">
        <div className="label">
           <span className="label-text font-medium">Category</span>
        </div>
           <input 
           value={category}
           disabled={isLoading}
           onChange={(e) => setCategory(e.target.value)}
           
           type="text" placeholder="Category" className="input input-bordered  min-w-full" />
 
         </label>
    </div>

    <div className="mt-4">
       <label className="form-control w-full min-w-full">
        <div className="label">
           <span className="label-text font-medium">Topic</span>
        </div>
           <input 
           value={topic}
           disabled={isLoading}
           onChange={(e) => setTopic(e.target.value)}
           
           type="text" placeholder="Topic" className="input input-bordered  min-w-full" />
 
         </label>
    </div>

    <div className="mt-4">
       <label className="form-control w-full min-w-full">
        <div className="label">
           <span className="label-text font-medium">Objective</span>
        </div>
           <input 
           value={objective}
           disabled={isLoading}
           onChange={(e) => setObjective(e.target.value)}
           
           type="text" placeholder="Objective" className="input input-bordered  min-w-full" />
 
         </label>
    </div>

    
   

    <div className="mt-4">
        <button onClick={handleSubmit} className="btn min-w-full">
           {
            isLoading ? ( <div className="flex justify-center">Loading...</div>) : 
            "Add learning objective"
           } 
        </button>

    </div>

    
  </div>
         </dialog>


         <div className="flex flex-row justify-end mb-5">
          {/* <div className='px-5'>
            <input type="file" className="file-input file-input-bordered file-input-md w-full max-w-xs" />
          </div> */}

          {uploading 
          ? ( <div className="flex justify-center">Uploading...</div>) 
          : null
          }

         <div className='flex px-5 gap-2 '>
            <input type="file" className="file-input file-input-bordered file-input-md w-full max-w-xs"  onChange={handleFileChange} />
            <button className='btn' onClick={handleUpload}>bulk upload</button>
        </div>
         
            <button onClick={()=>document.getElementById('my_modal_3').showModal()} className="btn ">
                 Create learning objectives
            </button>
            </div>

            
             {
                allObjectives?.length > 0 ? (
                    <div className="overflow-x-auto">
  <table className="table">
  
    <thead>
      <tr>
       
        <th>Objective Code</th>
        <th>Subject</th>
        <th>Category</th>
        <th>Topic</th>
        <th>Objective</th>

      </tr>
    </thead>
    <tbody>
  

      {
        allObjectives?.map((i, index)=>{
            return(
                <tr key={index}>
        <td>
          <div className="flex items-center gap-3">
            
            <div>
              <div className="font-bold">{i.objCode}</div>
            </div>
          </div>
        </td>
        <td>
          {i.subject}
        </td>
        <td>
            {i.category}
        </td>
        <td>
            {i.topic}
        </td>
        <td>
            {i.objective}
        </td>
        <th>
        
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
                ) : (<div className="flex justify-center items-center"> No classes created yet </div> )
             }
            
        </>
       
    )
}

export default Index