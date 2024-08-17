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
  const {
    data: quizResult,
    isLoading: quizResultLoading,
    isSuccess: quizResultSuccess,
    isError: quizResultError,
  } = useGetQuizResultByUserIdQuery(userInfo._id);

  let classTitle;
  if (classId) {
    classTitle = myClasses?.classes?.filter((i) => classId === i._id)[0]
      ?.classTitle;
  }
  console.log({ classTitle });

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
      <div className="w-full flex justify-end">
        <Select onValueChange={setClassId}>
          <SelectTrigger className="w-[180px] bg-orange-500 text-white">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Classrooms</SelectLabel>
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
      {classId && <SandW classId={classId} classTitle={classTitle} />}
      {/* </div> */}
      {/* <div className="grid grid-flow-col gap-4 w-screen md:gap-8 md:w-[calc(100vw-268px)] lg:w-[calc(100vw-328px)] overflow-x-auto"> */}
      <Card x-chunk="dashboard-01-chunk-5">
        <CardHeader className="px-6 py-3">
          <CardTitle className="text-lg">Results</CardTitle>
        </CardHeader>
        <CardContent className="w-[calc(100vw-32px)] md:w-[calc(100vw-244px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
          <DataTable
            columns={columns}
            data={quizResult?.data || []}
            isLoading={quizResultLoading}
            pageSize={5}
          />
        </CardContent>
      </Card>
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
                  {val.classTitle}
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
