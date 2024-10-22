import { useFindMyClassesTeacherQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { JoinClassroom } from "./joinClassroom";

const TeachersClassroom = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: myClasses } = useFindMyClassesTeacherQuery(userInfo._id);

  return (
    <>
      <JoinClassroom userInfo={userInfo} />

      <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8 mt-7">
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
              );
            })}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TeachersClassroom;
