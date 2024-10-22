import React, { useState, useRef } from "react";
import {
  useGetAllClassRoomByAccountIdQuery,
  useQuizRandomSelectMutation,
  useFindAllQuizByIdQuery,
  useJoinClassMutation,
  useFindMyClassesTeacherQuery,
  useFindAllObjectivesQuery,
  useCreateQuizMutation,
} from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import Books from "../../assets/books.jpg";
import { LuUserPlus } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const StudentRoom = (props) => {
  let { state } = useLocation();
  //console.log("this is state for me",state?.data)

  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: classes } = useGetAllClassRoomByAccountIdQuery(
    userInfo?.accountId
  );
  const { data: allObjectives, isLoading: isLoadingObjectives } =
    useFindAllObjectivesQuery();
  const [createQuiz, { isLoading: isLoadingQuiz }] = useCreateQuizMutation();
  const { data: myClasses } = useFindMyClassesTeacherQuery(userInfo?._id);
  const { data: AllQuiz } = useFindAllQuizByIdQuery(state?.data);
  const [RandomSelect, { data }] = useQuizRandomSelectMutation();

  console.log("here me", AllQuiz);

  const [joinClass, { isLoading }] = useJoinClassMutation();
  const dialogRef = useRef(null);
  const [classesData, setClassesData] = useState([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [search, setSearch] = useState("");
  const [filteredObjectives, setFilteredObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [topic, setTopic] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [classRoomName, setClassRoomName] = useState();
  const [classId, setClassId] = useState();

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

  console.log(classRoomName);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
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
    // console.log("this is it", objective)
    setSelectedObjective(objective);
    setSearch(objective?.objective);
    setFilteredObjectives([]);
  };

  const handleSubmit = async () => {
    // Submit handler logic
    const payload = {
      classRoomName: state?.data?.classTitle,
      classId: state?.data?._id,
      accountId: userInfo.accountId,
      objCode: selectedObjective?.objCode,
      objective: selectedObjective?.objective,
      category: selectedObjective?.category,
      subject: selectedObjective?.subject,
      topic: selectedObjective?.topic,
      numberOfQuestions,
      followUp,
      teacherId: userInfo?._id,
      teacherName: userInfo?.fullName,
    };

    const response = await createQuiz(payload);
    console.log(response);
    //console.log("heere", payload)
    if (response.data.status === true) {
      dialogRef.current.close();
      alert(response.data.message);
    } else {
      alert(response.data.message);
    }
  };

  const handleRandomSelect = async (id) => {
    console.log("this is id", id);
    const payload = {
      objCode: id?.objCode,
      numberOfQuestions: id?.numberOfQuestions,
    };
    const response = await RandomSelect(payload);
    console.log("this is my real data", response.data);

    const newdata = {
      ...state?.data,
      questions: response.data,
    };
    // navigate to dashboard/quiz with newdata
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {AllQuiz?.map((i, index) => {
          return (
            <div key={index} className="">
              <div className="card bg-white border-2 border-slate-300 text-primary-content w-96">
                <div className="card-body px-3 py-3">
                  <img src={Books} className=" h-[200px] rounded-md" />
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="card-title text-slate-950">
                        {i?.subject}
                      </h2>
                    </div>
                    <div>
                      <p className="text-slate-950">
                        {i?.numberOfQuestions} questions
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-800">Topic: {i?.topic}</p>
                  <div className="text-slate-950"></div>
                  <div className="card-actions justify-end">
                    <div className="px-3 justify-center">
                      {/* <button onClick={()=>{
                      handleRandomSelect(i)
                    }} className="btn btn-primary">Take Quiz</button> */}
                      <Link
                        //</div> to="/dashboard/quiz"
                        to="/dashboard/quiz"
                        state={{ data: i }}
                      >
                        <button className="btn">Take Quiz</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {AllQuiz?.length === 0 && (
          <div className="text-center">No Quiz Found</div>
        )}
      </div>
    </>
  );
};

export default StudentRoom;
