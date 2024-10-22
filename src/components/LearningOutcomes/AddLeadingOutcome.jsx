import React, { useState, useRef } from "react";
import {
  useDeleteObjectiveMutation,
  useCreateObjectiveMutation,
  useFindAllObjectivesQuery,
  useUploadObjectiveMutation,
} from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import axios from "axios";

const Index = () => {
  const [createObjective, { isLoading, data }] = useCreateObjectiveMutation();
  const { data: allObjectives, isLoading: isLoadingObjectives } =
    useFindAllObjectivesQuery();
  const [uploadObjective, { isLoading: uploading, error }] =
    useUploadObjectiveMutation();
  const [deleteObjective, { isLoading: isDeleting }] =
    useDeleteObjectiveMutation();
  const userInfo = useSelector((state) => state.user.userInfo);
  const dialogRef = useRef(null);

  const [objCode, setObjCode] = useState("");
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [objective, setObjective] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State variable for search input
  const [searchInput, setSearchInput] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const payload = {
      subject,
      objCode,
      category,
      objective,
      topic,
    };
    try {
      const response = await createObjective(payload).unwrap();
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
    if (
      window.confirm(
        "Are you sure you want to delete this Objective? This action cannot be undone."
      )
    ) {
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
    if (!file) return alert("Please upload a CSV file.");

    const payload = { file };

    try {
      await uploadObjective(payload).unwrap();
      alert("Objective uploaded successfully");
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  const totalPages = Math.ceil(allObjectives?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentObjectives = allObjectives?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Filter objectives based on search input
  const filteredObjectives = allObjectives?.filter(
    (objective) =>
      objective?.objCode?.toLowerCase().includes(searchInput?.toLowerCase()) ||
      objective?.subject?.toLowerCase().includes(searchInput?.toLowerCase()) ||
      objective?.category?.toLowerCase().includes(searchInput?.toLowerCase()) ||
      objective?.topic?.toLowerCase().includes(searchInput?.toLowerCase()) ||
      objective?.objective?.toLowerCase().includes(searchInput?.toLowerCase())
  );

  return (
    <>
      <dialog id="my_modal_3" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Create Learning Objective</h3>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">Objective Code</span>
              </div>
              <input
                value={objCode}
                disabled={isLoading}
                onChange={(e) => setObjCode(e.target.value)}
                type="text"
                placeholder="Objective code"
                className="input input-bordered min-w-full"
              />
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
                type="text"
                placeholder="Subject"
                className="input input-bordered min-w-full"
              />
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
                type="text"
                placeholder="Category"
                className="input input-bordered min-w-full"
              />
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
                type="text"
                placeholder="Topic"
                className="input input-bordered min-w-full"
              />
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
                type="text"
                placeholder="Objective"
                className="input input-bordered min-w-full"
              />
            </label>
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} className="btn min-w-full">
              {isLoading ? (
                <div className="flex justify-center">Loading...</div>
              ) : (
                "Add Learning Objective"
              )}
            </button>
          </div>
        </div>
      </dialog>

      <div className="flex flex-row justify-end mb-5">
        {uploading ? (
          <div className="flex justify-center">Uploading...</div>
        ) : null}
        <div className="flex px-5 gap-2">
          <input
            type="file"
            className="file-input file-input-bordered file-input-md w-full max-w-xs"
            onChange={handleFileChange}
          />
          <button className="btn" onClick={handleUpload}>
            Bulk Upload
          </button>
        </div>
        <button
          onClick={() => document.getElementById("my_modal_3").showModal()}
          className="btn"
        >
          Create Learning Objectives
        </button>
      </div>

      <div className="flex flex-col mb-5 lg:w-1/2 w-full">
        <input
          type="text"
          placeholder="Search by any field"
          className="input input-bordered w-full"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {filteredObjectives?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Objective Code</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Topic</th>
                <th>Objective</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredObjectives
                ?.slice(startIndex, startIndex + itemsPerPage)
                .map((i, index) => (
                  <tr key={index}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold">{i.objCode}</div>
                        </div>
                      </div>
                    </td>
                    <td>{i.subject}</td>
                    <td>{i.category}</td>
                    <td>{i.topic}</td>
                    <td>{i.objective}</td>
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
              className="btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          No objectives found
        </div>
      )}
    </>
  );
};

export default Index;
