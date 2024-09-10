import { useRef, useState } from "react";
import {
  useGetAllChildrenQuery,
  useUpdatePassScoreMutation,
  useUpdateNumberOfLearningObjectiveMutation,
  useAddSubjectPriorityMutation,
  useFindMyClassesQuery,
} from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { useAddChildMutation } from "../../features/api/apiSlice";
import { DataTable } from "../table/data-table";
import { childColumns } from "../table/columns";
import { Button } from "../ui/button";

const ParentDashboard = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const dialogRef = useRef(null);
  const [childlicense, setChildlicense] = useState("");
  const [currentData, setCurrentData] = useState("");

  console.log(currentData);

  const { data, isLoading } = useGetAllChildrenQuery(userInfo?.childrenArray);
  const [addChild, { isLoading: isAdding }] = useAddChildMutation();
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
                      {i?.classTitle?.split(" ")[3]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <div className="font-medium py-2">
                  Subject Ranking{" "}
                  <span className="text-sm font-light">
                    (With 5 being the most important and 1 being the least
                    important)
                  </span>
                </div>
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
              {isAdding2 ? (
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
        <Button
          onClick={() => document.getElementById("my_modal_6").showModal()}
        >
          Add Subject priority
        </Button>
        <Button
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Link a child
        </Button>
      </div>

      <div className="overflow-x-auto min-w-full max-w-full">
        <DataTable
          columns={childColumns}
          data={data || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ParentDashboard;
