import React, { useRef, useState } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
//import Cardone from '../components/cards/cardone';
import {
  useGetAllChildrenQuery,
  useUpdatePassScoreMutation,
  useUpdateNumberOfLearningObjectiveMutation,
  useAddSubjectPriorityMutation,
  useFindMyClassesQuery,
} from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { useAddChildMutation } from "../../features/api/apiSlice";

const ParentDashboard = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dialogRef = useRef(null);
  const [childlicense, setChildlicense] = useState("");
  const [currentData, setCurrentData] = useState("");
  const [passScore, setPassScore] = useState("");
  const [numberOfLearningObjectives, setNumberOfLearningObjectives] =
    useState("");
  const [studentId, setStudentId] = useState("");

  console.log(currentData);

  const { data, isLoading } = useGetAllChildrenQuery(userInfo?.childrenArray);
  const [updatePassScore, { isLoading: sisloading }] =
    useUpdatePassScoreMutation();
  const [updateNumberOfLearningObjective, { isLoading: sisloading2 }] =
    useUpdateNumberOfLearningObjectiveMutation();
  const [addChild, { isLoading: isAdding, error, isError }] =
    useAddChildMutation();
  const [addSubjectPriority, { isLoading: isAdding2 }] =
    useAddSubjectPriorityMutation();
  const { data: classes } = useFindMyClassesQuery(currentData);
  console.log("this is my data", classes);
  const [subject_id, setSubject_id] = useState("");
  const [subject_important_ranking, setSubject_important_ranking] =
    useState("");

  const handleSubmit = async () => {
    const payload = {
      id: userInfo?._id,
      childlicense,
    };
    const res = await addChild(payload);
    console.log(res);
    if (res.error) {
      alert(res.error.data.message);
      setChildlicense("");
      return dialogRef.current.close();
    }
    alert("child added successfully");
    setChildlicense("");
    dialogRef.current.close();
  };

  const handleUpdate = async () => {
    try {
      const res = await updatePassScore({
        id: currentData?.user?._id,
        passScore: passScore,
      }).unwrap();
      console.log(res);
      if (res.status === true) {
        alert("pass score updated successfully");
        return dialogRef.current.close();
      }
    } catch (error) {
      console.error("Error updating pass score:", error);
      alert(error);
    }
  };

  const handleUpdateNumberOfLearningObjective = async () => {
    try {
      const res = await updateNumberOfLearningObjective({
        id: currentData?.user?._id,
        numberOfLearningObjectives: numberOfLearningObjectives,
      }).unwrap();
      console.log(res);
      if (res.status === true) {
        alert("pass score updated successfully");
        return dialogRef.current.close();
      }
    } catch (error) {
      console.error("Error updating pass score:", error);
      alert(error);
    }
  };

  const AddSubjectPriority = async () => {
    const payload = {
      student_id: currentData,
      subject_id: subject_id,
      subject_important_ranking: subject_important_ranking,
    };
    try {
      const res = await addSubjectPriority(payload).unwrap();
      if (res.status === true) {
        alert("subject priority added successfully");
        return dialogRef.current.close();
      }
    } catch (error) {
      console.error("Error adding subject priority:", error);
      console.log("herre", error.data);
      if (error.status) {
        alert(error.data.message);
        return dialogRef.current.close();
      }
      alert(error);
      return dialogRef.current.close();
    }
  };

  return (
    <div className="min-w-screen lg:max-w-[100%] px-8 py-5">
      <dialog id="my_modal_3" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Link a child</h3>

          <div className="mt-4">
            <div className="font-medium py-2">License code</div>
            <label className="input input-bordered flex items-center gap-2">
              <input
                value={childlicense}
                disabled={isAdding}
                onChange={(e) => setChildlicense(e.target.value)}
                type="text"
                className="w-full"
                placeholder="Enter license code"
              />
            </label>
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} className="btn min-w-full">
              {isAdding ? (
                <div className="flex justify-center">Loading...</div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_4" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Update child minimum score</h3>

          <div className="mt-4">
            <div className="font-medium py-2">Minimum score</div>
            <label className="input input-bordered flex items-center gap-2">
              <input
                value={passScore}
                disabled={sisloading}
                onChange={(e) => setPassScore(e.target.value)}
                type="text"
                className="w-full"
                placeholder="Enter license code"
              />
            </label>
          </div>

          <div className="mt-4">
            <button onClick={handleUpdate} className="btn min-w-full">
              {sisloading ? (
                <div className="flex justify-center">Loading...</div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_5" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            Update Number of learning objective
          </h3>

          <div className="mt-4">
            <div className="font-medium py-2">Number</div>
            <label className="input input-bordered flex items-center gap-2">
              <input
                value={numberOfLearningObjectives}
                disabled={sisloading}
                onChange={(e) => setNumberOfLearningObjectives(e.target.value)}
                type="text"
                className="w-full"
                placeholder="Enter a number"
              />
            </label>
          </div>

          <div className="mt-4">
            <button
              onClick={handleUpdateNumberOfLearningObjective}
              className="btn min-w-full"
            >
              {sisloading2 ? (
                <div className="flex justify-center">Loading...</div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_6" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add subject priority</h3>

          <div className="mt-4">
            <div className="font-medium py-2">Select Student</div>
            <select
              disabled={isLoading}
              onChange={(e) => setCurrentData(e.target.value)}
              className="select select-bordered w-full"
            >
              <option disabled selected>
                Select Student
              </option>
              {data?.map((i, index) => (
                <option value={i?.user._id} key={index}>
                  {i?.user.fullName}
                </option>
              ))}
            </select>
          </div>

          {classes == undefined ? null : (
            <>
              <div className="mt-4">
                <div className="font-medium py-2">Select Subject</div>
                <select
                  disabled={isLoading}
                  onChange={(e) => setSubject_id(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option disabled selected>
                    Select Subject
                  </option>
                  {classes?.classes?.map((i, index) => (
                    <option value={i?._id} key={index}>
                      {i?.classTitle.split(" ")[3]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <div className="font-medium py-2">Subject Ranking</div>
                <select
                  onChange={(e) => setSubject_important_ranking(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option disabled selected>
                    Select subject ranking
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </>
          )}

          <div className="mt-4">
            <button onClick={AddSubjectPriority} className="btn min-w-full">
              {sisloading2 ? (
                <div className="flex justify-center">Loading...</div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </div>
      </dialog>

      <div>
        <h2 className="text-slate900  text-[20px] font-[600]">
          Parent Dashboard
        </h2>
      </div>
      <div className="flex flex-row justify-end mb-5 gap-4">
        <button
          onClick={() => document.getElementById("my_modal_6").showModal()}
          className="btn bg-blue-600 font-normal text-white hover:bg-black "
        >
          Add Subject priority
        </button>
        <button
          onClick={() => document.getElementById("my_modal_3").showModal()}
          className="btn bg-blue-600 font-normal text-white hover:bg-black "
        >
          Link a child
        </button>
      </div>

      <div className="lg:flex lg:flex-row">
        <div className="overflow-x-auto min-w-full max-w-full">
          <table className="table min-w-full">
            {/* head */}
            <thead>
              <tr>
                <th>Name</th>

                <th>License Code</th>
                <th>Quiz taken</th>
                <th>Minumum score</th>
                <th>learning objectives</th>
                <th>Update minumum score</th>
                <th>Update number of learning objectives </th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}

              {data?.map((i, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-slate-400 text-neutral-content w-10 rounded-full">
                            <span className="">
                              {i.user?.fullName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{i.user?.fullName}</div>
                        </div>
                      </div>
                    </td>

                    <td>{i.user?.license}</td>
                    <td>{i.quizResults.length}</td>
                    <td>{i.user?.passScore} %</td>
                    <td>{i?.user?.numberOfLearningObjectives}</td>

                    <th>
                      <button
                        onClick={() => {
                          document.getElementById("my_modal_4").showModal(),
                            setCurrentData(i);
                        }}
                        className="btn btn-ghost btn-xs"
                      >
                        Update minimum score
                      </button>
                    </th>

                    <th>
                      <button
                        onClick={() => {
                          document.getElementById("my_modal_5").showModal(),
                            setCurrentData(i);
                        }}
                        className="btn btn-ghost btn-xs"
                      >
                        Update Number of learning objectives
                      </button>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
