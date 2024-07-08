

import React, { useState, useRef } from 'react';
import {useFindAllQuizQuery, useGetAllClassRoomByAccountIdQuery, useJoinClassMutation, useFindMyClassesTeacherQuery, useFindAllObjectivesQuery, useCreateQuizMutation } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import Books from '../../assets/books.jpg'
import { LuUserPlus } from "react-icons/lu";
import { useLocation } from 'react-router-dom';

const TeacherRoom = (props) => {
  let { state } = useLocation();
  console.log("this is state",state?.data)
 
  
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: classes } = useGetAllClassRoomByAccountIdQuery(userInfo?.accountId);
  const { data: allObjectives, isLoading: isLoadingObjectives } = useFindAllObjectivesQuery();
  const [createQuiz, {isLoading:isLoadingQuiz}] = useCreateQuizMutation()
  const { data: myClasses } = useFindMyClassesTeacherQuery(userInfo._id);
  const {data:AllQuiz } = useFindAllQuizQuery()

  console.log("here me", AllQuiz)


  const [joinClass, { isLoading }] = useJoinClassMutation();
  const dialogRef = useRef(null);
  const [classesData, setClassesData] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState('');
  const [search, setSearch] = useState('');
  const [filteredObjectives, setFilteredObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [topic, setTopic] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [classRoomName, setClassRoomName] = useState()
  const [classId, setClassId] = useState()
 

  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   setSearch(value);
  //   if (value.trim() === '') {
  //     setFilteredObjectives([]);
  //   } else {
  //     const filtered = allObjectives?.filter((objective) =>
  //       objective?.objective?.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setFilteredObjectives(filtered);
  //   }
  // };

  console.log(classRoomName)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  
    if (value.trim() === '') {
      setFilteredObjectives([]);
    } else {
      const filtered = allObjectives?.filter((objective) => {
        const searchValue = value.toLowerCase();
        return (
          objective?.objective?.toLowerCase().includes(searchValue) ||
          objective?.category?.toLowerCase().includes(searchValue) ||
          objective?.topic?.toLowerCase().includes(searchValue) ||
          objective?.subject?.toLowerCase().includes(searchValue)
        );
      });
      setFilteredObjectives(filtered);
    }
  };

  const handleObjectiveSelect = (objective) => {
    console.log("this is it", objective)
    setSelectedObjective(objective);
    setSearch(objective?.objective);
    setFilteredObjectives([]);
  };

  const handleSubmit = async () => {

    // Submit handler logic
    const payload = {
      classRoomName:state?.data?.classTitle,
      classId:state?.data?._id,
      accountId:userInfo.accountId,
      objCode:selectedObjective?.objCode,
      objective:selectedObjective?.objective,
      category:selectedObjective?.category,
      subject:selectedObjective?.subject,
      topic:selectedObjective?.topic,
      numberOfQuestions,
      followUp,
      teacherId:userInfo?._id,
      teacherName:userInfo?.fullName,


    }

    const response = await createQuiz(payload)
    console.log(response)
    console.log("heere", payload)
    if(response.data.status === true){
      dialogRef.current.close();
      alert(response.data.message)
    }else{
      alert(response.data.message)
    }

    
  };

  return (
    <>
      {/* create class modal */}
      <dialog id="my_modal_3" className="modal" ref={dialogRef}>
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Create Quiz</h3>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
             

              <div className="label mt-4">
                <span className="label-text font-medium">Search learning outcome</span>
              </div>

              <label className="input input-bordered flex items-center gap-2 relative">
                <input
                  value={search}
                  onChange={handleSearchChange}
                  type="text"
                  className="w-full"
                  placeholder="Search"
                />
                {filteredObjectives.length > 0 && (
                  <ul className="absolute left-0 top-full bg-white border border-gray-300 w-full  overflow-y-auto">
                    {filteredObjectives.map((objective, index) => (
                      <li
                        key={index}
                        className="p-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleObjectiveSelect(objective)}
                      >
                        {objective?.objective}
                      </li>
                    ))}
                  </ul>
                )}
              </label>

              <div className="label mt-4">
                <span className="label-text font-medium">Number of questions</span>
              </div>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  type="text"
                  className="w-full"
                  placeholder="Number of questions"
                />
              </label>

              <div className="label mt-4">
                <span className="label-text font-medium">Describe follow-up learning activities</span>
              </div>
              <textarea
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="Describe follow-up learning activities"
                className="textarea textarea-bordered textarea-lg w-full max-w-full min-w-full"
              ></textarea>
            </label>
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} className="btn min-w-full">
              {isLoading ? <div className="flex justify-center">Loading...</div> : 'Create Quiz'}
            </button>
          </div>
        </div>
      </dialog>

      <div className="flex flex-row justify-end mb-5">
        <button onClick={() => document.getElementById('my_modal_3').showModal()} className="btn">
          Create a quiz
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {
          AllQuiz?.map((i, index)=>{
            return(
                <div className="">
          <div className="card bg-white border-2 border-slate-300 text-primary-content w-96">
            <div className="card-body px-3 py-3">
              <img src={Books} className=' h-[200px] rounded-md'/>
              <h2 className="card-title text-slate-950">{i?.subject}</h2>
              <p className="text-slate-800">Topic: {i?.topic}</p>
              <div className="text-slate-950"></div>
              <div className="card-actions justify-start">
                <div className='flex-row flex'>
                   <div className="avatar">
                  <div className="w-[50px] rounded-xl">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                 </div>
                  </div>
                  <div className='px-3 justify-center'>
                    <div className='text-slate-800 font-semibold text-[18px]'>{i?.teacherName}</div>
                    <div className='text-slate-800 font-semibold text-[14px]'>{i?.classRoomName}</div>
                  </div>
                  
                </div>
             
              </div>
            </div>
          </div>
        </div>
            )
          })
        }
      
      </div>
    </>
  );
};

export default TeacherRoom;
