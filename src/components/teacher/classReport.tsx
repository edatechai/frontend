import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { getColor, resultsMock } from "@/lib/jsons";
import { latexToHTML } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

function findValue(array: typeof resultsMock, obj: string, name: string) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.objective === obj && array[i].userInfo.fullName === name) {
      return +array[i]?.scorePercentage;
    }
  }
  return -5;
}

function findResults(array: typeof resultsMock, obj: string, name: string) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]?.objective === obj && array[i].userInfo.fullName === name) {
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
  const { data, isLoading } = useResultsByClassIdQuery(classId);
  const [results, setResults] = useState<(typeof sample)[]>([]);
  const [reducedAvg, setReducedAvg] = useState<ReducedAvg>([]);
  const [objs, setObjs] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      setObjs([...new Set(data.map((val) => val?.objective).filter((v) => v))]);
      const objects = [
        ...new Set(data.map((val) => val?.objective).filter((v) => v)),
      ];

      const students = [
        ...new Set(data.map((val) => val?.userInfo?.fullName).filter((v) => v)),
      ];

      setResults(
        students.map((name) => {
          return {
            fullName: name,
            results: objects.map((obj, i) => {
              return {
                learning_outcome: obj,
                score_percent: findValue(data, obj, name),
                quizResults: findResults(data, obj, name),
              };
            }),
          };
        })
      );

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

  console.log({ classResults: data });
  if (isLoading) {
    return <p>Loading..</p>;
  } else {
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
        <h3 className="mb-20 mt-6 text-xl font-medium">
          {data?.[0]?.classRoomName}
        </h3>
        {results.length < 1 ? (
          <p>This class has no result</p>
        ) : (
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
            {results.map((val, i) => (
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
                                  {result.quizResults.map(
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
        )}
      </div>
    );
  }
};

export default ClassReport;
