import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFindMyClassesQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
//import { JoinClassroom } from "../../components/classroom/JoinClassroom";
import { JoinClassroom } from "../../components/classroom/joinClassroom";



export function StudentClassrooms() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: myClasses, isLoading } = useFindMyClassesQuery(userInfo._id);

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
      <JoinClassroom userInfo={userInfo} />
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
          <>
            {isLoading ? (
              <p className="ml-6 mb-5">Loading"</p>
            ) : (
              <p className="ml-6 mb-5">You do not belong to any class yet</p>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
