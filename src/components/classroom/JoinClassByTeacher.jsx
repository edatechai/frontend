import React, { useState, useRef } from "react";
import {
  useGetAllClassRoomByAccountIdQuery,
  useJoinClassMutation,
  useFindMyClassesTeacherQuery,
} from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LuUserPlus } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: classes } = useGetAllClassRoomByAccountIdQuery(
    userInfo?.accountId
  );
  const { data: myClasses } = useFindMyClassesTeacherQuery(userInfo._id);
  const [joinClass, { isLoading }] = useJoinClassMutation();
  const dialogRef = useRef(null);
  const [classesData, setClassesData] = useState([]);

  console.log("my classes", myClasses);

  const [classRoom, setClassRoom] = useState();

  const handleSubmit = async () => {
    console.log("this is data", classRoom);
    // filter classes where clesses id is classRoom
    const filteredClasses = classes?.filter((item) => item._id === classRoom);
    console.log("filtered classes", filteredClasses[0]);
    const payload = {
      classId: filteredClasses[0]._id,
      ...userInfo,
    };
    console.log(payload);

    try {
      const response = await joinClass(payload);
      response;
      console.log(response);
      if (response.data.status === false) {
        dialogRef.current.close();
        return alert(response.data.message);
      }

      if (response.data.status === true) {
        dialogRef.current.close();
        return alert(response.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  const dataToPass = { name: "GeeksforGeeks", age: 20 };

  return (
    <>
      {/* create class modal */}

      <dialog id="my_modal_3" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Join a classroom</h3>

          <div className="mt-4">
            <label className="form-control w-full min-w-full">
              <div className="label">
                <span className="label-text font-medium">
                  Select a classroom
                </span>
              </div>

              <select
                //   disabled={isLoading}
                onChange={(e) => setClassRoom(e.target.value)}
                className="select select-bordered"
              >
                <option disabled selected>
                  Pick one below
                </option>
                {classes?.map((i, index) => (
                  // <option key={index} value={classItem}>{classItem}</option>
                  <option value={i._id} key={index}>
                    {i?.classTitle}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} className="btn min-w-full">
              {isLoading ? (
                <div className="flex justify-center">Loading...</div>
              ) : (
                "Join Classroom"
              )}
            </button>
          </div>
        </div>
      </dialog>

      <div className="flex flex-row justify-end mb-5">
        <button
          onClick={() => document.getElementById("my_modal_3").showModal()}
          className="btn "
        >
          Join a class
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
        {myClasses?.classes?.map((i, index) => {
          return (
            <div key={index} className="">
              <div className="card bg-white border-2 border-slate-300 text-primary-content w-96 h-[250px]  ">
                <div className="card-body">
                  <h2 className="card-title text-slate-950">{i?.classTitle}</h2>
                  <p className="text-slate-800">Welcome to {i?.classTitle}</p>
                  <div className="flex gap-4">
                    <div className="text-slate-950 flex align-middle">
                      Number of student(s) in this class
                    </div>
                    <div className="flex justify-center items-center gap-2 text-black">
                      {" "}
                      <FiUsers className="text-black" />{" "}
                      {i?.numberOfStudents.length}
                    </div>
                  </div>

                  <div className="card-actions justify-end">
                    <Link to="/dashboard/class-room" state={{ data: i }}>
                      <button className="btn">Enter Classroom</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            // <Card className="w-[380px]">
            //   <CardHeader>
            //     <CardTitle>Class</CardTitle>
            //     <CardDescription className="text-accent-foreground">
            //       {i?.classTitle}
            //     </CardDescription>
            //   </CardHeader>
            //   <CardContent className="grid gap-4">
            //     <div>
            //       <div className="mb-4 grid items-start pb-4 last:mb-0 last:pb-0">
            //         {/* <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" /> */}
            //         <div className="space-y-1">
            //           <p className="font-medium leading-none whitespace-nowrap">
            //             Number of student(s) in this class
            //           </p>
            //           <p className="text-sm text-muted-foreground">
            //             {i?.numberOfStudents.length}
            //           </p>
            //         </div>
            //         <div className="space-y-1">
            //           <p className="font-medium leading-none whitespace-nowrap">
            //             Number of teacher(s) in this class
            //           </p>
            //           <p className="text-sm text-muted-foreground">
            //             {i?.numberOfTeachers.length}
            //           </p>
            //         </div>
            //       </div>
            //     </div>
            //   </CardContent>
            //   <CardFooter>
            //     <Link
            //       to="/dashboard/class-room"
            //       state={{ data: i }}
            //       className="w-full"
            //     >
            //       <Button className="w-full">Enter Classroom</Button>
            //     </Link>
            //   </CardFooter>
            // </Card>
          );
        })}
      </div>
    </>
  );
};

export default Index;
