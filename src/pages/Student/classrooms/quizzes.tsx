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
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ExamQuestions = {
  exam_questions: {
    _id: string;
    questions: {
      number: string;
      text: string;
      marks: number;
      learning_objectives: string[];
      mark_scheme: string;
    }[];
    student_id: null;
    class_id: "66a68cf94c92cafaed484b16";
  }[];
};

const StudentQiuzzes = () => {
  const { classId } = useParams();
  const { data: AllQuiz } = useFindAllQuizByIdQuery(classId);
  const [examQuestions, setExamQuestions] = useState<ExamQuestions | "">("");
  console.log({ AllQuiz });

  const getExamTasks = async () => {
    try {
      const res = await fetch(
        `https://edat-microservice-v1.onrender.com/exam/get_exam_questions?role=teacher&class_id=${classId}`
      );
      const tasks = await res.json();
      console.log({ tasks });
      if (res.ok) {
        setExamQuestions(tasks);
      }
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
        {AllQuiz?.[0]?.classRoomName}
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
                {AllQuiz?.map((val, i: number) => (
                  <Card key={i} className="flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium line-clamp-2 capitalize">
                        {/* {val?.subject} */}
                        {val?.objective}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-5">
                      <p className="text-slate-950 truncate text-xs">
                        {val?.numberOfQuestions} questions
                      </p>
                      {/* <p className="text-slate-800">Topic: {val?.topic}</p> */}
                      <Link
                        to="/dashboard/quiz"
                        state={{ data: val }}
                        className="text-primary hover:underline text-sm font-semibold whitespace-nowrap"
                      >
                        Take Quiz
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
        <AccordionItem value="exams">
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
                        {/* {val?.subject} */}
                        {val?.questions[0].learning_objectives[0]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between gap-5">
                      <p className="text-slate-950 truncate text-xs">
                        {val?.questions.length} questions
                      </p>
                      {/* <p className="text-slate-800">Topic: {val?.topic}</p> */}
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
        </AccordionItem>
      </Accordion>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
        {AllQuiz?.length === 0 && (
          <div className="text-center">No Quiz Found</div>
        )}
      </div>
    </>
  );
};

export default StudentQiuzzes;
