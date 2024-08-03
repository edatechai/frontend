import React, { useRef, useState } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
//import Cardone from '../components/cards/cardone';
import { useGetAllChildrenQuery, useUpdatePassScoreMutation } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { useAddChildMutation } from "../../features/api/apiSlice";

const ParentDashboard = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dialogRef = useRef(null);
  const [childlicense, setChildlicense] = useState("");
  const [currentData, setCurrentData] = useState('')
  const [passScore, setPassScore] = useState('')

  console.log(currentData)

  const { data, isLoading } = useGetAllChildrenQuery(userInfo?.childrenArray);
  const [updatePassScore, {isLoading:sisloading  }] = useUpdatePassScoreMutation();
  const [addChild, { isLoading: isAdding, error, isError }] =
    useAddChildMutation();
  console.log("this is my data", data);

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
     const res =  await updatePassScore({ id:currentData?.user?._id, passScore: passScore }).unwrap();
     console.log(res)
     if(res.status === true){
      alert('pass score updated successfully')
      return dialogRef.current.close();
     }
    } catch (error) {
      console.error('Error updating pass score:', error);
      alert(error)
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
                disabled={sisloading }
                onChange={(e) => setPassScore(e.target.value)}
                type="text"
                className="w-full"
                placeholder="Enter license code"
              />
            </label>
          </div>

          <div className="mt-4">
            <button onClick={handleUpdate} className="btn min-w-full">
              {sisloading  ? (
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
      <div className="flex flex-row justify-end mb-5">
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
                <th>Email</th>
                <th>License Code</th>
                <th>Quiz taken</th>
                <th>Minumum score</th>
                <th>Number of learning objectives</th>
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
                    <td>{i.user?.email}</td>
                    <td>{i.user?.license}</td>
                    <td>{i.quizResults.length}</td>
                    <td>{i.user?.passScore} %</td>
                    <td>{i?.user?.numberOfLearningObjectives}</td>
                    
                    <th>
                      <button  onClick={() =>{document.getElementById("my_modal_4").showModal(), setCurrentData(i)} } className="btn btn-ghost btn-xs">
                        Update minimum score
                      </button>
                    </th>

                    <th>
                      <button  onClick={() =>{document.getElementById("my_modal_4").showModal(), setCurrentData(i)} } className="btn btn-ghost btn-xs">
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
