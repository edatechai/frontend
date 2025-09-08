import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useResultsByClassIdQuery } from "@/features/api/apiSlice";
import { getColor } from "@/lib/jsons";
import { latexToHTML } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

// Add type for quiz results
type QuizResult = {
  question: string;
  isCorrect: boolean;
  wrongOption?: string;
  correctOption: string;
  correctAnswer: string;
  selectedAnswer: string;
};

function findValue(array: any[], obj: string, name: string) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.objective === obj && array[i].userInfo?.fullName === name) {
      return +array[i]?.scorePercentage;
    }
  }
  return -5;
}

function findResults(array: any[], obj: string, name: string) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.objective === obj && array[i].userInfo?.fullName === name) {
      return array[i]?.quizResults;
    }
  }
  return [];
}

// Update the sample type
const sample = {
  fullName: "John Doe",
  results: [
    {
      learning_outcome: "laws of indices",
      score_percent: 70,
      quizResults: [] as QuizResult[],
    },
  ],
};

// Add type for reduced average
type ReducedAvg = {
  obj: string;
  results: number;
}[];

const getAvg = (
  array: {
    learning_outcome?: string | undefined;
    score_percent: number;
  }[]
) =>
  array
    .filter((val) => val.score_percent != -5)
    .reduce((sum, currentValue) => sum + currentValue.score_percent, 0) /
  array.filter((val) => val.score_percent != -5).length;

const ClassReport = () => {
  const { classId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [previousPage, setPreviousPage] = useState(1);
  
  const { data: rawData, isLoading, error, isFetching } = useResultsByClassIdQuery({
    id: classId!,
    page: currentPage,
    limit: limit,
  });
  
  const [results, setResults] = useState<(typeof sample)[]>([]);
  const [reducedAvg, setReducedAvg] = useState<ReducedAvg>([]);
  const [objs, setObjs] = useState<string[]>([]);

  // Handle pagination loading state
  const handlePageChange = (newPage: number) => {
    console.log("Changing page from", currentPage, "to", newPage);
    setIsPaginationLoading(true);
    setPreviousPage(currentPage);
    setCurrentPage(newPage);
  };

  // Reset pagination loading when data changes for the new page
  React.useEffect(() => {
    console.log("Effect triggered - currentPage:", currentPage, "previousPage:", previousPage, "isFetching:", isFetching, "data:", !!rawData);
    
    // Only reset loading if we've actually changed pages and have data
    if (currentPage !== previousPage && rawData && !isFetching) {
      console.log("Resetting pagination loading");
      setIsPaginationLoading(false);
      setPreviousPage(currentPage);
    }
    
    // Also reset on initial load
    if (currentPage === previousPage && rawData && !isFetching && !isLoading) {
      setIsPaginationLoading(false);
    }
  }, [currentPage, previousPage, rawData, isFetching, isLoading]);

  // Extract data from paginated response
  const data = rawData?.data || rawData; // Handle both paginated and non-paginated responses
  const pagination = rawData?.pagination;

  useEffect(() => {
    if (data) {
      console.log("Processing data:", data);
      console.log("Sample userInfo:", data[0]?.userInfo);
      
      const objectsArray = [...new Set(data.map((val: any) => val?.objective).filter((v: any) => v))] as string[];
      setObjs(objectsArray);
      const objects = objectsArray;

      const studentsArray = [...new Set(data.map((val: any) => val?.userInfo?.fullName).filter((v: any) => v))] as string[];
      const students = studentsArray;
      
      console.log("Extracted students:", students);
      console.log("Extracted objectives:", objects);

      const processedResults = students.map((name) => {
        return {
          fullName: name,
          results: objects.map((obj) => {
            return {
              learning_outcome: obj,
              score_percent: findValue(data, obj, name),
              quizResults: findResults(data, obj, name),
            };
          }),
        };
      });
      
      console.log("Processed results:", processedResults);
      setResults(processedResults);

      setReducedAvg(
        objects.map((obj) => {
          return {
            obj,
            results: getAvg(
              students.map((name) => {
                return {
                  score_percent: findValue(data, obj, name),
                };
              })
            ),
          };
        })
      );
    }
  }, [data]);

  console.log({ classResults: data, pagination });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span className="text-muted-foreground">Loading class report...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500">Error loading class report. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/teacher/report">Classrooms</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data?.[0]?.classRoomName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex justify-between items-center mb-20 mt-6">
          <h3 className="text-xl font-medium">
            {data?.[0]?.classRoomName}
          </h3>
          {pagination && (
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} quiz results
            </div>
          )}
        </div>
        {results.length < 1 ? (
          <p>This class has no result</p>
        ) : (
          <>
            <table className="pt-9 overflow-x-auto">
            <tr className="text-left whitespace-nowrap">
              <th></th>
              <th className="capitalize max-w-8">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <p className="-rotate-45 origin-top relative bottom-1 text-sm font-medium cursor-pointer">
                      All questions
                    </p>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-fit p-1">
                    All questions
                  </HoverCardContent>
                </HoverCard>
              </th>
              {objs.map((obj) => (
                <th className="capitalize max-w-8" key={obj}>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <p className="-rotate-45 origin-top relative bottom-8 right-2 text-sm font-medium cursor-pointer truncate w-28">
                        {obj}
                      </p>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-fit p-1">
                      {obj}
                    </HoverCardContent>
                  </HoverCard>
                </th>
              ))}
            </tr>
            <tr>
              <td className="font-semibold">All students</td>
              <td></td>
              {reducedAvg.map((avgScore) => (
                <td key={avgScore.obj}>
                  <p
                    className="size-8 rounded-sm flex items-center justify-center m-0.5 font-semibold text-white"
                    style={{
                      backgroundColor: getColor(avgScore.results),
                    }}
                  >
                    {Math.round(avgScore.results).toFixed()}
                  </p>
                </td>
              ))}
            </tr>
            {results.map((val) => (
              <tr key={val.fullName}>
                <td>
                  <p className="pr-2 capitalize">{val.fullName}</p>
                </td>
                <td>
                  <p
                    className="size-8 rounded-sm flex items-center justify-center m-0.5 font-semibold text-white"
                    style={{
                      backgroundColor: getColor(getAvg(val.results)),
                    }}
                  >
                    {Math.round(getAvg(val.results)).toFixed()}
                  </p>
                </td>
                {val.results.map((result, index) => (
                  <td key={index}>
                    <HoverCard>
                      <HoverCardTrigger
                        className="size-8 rounded-sm flex items-center justify-center m-0.5 text-white text-lg"
                        style={{
                          backgroundColor: getColor(+result.score_percent),
                        }}
                      >
                        {result.score_percent != -5
                          ? result.score_percent.toFixed()
                          : "?"}
                      </HoverCardTrigger>
                      <HoverCardContent className="w-fit p-0">
                        {result.score_percent == -5 ? (
                          <p className="p-1">No Score</p>
                        ) : (
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="link">View Report</Button>
                            </SheetTrigger>
                            <SheetContent className="sm:w-[540px] overflow-auto">
                              <SheetHeader className="overflow-y-scroll  text-left">
                                <SheetTitle>Quiz Report</SheetTitle>
                                <SheetDescription>
                                  {result.quizResults && result.quizResults.length > 0 ? result.quizResults.map(
                                    (val, index: number) => (
                                      <Card className="mb-3" key={index}>
                                        <CardHeader>
                                          <CardTitle>
                                            Question {index + 1}
                                          </CardTitle>
                                          <div
                                            className="text-sm text-muted-foreground"
                                            dangerouslySetInnerHTML={{
                                              __html: latexToHTML(val.question || ''),
                                            }}
                                          ></div>
                                        </CardHeader>
                                        <CardContent>
                                          {!val.isCorrect ? (
                                            <p>
                                              <span className="text-destructive font-medium">
                                                You choose a wrong answer:
                                              </span>{" "}
                                              <span
                                                dangerouslySetInnerHTML={{
                                                  __html: latexToHTML(val.wrongOption || ''),
                                                }}
                                              ></span>
                                            </p>
                                          ) : (
                                            <p className="text-green-700 font-medium">
                                              You got it right
                                            </p>
                                          )}
                                          <p>
                                            <span className="font-medium">
                                              Correct option:
                                            </span>{" "}
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html: latexToHTML(val.correctOption || ''),
                                              }}
                                            />
                                          </p>
                                          <p>
                                            <span className="font-medium">
                                              Correct answer:
                                            </span>{" "}
                                            {val.correctAnswer || 'N/A'}
                                          </p>
                                          <p className="capitalize">
                                            <span className="font-medium">
                                              Your answer:
                                            </span>{" "}
                                            <span className="capitalize">
                                              {val.selectedAnswer || 'N/A'}
                                            </span>
                                          </p>
                                        </CardContent>
                                      </Card>
                                    )
                                  ) : (
                                    <p className="text-center py-4 text-muted-foreground">
                                      Quiz details not available. This data has been optimized for performance.
                                    </p>
                                  )}
                                </SheetDescription>
                              </SheetHeader>
                            </SheetContent>
                          </Sheet>
                        )}
                      </HoverCardContent>
                    </HoverCard>
                  </td>
                ))}
              </tr>
            ))}
            </table>

            {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isPaginationLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev || isPaginationLoading}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext || isPaginationLoading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        const pageNumber = Math.max(1, Math.min(
                          pagination.pages - 4,
                          pagination.page - 2
                        )) + i;
                        
                        if (pageNumber > pagination.pages) return null;
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={pageNumber === pagination.page ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={isPaginationLoading}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          </>
        )}
      </div>
    );
};

export default ClassReport;
