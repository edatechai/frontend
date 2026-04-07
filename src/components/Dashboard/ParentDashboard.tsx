import { useState } from "react";
import {
  useGetAllChildrenQuery,
  useAddSubjectPriorityMutation,
  useFindMyClassesQuery,
} from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { useAddChildMutation, useRemoveChildMutation } from "../../features/api/apiSlice";
import { DataTable } from "../table/data-table";
import { childColumns } from "../table/columns";
import { Button } from "../ui/button";

const getDialog = (id: string) =>
  document.getElementById(id) as HTMLDialogElement | null;

const ParentDashboard = () => {
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [childlicense, setChildlicense] = useState("");
  const [currentData, setCurrentData] = useState("");

  const { data, isLoading } = useGetAllChildrenQuery(userInfo?.childrenArray);
  const [addChild, { isLoading: isAdding }] = useAddChildMutation();
  const [removeChild, { isLoading: isRemoving }] = useRemoveChildMutation();
  const [addSubjectPriority, { isLoading: isAdding2 }] =
    useAddSubjectPriorityMutation();
  const { data: classes } = useFindMyClassesQuery(currentData, { skip: !currentData });
  const [subject_id, setSubject_id] = useState("");
  const [subject_important_ranking, setSubject_important_ranking] =
    useState("");

  const handleSubmit = async () => {
    const payload = {
      id: userInfo?._id,
      childlicense,
    };
    const res = await addChild(payload).unwrap();
    if (res.error) {
      alert(res.error.data.message);
      return getDialog("my_modal_3")?.close();
    }
    alert("child added successfully");
    setChildlicense("");
    window.location.reload();
    getDialog("my_modal_3")?.close();
  };

  const handleRemoveChild = async () => {
    const payload = {
      id: userInfo?._id,
      childlicense,
    };
    const res = await removeChild(payload).unwrap();
    if (res.error) {
      alert(res.error.data.message);
      return getDialog("my_modal_7")?.close();
    }
    alert("child unlinked successfully");
    setChildlicense("");
    getDialog("my_modal_7")?.close();
    window.location.reload();
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
        return getDialog("my_modal_6")?.close();
      }
    } catch (error: any) {
      console.error("Error adding subject priority:", error);
      if (error.status) {
        alert(error.data.message);
        return getDialog("my_modal_6")?.close();
      }
      alert(error);
      return getDialog("my_modal_6")?.close();
    }
  };

  return (
    <div className="min-w-screen lg:max-w-[100%] px-8 py-5 overflow-hidden">

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
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

      <dialog id="my_modal_6" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add subject priority</h3>

          <div className="mt-4">
            <div className="font-medium py-2">Select Student</div>
            <select
              disabled={isLoading}
              defaultValue=""
              onChange={(e) => setCurrentData(e.target.value)}
              className="select select-bordered w-full"
            >
              <option disabled value="">
                Select Student
              </option>
              {data?.map((i: any, index: number) => (
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
                  defaultValue=""
                  onChange={(e) => setSubject_id(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option disabled value="">
                    Select Subject
                  </option>
                  {classes?.classes?.map((i: any, index: number) => (
                    <option value={i?._id} key={index}>
                      {i?.subject}
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
                  defaultValue=""
                  onChange={(e) => setSubject_important_ranking(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option disabled value="">
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

      <dialog id="my_modal_7" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Unlink a child</h3>

          <div className="mt-4">
            <div className="font-medium py-2">License code</div>
            <label className="input input-bordered flex items-center gap-2">
              <input
                value={childlicense}
                disabled={isRemoving}
                onChange={(e) => setChildlicense(e.target.value)}
                type="text"
                className="w-full"
                placeholder="Enter license code"
              />
            </label>
          </div>

          <div className="mt-4">
            <button onClick={handleRemoveChild} className="btn min-w-full">
              {isRemoving ? (
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
          onClick={() => getDialog("my_modal_6")?.showModal()}
        >
          Add Subject priority
        </Button>
        <Button
          onClick={() => getDialog("my_modal_3")?.showModal()}
        >
          Link a child
        </Button>
        <Button
          onClick={() => getDialog("my_modal_7")?.showModal()}
        >
          Unlink a child
        </Button>
      </div>

      <div className="overflow-x-auto min-w-full max-w-[100vw]">
        <DataTable
          columns={childColumns}
          data={data || []}
          isLoading={isLoading}
          isError={false}
          error={null}
        />
      </div>
    </div>
  );
};

export default ParentDashboard;
