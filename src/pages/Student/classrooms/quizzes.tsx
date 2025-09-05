import { useFindAllQuizByIdQuery } from "../../../features/api/apiSlice";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// type ExamQuestions = {
//   exam_questions: {
//     _id: string;
//     questions: {
//       number: string;
//       text: string;
//       marks: number;
//       learning_objectives: string[];
//       mark_scheme: string;
//     }[];
//     student_id: null;
//     class_id: string;
//   }[];
// };

const StudentQiuzzes = () => {
  const { classId } = useParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const shouldSkip = !classId;
  const { data: quizPayload, isLoading, isFetching } = useFindAllQuizByIdQuery(
    { id: classId as string, page, limit },
    { skip: shouldSkip, refetchOnMountOrArgChange: true }
  );
  const AllQuiz = (quizPayload as any)?.data ?? quizPayload;
  const pagination = (quizPayload as any)?.pagination ?? null;
  const [displayQuizzes, setDisplayQuizzes] = useState<any[]>([]);
  const lastAutoAdvancedPageRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Array.isArray(AllQuiz)) return;

    // If current page is empty but pagination indicates more available items,
    // auto-advance to the next page (likely page contains only completed quizzes)
    if (
      AllQuiz.length === 0 &&
      pagination &&
      pagination.total > 0 &&
      pagination.hasNext &&
      lastAutoAdvancedPageRef.current !== page &&
      !isLoading &&
      !isFetching
    ) {
      lastAutoAdvancedPageRef.current = page;
      setPage((p) => p + 1);
      return;
    }

    lastAutoAdvancedPageRef.current = null;
    setDisplayQuizzes(AllQuiz);
  }, [AllQuiz, pagination, page, isLoading, isFetching]);

  const formatDateTime = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };
  // const [examQuestions, setExamQuestions] = useState<ExamQuestions | "">("");
  console.log({ AllQuiz });

  const getExamTasks = async () => {
    try {
      const res = await fetch(
        `https://edat-microservice-v1.onrender.com/exam/get_exam_questions?role=teacher&class_id=${classId}`
      );
      const tasks = await res.json();
      console.log({ tasks });
      // if (res.ok) setExamQuestions(tasks);
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    getExamTasks();
  }, []);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/student">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/student/classrooms">Classrooms</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quizzes</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h3 className="my-4 text-lg font-medium">
        {displayQuizzes?.[0]?.classRoomName}
      </h3>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                <AccordionTrigger>Quizzes</AccordionTrigger>
              </CardTitle>
            </CardHeader>
            <AccordionContent>
              <CardContent className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {isLoading || isFetching ? (
                  <div className="col-span-full flex items-center gap-2 text-sm opacity-80">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading quizzes...
                  </div>
                ) : Array.isArray(displayQuizzes) && displayQuizzes.length > 0 ? (
                  displayQuizzes.map((val: any, i: number) => (
                    <Card key={i} className="flex flex-col justify-between">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium line-clamp-2 capitalize">
                          {/* {val?.subject} */}
                          {val?.objective}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between gap-5">
                        <div className="flex flex-col gap-1 text-xs text-slate-700">
                          <p className="truncate">{val?.numberOfQuestions} questions</p>
                          <p className="truncate">Created: {formatDateTime(val?.createdAt)}</p>
                        </div>
                        {/* <p className="text-slate-800">Topic: {val?.topic}</p> */}
                        <Link
                          to={`/dashboard/quiz?obj_code=${val?.objCode}&qs=${val?.numberOfQuestions}`}
                          state={{ data: val }}
                          className="text-primary hover:underline text-sm font-semibold whitespace-nowrap"
                        >
                          Take Quiz
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-sm opacity-80">No Quiz Found</div>
                )}

                {/* Pagination inside the quizzes card */}
                <div className="col-span-full flex items-center justify-between mt-2">
                  <div className="text-sm opacity-80">
                    Page {pagination?.page || page} of {pagination?.pages || 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {isFetching && <Loader2 className="h-4 w-4 animate-spin opacity-70" />}
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={isLoading || isFetching || (pagination && !pagination?.hasPrev) || page === 1}
                    >
                      Prev
                    </button>
                    <button
                      className="px-3 py-1 border rounded disabled:opacity-50"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={isLoading || isFetching || (pagination && !pagination?.hasNext)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>



        {/* <AccordionItem value="exams">
          <Card className="mt-5">
            <CardHeader>
              <CardTitle className="text-lg">
                <AccordionTrigger>Exams</AccordionTrigger>
              </CardTitle>
            </CardHeader>
            <AccordionContent>
              <CardContent className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                {examQuestions?.exam_questions?.map((val, i: number) => (
                  <Card key={i} className="flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium line-clamp-2 capitalize">
                       
                        {val?.questions[0].learning_objectives[0]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-5">
                      <p className="text-slate-950 truncate text-xs">
                        {val?.questions.length} questions
                      </p>
                     
                      <Link
                        to={`/student/classrooms/exam/${val._id}`}
                        state={{ data: val }}
                        className="text-primary hover:underline text-sm font-semibold whitespace-nowrap"
                      >
                        Take Exam
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem> */}



      </Accordion>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
        {Array.isArray(AllQuiz) && AllQuiz.length === 0 && (
          <div className="text-center">No Quiz Found</div>
        )}
      </div>
    </>
  );
};

export default StudentQiuzzes;
