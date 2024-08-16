import React from "react";
import { useFindAllQuizByIdQuery } from "../../../features/api/apiSlice";
import Books from "../../../assets/books.jpg";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const StudentQiuzzes = () => {
  let { state } = useLocation();
  const { data: AllQuiz } = useFindAllQuizByIdQuery(state?.data);

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
            <BreadcrumbPage>Quizzies</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
        {AllQuiz?.map((i, index) => {
          return (
            <div key={index} className="">
              <div className="card bg-white border-2 border-slate-300 text-primary-content">
                <div className="card-body px-3 py-3">
                  <img src={Books} className=" h-[200px] rounded-md" />
                  <div className="flex justify-between items-center w-full overflow-hidden">
                    <div>
                      <h2 className="card-title text-slate-950">
                        {i?.subject}
                      </h2>
                    </div>
                    <div>
                      <p className="text-slate-950 truncate">
                        {i?.numberOfQuestions} questions
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-800">Topic: {i?.topic}</p>
                  <div className="text-slate-950"></div>
                  <div className="card-actions justify-end">
                    <div className="px-3 justify-center">
                      <Link to="/dashboard/quiz" state={{ data: i }}>
                        <button className="btn">Take Quiz</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {AllQuiz?.length === 0 && (
          <div className="text-center">No Quiz Found</div>
        )}
      </div>
    </>
  );
};

export default StudentQiuzzes;
