import { useState, useRef } from "react";
import {
  useGetAllClassRoomByAccountIdQuery,
  useJoinClassMutation,
  useFindMyClassesTeacherQuery,
} from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuUserPlus } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const TeachersClassroom = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: classes } = useGetAllClassRoomByAccountIdQuery(
    userInfo?.accountId
  );
  const { data: myClasses } = useFindMyClassesTeacherQuery(userInfo._id);
  const [joinClass, { isLoading }] = useJoinClassMutation();
  const dialogRef = useRef(null);

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
        <Button
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Join a class
        </Button>
      </div>

      <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Classrooms</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {myClasses?.classes?.map((i, index) => {
              return (
                <Card
                  x-chunk="dashboard-01-chunk-0"
                  key={index}
                  className="flex flex-col justify-between"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {i.classTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-5 pt-6">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>{i?.numberOfStudents.length}</div>
                    </span>
                    {/* <Link
                  to="/student/classrooms/quizzes"
                  state={{ data: i?._id }}
                  className="text-primary hover:underline text-sm font-semibold"
                >
                  View Class
                </Link> */}
                    <Link
                      to="/teacher/class"
                      state={{ data: i }}
                      className="text-primary hover:underline text-sm font-semibold"
                    >
                      Enter Classroom
                    </Link>
                  </CardContent>
                </Card>
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
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TeachersClassroom;
