import { Link, useSearchParams, useNavigate } from "react-router-dom";
import QuizTemp from "../../components/Quiz/Index";
import { useLocation } from "react-router-dom";
import {
  useAnalyzeResultMutation,
  useCreateQuizResultMutation,
  useQuizRandomSelectMutation,
  useUpdateQuizResultMutation,
} from "@/features/api/apiSlice";
import { useEffect, useRef, useState } from "react";
import { latexToHTML } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { FaRegCirclePlay, FaRegCircleStop } from "react-icons/fa6";
import TextWithLineBreaks from "@/components/others/textWithLineBreaks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader } from "lucide-react";

const Quiz = () => {
  let { state } = useLocation();
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [showGrade, setShowGrade] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allQuiz, setAllQuiz] = useState([]);
  const [quizScoreDIalogOpen, setQuizScoreDialogOpen] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [analyzedData, setAnalyzedData] = useState([]);
  const [doneAnalysing, setDoneAnalysing] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1; // Show one item per page
  const [quizRandomSelect] = useQuizRandomSelectMutation();
  const [createQuizResult, { isLoading: quizSubmitting }] =
    useCreateQuizResultMutation();
  const [quizResultId, setQuizResultId] = useState();
  const utteranceRef = useRef(null);
  const [updateQuizResult] = useUpdateQuizResultMutation();
  const [analyzeResult, { isLoading }] = useAnalyzeResultMutation();

  const obj_code = searchParams.get("obj_code");
  const qs = searchParams.get("qs");

  useEffect(() => {
    getQuiz();
    if (!state) {
      return navigate("/");
    }
  }, []);

  console.log({ state });

  const getQuiz = async () => {
    const payload = {
      objCode: obj_code,
      numberOfQuestions: +qs!,
    };
    const res = await quizRandomSelect(payload);
    console.log("me", res);
    if (res?.data?.length > 0) {
      setAllQuiz(
        res?.data.map((v) => ({
          ...v,
          selectedAnswer: null,
          correctAnswer: null,
          correctOption: null,
          isCorrect: false,
          wrongOption: null,
        }))
      );
    }
  };

  const updateResult = () => {
    const correctOptionValue =
      allQuiz?.[currentIndex]?.answer.toLowerCase() === "a"
        ? allQuiz?.[currentIndex]?.optionA
        : allQuiz?.[currentIndex]?.answer.toLowerCase() === "b"
        ? allQuiz?.[currentIndex]?.optionB
        : allQuiz?.[currentIndex]?.answer.toLowerCase() === "c"
        ? allQuiz?.[currentIndex]?.optionC
        : allQuiz?.[currentIndex]?.answer.toLowerCase() === "d"
        ? allQuiz?.[currentIndex]?.optionD
        : "";
    console.log({ correctOptionValue });
    const wrongOptionValue =
      allQuiz?.[currentIndex]?.selectedAnswer.toLowerCase() === "a"
        ? allQuiz?.[currentIndex]?.optionA
        : allQuiz?.[currentIndex]?.selectedAnswer.toLowerCase() === "b"
        ? allQuiz?.[currentIndex]?.optionB
        : allQuiz?.[currentIndex]?.selectedAnswer.toLowerCase() === "c"
        ? allQuiz?.[currentIndex]?.optionC
        : allQuiz?.[currentIndex]?.selectedAnswer.toLowerCase() === "d"
        ? allQuiz?.[currentIndex]?.optionD
        : "";
    console.log({ wrongOptionValue });

    const result = [...allQuiz];
    result[currentIndex].correctAnswer = allQuiz[currentIndex]?.answer;
    result[currentIndex].correctOption = correctOptionValue;
    result[currentIndex].wrongOption = wrongOptionValue;

    setAllQuiz(result);
  };

  const handleNextQuestion = () => {
    updateResult();
    setCurrentIndex(currentIndex + 1);
  };

  const handleSubmitQuestion = async () => {
    updateResult();
    const quizResults = allQuiz.map((val) => ({
      question: val.question,
      selectedAnswer: val.selectedAnswer,
      correctAnswer: val.correctAnswer,
      correctOption: val.correctOption,
      isCorrect: val.isCorrect,
      wrongOption: val.wrongOption,
    }));

    const score = quizResults.filter((val) => val?.isCorrect)?.length;
    setQuizScore(score);

    const payload = {
      userInfo,
      userId: userInfo?._id,
      quizResults,
      scorePercentage: score,
      classId: state?.data?.classId,
      classRoomName: state?.data?.classRoomName,
      topic: state?.data?.topic,
      objCode: state?.data?.objCode,
      category: state?.data?.category,
      accountId: state?.data?.accountId,
      objective: state?.data?.objective,
      subject: state?.data?.subject,
    };
    const response = await createQuizResult(payload);
    if (response?.data.status === true) {
      setQuizResultId(response?.data.quizResultId);
      setShowGrade(true);
      setQuizScoreDialogOpen(true);
    }
  };

  console.log({ len: state });

  const handleAnalyzeResult = async () => {
    document.getElementById("my_modal_3").showModal();
    const failedResults = await allQuiz
      .filter((result) => !result?.isCorrect)
      .map((result) => ({
        question: result?.question,
        student_answer: result?.wrongOption,
        correct_answer: result?.correctOption,
      }));

    const newObject = {
      questions: failedResults,
      studentInfo: {
        age: userInfo?.age,
        learningObjectives: `${state?.data?.category}: ${(
          (+quizScore / state.data?.data?.questionsAndAnswers?.length) *
          100
        ).toFixed()}`,
        neurodiversity: userInfo?.neurodiversity,
        gender: userInfo?.gender,
        userId: userInfo?._id,
      },
      studentName: userInfo?.fullName,
    };

    const response = await analyzeResult(newObject);
    const analyzedResponseData = response.data;

    const updatedQuizResults = allQuiz.map((result) => {
      const analysis =
        analyzedResponseData.find((item) => item.question === result?.question)
          ?.analysis || "";
      return {
        ...result,
        analysis,
      };
    });
    setAnalyzedData(analyzedResponseData);
    setAllQuiz(updatedQuizResults);
    setDoneAnalysing(true);
    setQuizScoreDialogOpen(false);
    document.getElementById("my_modal_3").close();
  };

  const handleRetakeQuiz = () => {
    setQuizScore(0);
    setCurrentIndex(0);
    setShowGrade(false);
    getQuiz();
    // reload page
    window.location.reload();
  };

  const handleUpdateQuizResult = async () => {
    const payload = {
      id: quizResultId,
      quizResults: allQuiz,
    };

    const res = await updateQuizResult(payload);
    setDoneAnalysing(false);
    console.log("all here", res);
  };

  useEffect(() => {
    if (doneAnalysing) {
      handleUpdateQuizResult();
    }
  }, [doneAnalysing]);

  const speak = (text: string) => {
    // Stop any ongoing speech
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    // let currentWord = 0;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Set the speech rate to 0.8 (slower)
    //utterance.pitch = 1.5; // Set the pitch to 1.2 (more human-like)
    utteranceRef.current = utterance; // Set the ref to the current utterance
    // Handle the boundary event to update the current word index
    utterance.addEventListener("boundary", (event) => {
      if (event.name === "word") {
        currentWord++;
      }
    });

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      // setCurrentWordIndex(-1);
    }
  };

  return (
    <div className={`flex ${isLoading ? "blur-lg" : ""}`}>
      <dialog
        id="my_modal_3"
        className="modal w-screen min-w-screen min-h-screen"
      >
        <div className="flex flex-col items-center">
          <span className="loading loading-infinity loading-lg text-white"></span>
          <span className="text-lg text-white">
            Analyzing Result please wait, this will take a few seconds
          </span>
        </div>
      </dialog>

      <div className="px-4 min-h-screen w-full">
        {showGrade ? (
          <div className="text-2xl text-white w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/student">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/student/classrooms">Classrooms</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Link to={`/student/classrooms/${state.data.classId}`}>
                      Quizzes
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Result Analysis</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Dialog
              open={quizScoreDIalogOpen}
              onOpenChange={setQuizScoreDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    You got {quizScore} out of{" "}
                    {state?.data?.questionsAndAnswers?.length} correct.
                  </DialogTitle>
                  <DialogDescription className="flex gap-3 pt-5 items-center">
                    <div className="">Score: </div>
                    <Progress
                      value={(
                        (+quizScore /
                          +state?.data?.questionsAndAnswers?.length) *
                        100
                      ).toFixed()}
                      className="w-full h-2"
                    />
                    <div>
                      {(
                        (+quizScore /
                          +state?.data?.questionsAndAnswers?.length) *
                        100
                      ).toFixed()}
                      %
                    </div>
                  </DialogDescription>
                  {(+quizScore / +state?.data?.questionsAndAnswers?.length) *
                    100 <
                    80 && (
                    <p className="text-red-600 py-3">
                      You scored less than 80%. Do you want to retake the quiz?
                    </p>
                  )}
                  {(+quizScore / +state?.data?.questionsAndAnswers?.length) *
                    100 <
                    80 && (
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={handleAnalyzeResult}
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Analyzing your mistakes ..."
                          : "Analyze Mistake(s)"}
                      </Button>
                      <Button onClick={handleRetakeQuiz} type="submit">
                        Retake Quiz
                      </Button>
                    </DialogFooter>
                  )}
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {analyzedData.length > 0 && (
              <>
                <div className="mt-4 text-slate-800">Result Analysis </div>
                <div className="border-slate-300 border-[1px] mt-2 rounded-md text-slate-800 text-[16px] min-w-full ">
                  {analyzedData
                    .slice(
                      currentPage * itemsPerPage,
                      (currentPage + 1) * itemsPerPage
                    )
                    .map((i, index) => (
                      <div key={index} className="px-4">
                        <div className="text-[18px] font-bold mt-4">
                          Question {index + 1}:{" "}
                          <span className="first-letter:capitalize font-normal">
                            {i?.question}
                          </span>
                        </div>
                        <div className="text-[16px] mt-2" />
                        <TextWithLineBreaks texts={i?.analysis} />
                        <button
                          onClick={() => speak(i?.analysis)}
                          className="btn bg-blue-700 mt-2 text-white"
                        >
                          <FaRegCirclePlay /> Play
                        </button>
                        <button
                          onClick={stopSpeech}
                          className="btn bg-red-700 text-white mt-2 ml-2"
                        >
                          <FaRegCircleStop /> Stop
                        </button>
                      </div>
                    ))}
                  <div className="flex justify-between mt-4 px-4 py-4">
                    <button
                      onClick={() => {
                        currentPage - 1;
                      }}
                      disabled={currentPage === 0}
                      className="btn btn-secondary"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                      }}
                      disabled={
                        currentPage ==
                        Math.ceil(analyzedData.length / itemsPerPage) - 1
                      }
                      className="btn btn-secondary"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
            <div className="mt-8 text-black w-full">
              <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
              {allQuiz.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 mb-4 rounded-lg w-full ${
                    result?.isCorrect ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <div className="flex gap-4 justify-between items-center">
                    <div className="">
                      <p
                        className="font-semibold text-[18px]"
                        dangerouslySetInnerHTML={{
                          __html: latexToHTML(result?.question),
                        }}
                      ></p>
                      <p className="text-sm">
                        Your answer: {result?.selectedAnswer?.toUpperCase()}
                      </p>
                      <p className="text-sm">
                        Correct answer: {result?.correctAnswer?.toUpperCase()}
                      </p>
                      <span className="flex gap-1 text-sm">
                        <p>Correct option:</p>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: latexToHTML(result?.correctOption),
                          }}
                        ></p>
                      </span>
                    </div>
                    <p
                      className={`text-sm font-bold px-3 py-1 rounded ${
                        result?.isCorrect ? "bg-green-300" : "bg-red-300"
                      }`}
                    >
                      {result?.isCorrect ? "Correct" : "Wrong"}
                    </p>
                  </div>
                  {result?.analysis && (
                    <div className="text-sm border rounded mt-4 p-2 border-red-300">
                      <TextWithLineBreaks texts={result?.analysis} />
                    </div>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAnalyzeResult}
                disabled={isLoading}
              >
                {isLoading
                  ? "Analyzing your mistakes ..."
                  : "Analyze Mistake(s)"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {!allQuiz?.[currentIndex] ? (
              <div className="justify-center items-center text-[18px]">
                can not find quiz in this topic try another topic
              </div>
            ) : (
              <div className="min-w-full max-w-full">
                <div className="bg-background rounded-lg md:px-24 p-3 md:pt-14 md:pb-20 space-y-6">
                  <h3 className="text-2xl font-medium capitalize">
                    {allQuiz?.[0]?.learningObjective}
                  </h3>
                  {allQuiz?.[currentIndex]?.question && (
                    <h4
                      className="rounded bg-[#EBF0FC] px-4 py-5 font-medium first-letter:uppercase"
                      dangerouslySetInnerHTML={{
                        __html: latexToHTML(allQuiz?.[currentIndex]?.question),
                      }}
                    ></h4>
                  )}
                  <div>
                    <div className="grid md:grid-cols-2 gap-3 mb-5 md:mb-0">
                      <label
                        className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                          allQuiz?.[currentIndex]?.selectedAnswer === "a" &&
                          "bg-primary/20"
                        } border-primary text-start items-center flex gap-3 cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          checked={
                            allQuiz?.[currentIndex]?.selectedAnswer === "a"
                          }
                          onChange={() => {
                            const prevData = [...allQuiz];
                            prevData[currentIndex].selectedAnswer = "a";
                            if (
                              "a" ==
                              allQuiz?.[currentIndex]?.answer.toLowerCase()
                            ) {
                              prevData[currentIndex].isCorrect = true;
                            }
                            setAllQuiz(prevData);
                          }}
                          className="appearance-none"
                        />
                        <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                          A
                        </span>{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: latexToHTML(
                              allQuiz?.[currentIndex]?.optionA
                            ),
                          }}
                        ></span>
                      </label>
                      <label
                        className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                          allQuiz?.[currentIndex]?.selectedAnswer === "b" &&
                          "bg-primary/20"
                        } border-primary text-start items-center flex gap-3 cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          checked={
                            allQuiz?.[currentIndex]?.selectedAnswer === "b"
                          }
                          onChange={() => {
                            const prevData = [...allQuiz];
                            prevData[currentIndex].selectedAnswer = "b";
                            if (
                              "b" ==
                              allQuiz?.[currentIndex]?.answer.toLowerCase()
                            ) {
                              prevData[currentIndex].isCorrect = true;
                            }
                            setAllQuiz(prevData);
                          }}
                          className="appearance-none"
                        />
                        <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                          B
                        </span>{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: latexToHTML(
                              allQuiz?.[currentIndex]?.optionB
                            ),
                          }}
                        ></span>
                      </label>
                      <label
                        className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                          allQuiz?.[currentIndex]?.selectedAnswer === "c" &&
                          "bg-primary/20"
                        } border-primary text-start items-center flex gap-3 cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          checked={
                            allQuiz?.[currentIndex]?.selectedAnswer === "c"
                          }
                          onChange={() => {
                            const prevData = [...allQuiz];
                            prevData[currentIndex].selectedAnswer = "c";
                            if (
                              "c" ==
                              allQuiz?.[currentIndex]?.answer.toLowerCase()
                            ) {
                              prevData[currentIndex].isCorrect = true;
                            }
                            setAllQuiz(prevData);
                          }}
                          className="appearance-none"
                        />
                        <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                          C
                        </span>{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: latexToHTML(
                              allQuiz?.[currentIndex]?.optionC
                            ),
                          }}
                        ></span>
                      </label>
                      <label
                        className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                          allQuiz?.[currentIndex]?.selectedAnswer === "d" &&
                          "bg-primary/20"
                        } border-primary text-start items-center flex gap-3 cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          checked={
                            allQuiz?.[currentIndex]?.selectedAnswer === "d"
                          }
                          onChange={() => {
                            const prevData = [...allQuiz];
                            prevData[currentIndex].selectedAnswer = "d";
                            if (
                              "d" ==
                              allQuiz?.[currentIndex]?.answer.toLowerCase()
                            ) {
                              prevData[currentIndex].isCorrect = true;
                            }
                            setAllQuiz(prevData);
                          }}
                          className="appearance-none"
                        />
                        <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                          D
                        </span>{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: latexToHTML(
                              allQuiz?.[currentIndex]?.optionD
                            ),
                          }}
                        ></span>
                      </label>
                    </div>
                  </div>
                  <div className="relative md:pt-9">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentIndex(currentIndex - 1);
                      }}
                      className="absolute"
                      type="button"
                      disabled={currentIndex == 0}
                    >
                      Previous
                    </Button>
                    {currentIndex + 1 == allQuiz?.length ? (
                      <Button
                        onClick={handleSubmitQuestion}
                        disabled={
                          !allQuiz?.[currentIndex]?.selectedAnswer ||
                          quizSubmitting
                        }
                        className="absolute right-0"
                        type="button"
                      >
                        {quizSubmitting && (
                          <span className="mr-2 animate-spin">
                            <Loader />
                          </span>
                        )}
                        Submit
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!allQuiz?.[currentIndex]?.selectedAnswer}
                        className="absolute right-0"
                        type="button"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    // <QuizTemp data={state} />
  );
};

export default Quiz;
