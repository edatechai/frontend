// import React, {useState, useRef} from 'react'
// import { useSelector } from "react-redux"
// import {   useFindAllObjectivesQuery, useCreateQuestionMutation, useFindAllQuestionsQuery, useDeleteQuestionMutation, useUploadQuestionMutation} from "../../features/api/apiSlice"


// const Index = ()=>{
//     const [objCode, setObjCode] = useState('')
//     const [question, setQuestion] = useState('')
//     const [questionImage, setQuestionImage] = useState('')
//     const [optionA, setptionA] = useState('')
//     const [optionB, setOptionB] = useState('')
//     const [optionC, setOptionC] = useState('')
//     const [optionD, setOptionD] = useState('')
//     const [answer, setAnswer] = useState('')
   
//     const { data: allObjectives} = useFindAllObjectivesQuery()
//     const [createQuestion, {isLoading}] = useCreateQuestionMutation()
//     const {data: allQuestions} = useFindAllQuestionsQuery()
//     const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();
//     const [uploadQuestion, { isLoading:uploading, error }] = useUploadQuestionMutation();

//     const [file, setFile] = useState(null);

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };
    

//     console.log("this is question", allQuestions)

//     const dialogRef = useRef(null);

//     const handleSubmit = async()=>{
//       const payload = {
//           objCode,
//           question,
//           questionImage,
//           optionA,
//           optionB,
//           optionC,
//           optionD,
//           answer 
//       }
//       try {
//         const response =  await createQuestion(payload).unwrap()
//         console.log(response)
//           if(response.status){
//               dialogRef.current.close()
//             return  alert(response.message)
//           }
//           alert(response.message)
//           dialogRef.current.close();


//       }catch(error){
//           console.log(error)
//       }

//   }

//   const handleDelete = async (id) => {
//    // add a confirm pop
//    if (window.confirm("Are you sure you want to delete this question?, this action can not be undone")) {
//        try {
//        const response = await deleteQuestion(id).unwrap();
//        console.log(response);
//        if (response.status) {
//            alert(response.message);
//        }
//    } catch (error) {
//        console.log(error);
//    } 
//    }
  
// };


// const handleUpload = async () => {

//    if (!file) return alert('please upload a csv file');

//    const payload = { file };


//    try {
     
//      await uploadQuestion(payload).unwrap();
//      alert("Objective uploaded successfully");
//     // console.log('File uploaded successfully');
//    } catch (error) {
//      console.error('Error uploading file', error);
//    }
//  };


//    return(
//     <>

// <dialog id="my_modal_4" className="modal" ref={dialogRef}>
//   <div className="modal-box">
//     <form method="dialog">
//       <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
//     </form>
//     <h3 className="font-bold text-lg">Create Learning objective</h3>

//     <div className="mt-4">
//        <label className="form-control w-full min-w-full">
//         <div className="label">
//            <span className="label-text font-medium">Object Code</span>
//         </div>
//         <select  disabled={isLoading}   onChange={(e) => setObjCode(e.target.value)} className="select select-bordered w-full min-w-full">
//             <option disabled selected>Select an object code </option>
//             {
//                allObjectives?.map((obj, index) => {
//                   return <option key={index} value={obj.objCode}>{obj.objCode}</option>

//                })
//             }
//           </select>
         
 
//          </label>
//     </div>
   

//     <div className="mt-4">
//        <label className="form-control w-full min-w-full">
//         <div className="label">
//            <span className="label-text font-medium">Question</span>
//         </div>
//            <input 
//            value={question}
//            disabled={isLoading}
//            onChange={(e) => setQuestion(e.target.value)}
           
//            type="text" placeholder="Subject" className="input input-bordered  min-w-full" />
 
//          </label>
//     </div>

//     <div className="mt-4">
//        <label className="form-control w-full min-w-full">
//         <div className="label">
//            <span className="label-text font-medium">Option A</span>
//         </div>
//            <input 
//            value={optionA}
//            disabled={isLoading}
//            onChange={(e) => setptionA(e.target.value)}
           
//            type="text" placeholder="Option A" className="input input-bordered  min-w-full" />
 
//          </label>
//     </div>

//     <div className="mt-4">
//        <label className="form-control w-full min-w-full">
//         <div className="label">
//            <span className="label-text font-medium">Option B</span>
//         </div>
//            <input 
//            value={optionB}
//            disabled={isLoading}
//            onChange={(e) => setOptionB(e.target.value)}
           
//            type="text" placeholder="Option B" className="input input-bordered  min-w-full" />
 
//          </label>
//     </div>

//     <div className="mt-4">
//        <label className="form-control w-full min-w-full">
//         <div className="label">
//            <span className="label-text font-medium">Option C</span>
//         </div>
//            <input 
//            value={optionC}
//            disabled={isLoading}
//            onChange={(e) => setOptionC(e.target.value)}
           
//            type="text" placeholder="Option C" className="input input-bordered  min-w-full" />
 
//          </label>
//     </div>

//     <div className="mt-4">
//        <label className="form-control w-full min-w-full">
//         <div className="label">
//            <span className="label-text font-medium">Option D</span>
//         </div>
//            <input 
//            value={optionD}
//            disabled={isLoading}
//            onChange={(e) => setOptionD(e.target.value)}
           
//            type="text" placeholder="Option D" className="input input-bordered  min-w-full" />
 
//          </label>
//     </div> 

//     <div className="mt-4">
//        <label className="form-control w-full min-w-full">
//         <div className="label">
//            <span className="label-text font-medium">Right answer</span>
//         </div>
//            <input 
//            value={answer}
//            disabled={isLoading}
//            onChange={(e) => setAnswer(e.target.value)}
           
//            type="text" placeholder="Right Answer" className="input input-bordered  min-w-full" />
 
//          </label>
//     </div>

//     <div className="mt-4">
//         <button onClick={handleSubmit} className="btn min-w-full">
//            {
//             isLoading ? ( <div className="flex justify-center">Loading...</div>) : 
//             "Create a question"
//            } 
//         </button>

//     </div>
   
    
//   </div>
//          </dialog>

         
//          <div className="flex flex-row justify-end mb-5">

//          {uploading 
//           ? ( <div className="flex justify-center">Uploading...</div>) 
//           : null
//           }

//          <div className='flex px-5 gap-2 '>
//             <input type="file" className="file-input file-input-bordered file-input-md w-full max-w-xs"  onChange={handleFileChange} />
//             <button className='btn' onClick={handleUpload}>bulk upload</button>
//         </div>


//             <button onClick={()=>document.getElementById('my_modal_4').showModal()} className="btn ">
//                  Create a new question
//             </button>
//          </div>



//     <div className='min-w-full w-full'>
//     {
//                 allQuestions?.length > 0 ? (
//                     <div className="overflow-x-auto w-full">
//   <table className="table">
  
//     <thead>
//       <tr>
       
//         <th>Objective Code</th>
//         <th>Question</th>
//         <th>Option A</th>
//         <th>Option B</th>
//         <th>Option C</th>
//         <th>Option D</th>
//         <th>Right Answer</th>

//       </tr>
//     </thead>
//     <tbody>
  

//       {
//         allQuestions?.map((i, index)=>{
//             return(
//                 <tr key={index}>
//         <td>
//           <div className="flex items-center gap-3">
            
//             <div>
//               <div className="font-bold">{i.objCode}</div>
//             </div>
//           </div>
//         </td>
//         <td>
//           {i.question}
//         </td>
//         <td>
//             {i.optionA}
//         </td>
//         <td>
//             {i.optionB}
//         </td>
//         <td>
//             {i.optionC}
//         </td>
//         <td>
//             {i.optionD}
//         </td>
//         <td>
//             {i.answer}
//         </td>
//         <th>
        
//           <button 
//           onClick={() => handleDelete(i._id)}
//            className="btn btn-ghost btn-xs">Delete</button>
//         </th>
//       </tr> 
//             )
//         })
//       }

//     </tbody>
//   </table>
// </div>
//                 ) : (<div className="flex justify-center items-center"> No questions created yet </div> )
//              }
//     </div>
    
//     </>
//    )
// }

// export default Index


import React, { useState, useRef } from 'react';
import { useSelector } from "react-redux";
import { 
  useFindAllObjectivesQuery, 
  useCreateQuestionMutation, 
  useFindAllQuestionsQuery, 
  useDeleteQuestionMutation, 
  useUploadQuestionMutation 
} from "../../features/api/apiSlice";

const Index = () => {
  const [objCode, setObjCode] = useState('');
  const [question, setQuestion] = useState('');
  const [questionImage, setQuestionImage] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [answer, setAnswer] = useState('');

  const { data: allObjectives } = useFindAllObjectivesQuery();
  const [createQuestion, { isLoading }] = useCreateQuestionMutation();
  const { data: allQuestions } = useFindAllQuestionsQuery();
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();
  const [uploadQuestion, { isLoading: uploading, error }] = useUploadQuestionMutation();

  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const dialogRef = useRef(null);

  const handleSubmit = async () => {
    const payload = {
      objCode,
      question,
      questionImage,
      optionA,
      optionB,
      optionC,
      optionD,
      answer
    };
    try {
      const response = await createQuestion(payload).unwrap();
      console.log(response);
      if (response.status) {
        dialogRef.current.close();
        return alert(response.message);
      }
      alert(response.message);
      dialogRef.current.close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      try {
        const response = await deleteQuestion(id).unwrap();
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
    if (!file) return alert('Please upload a CSV file.');

    const payload = { file };

    try {
      await uploadQuestion(payload).unwrap();
      alert("Objective uploaded successfully");
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const totalPages = Math.ceil(allQuestions?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuestions = allQuestions?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <dialog id="my_modal_4" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Create Learning Objective</h3>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">Objective Code</span>
              </div>
              <select 
                disabled={isLoading} 
                onChange={(e) => setObjCode(e.target.value)} 
                className="select select-bordered w-full min-w-full"
              >
                <option disabled selected>Select an objective code</option>
                {allObjectives?.map((obj, index) => (
                  <option key={index} value={obj.objCode}>{obj.objCode}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">Question</span>
              </div>
              <input 
                value={question}
                disabled={isLoading}
                onChange={(e) => setQuestion(e.target.value)}
                type="text" 
                placeholder="Question" 
                className="input input-bordered min-w-full" 
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">Option A</span>
              </div>
              <input 
                value={optionA}
                disabled={isLoading}
                onChange={(e) => setOptionA(e.target.value)}
                type="text" 
                placeholder="Option A" 
                className="input input-bordered min-w-full" 
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">Option B</span>
              </div>
              <input 
                value={optionB}
                disabled={isLoading}
                onChange={(e) => setOptionB(e.target.value)}
                type="text" 
                placeholder="Option B" 
                className="input input-bordered min-w-full" 
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">Option C</span>
              </div>
              <input 
                value={optionC}
                disabled={isLoading}
                onChange={(e) => setOptionC(e.target.value)}
                type="text" 
                placeholder="Option C" 
                className="input input-bordered min-w-full" 
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">Option D</span>
              </div>
              <input 
                value={optionD}
                disabled={isLoading}
                onChange={(e) => setOptionD(e.target.value)}
                type="text" 
                placeholder="Option D" 
                className="input input-bordered min-w-full" 
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">Right Answer</span>
              </div>
              <input 
                value={answer}
                disabled={isLoading}
                onChange={(e) => setAnswer(e.target.value)}
                type="text" 
                placeholder="Right Answer" 
                className="input input-bordered min-w-full" 
              />
            </label>
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} className="btn min-w-full">
              {isLoading ? (<div className="flex justify-center">Loading...</div>) : "Create a Question"}
            </button>
          </div>
        </div>
      </dialog>

      <div className="flex flex-row justify-end mb-5">
        {uploading ? (<div className="flex justify-center">Uploading...</div>) : null}
        <div className='flex px-5 gap-2 '>
          <input type="file" className="file-input file-input-bordered file-input-md w-full max-w-xs" onChange={handleFileChange} />
          <button className='btn' onClick={handleUpload}>Bulk Upload</button>
        </div>
        <button onClick={() => document.getElementById('my_modal_4').showModal()} className="btn">
          Create a New Question
        </button>
      </div>

      <div className='min-w-full w-full'>
        {allQuestions?.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="table">
              <thead>
                <tr>
                  <th>Objective Code</th>
                  <th>Question</th>
                  <th>Option A</th>
                  <th>Option B</th>
                  <th>Option C</th>
                  <th>Option D</th>
                  <th>Right Answer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentQuestions?.map((i, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="font-bold">{i.objCode}</div>
                      </div>
                    </td>
                    <td>{i.question}</td>
                    <td>{i.optionA}</td>
                    <td>{i.optionB}</td>
                    <td>{i.optionC}</td>
                    <td>{i.optionD}</td>
                    <td>{i.answer}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(i._id)}
                        className="btn btn-ghost btn-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn btn-sm"
              >
                Previous
              </button>
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center">No questions created yet</div>
        )}
      </div>
    </>
  );
};

export default Index;
