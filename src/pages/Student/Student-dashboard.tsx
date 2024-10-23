import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFindMyClassesQuery,
  useGetQuizResultByUserIdQuery,
} from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { SandW } from "../../components/Analysis/SandW";
import { DataTable } from "../../components/table/data-table";
import { columns } from "../../components/table/columns";

export function StudentDash() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [classId, setClassId] = useState("");
  const { data: myClasses } = useFindMyClassesQuery(userInfo._id);
  const { data: quizResult, isLoading: quizResultLoading } =
    useGetQuizResultByUserIdQuery(userInfo._id);

  console.log("my data", quizResult);

  console.log({ myClasses });

  let clas;
  if (classId) {
    clas = myClasses?.classes?.filter((i) => classId === i._id)[0];
  }

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
      <div className="bg-primary text-primary-foreground flex justify-between">
        <span className="grid md:ml-10 mt-4 md:mt-8 mx-4 mb-4 md:mr-0">
          <h4 className="text-lg md:text-3xl font-bold">
            Welcome back,{" "}
            <span className="capitalize">{userInfo?.fullName}</span>
          </h4>
          <p className="md:text-xl">
            Your personalized learning journey starts here.
            <br /> Unleashing potentials, Igniting Minds.
          </p>
        </span>
        <img
          alt="student and teacher illustration"
          src="/teacher-and-student.png"
          className="h-full hidden md:block"
        />
      </div>
      <div className="flex items-center justify-between px-4 py-3 md:py-5 rounded-lg bg-background border border-border">
        <p className="text-lg md:text-xl font-semibold">Select a subject</p>{" "}
        <Select onValueChange={setClassId}>
          <SelectTrigger className="w-36 border-foreground/50">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Subjects</SelectLabel>
              {myClasses?.classes?.map((i) => (
                <SelectItem value={i._id} key={i._id}>
                  {i?.classTitle}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      {/* <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3"> */}
      {classId && <SandW classId={classId} clas={clas} />}
      {/* </div> */}
      {/* <div className="grid grid-flow-col gap-4 w-screen md:gap-8 md:w-[calc(100vw-268px)] lg:w-[calc(100vw-328px)] overflow-x-auto"> */}
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={columns}
          data={quizResult?.data || []}
          isLoading={quizResultLoading}
          pageSize={5}
        />
      </div>
      {/* <Card x-chunk="dashboard-01-chunk-5">
        <CardHeader className="px-6 py-3">
          <CardTitle className="text-lg">Results</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 w-screen md:w-[calc(100vw-268px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
          {quizResult?.data.map((val, index) => (
            <Card
              x-chunk="dashboard-01-chunk-0"
              key={index}
              className="flex flex-col justify-between border-destructive bg-destructive/10"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 w-44 md:w-64">
                <CardTitle className="text-sm font-medium">
                  {val.objective}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(val.scorePercentage)}
                </div>
        
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card> */}
      {/* <Card x-chunk="dashboard-01-chunk-5">
        <CardHeader className="px-6 py-3">
          <CardTitle className="text-lg">Classrooms</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
          {myClasses?.classes.map((val, i) => (
            <Card
              x-chunk="dashboard-01-chunk-0"
              key={i}
              className="flex flex-col justify-between"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 w-52">
                <CardTitle className="text-sm font-medium line-clamp-2">
                  {val.class}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-5">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>{val.numberOfStudents.length}</div>
                </span>
                <Button variant="link" className="px-0">
                  View Class
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card> */}
    </div>
  );
}
