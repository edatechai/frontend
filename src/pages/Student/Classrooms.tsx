import { Link } from "react-router-dom";
import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFindMyClassesQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";

export function StudentClassrooms() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: myClasses } = useFindMyClassesQuery(userInfo._id);

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
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
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Classrooms</CardTitle>
        </CardHeader>
        {myClasses?.classes?.length ? (
          <CardContent className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {myClasses?.classes?.map((val, i) => (
              <Card
                x-chunk="dashboard-01-chunk-0"
                key={i}
                className="flex flex-col justify-between"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium line-clamp-2">
                    {val?.classTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-5">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>{val?.numberOfStudents?.length}</div>
                  </span>
                  <Link
                    to={`/student/classrooms/${val?._id}`}
                    className="text-primary hover:underline text-sm font-semibold"
                  >
                    View Class
                  </Link>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        ) : (
          <p className="ml-6 mb-5">You do not belong to any class yet</p>
        )}
      </Card>
    </div>
  );
}
