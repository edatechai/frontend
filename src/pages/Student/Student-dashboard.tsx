import { useMemo, useState } from "react";
// import { Badge } from "@/components/ui/badge";

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { data: quizResult, isLoading: quizResultLoading, isFetching: quizResultFetching } =
    useGetQuizResultByUserIdQuery({ id: userInfo._id, page, limit });

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
    
      {classId && <SandW classId={classId} clas={clas} />}
     
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={columns}
          data={quizResult?.data || []}
          isLoading={quizResultLoading || quizResultFetching}
          pageSize={limit}
          serverPaging={{
            page: quizResult?.pagination?.page || page,
            pages: quizResult?.pagination?.pages || 1,
            total: quizResult?.pagination?.total,
            hasPrev: quizResult?.pagination?.hasPrev,
            hasNext: quizResult?.pagination?.hasNext,
            pageSize: limit,
            onPageChange: (p) => setPage(p),
            onPageSizeChange: (n) => { setPage(1); setLimit(n); }
          }}
        />
      </div>
     
    </div>
  );
}
