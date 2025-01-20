import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useAnalyzeResultMutation,
  useQuizRandomSelectMutation,
  useCreateQuizResultMutation,
  useUpdateQuizResultMutation,
  useQuizNextQuestionMutation,
} from "../../features/api/apiSlice";
import { Button } from "../ui/button";
import { FaRegCirclePlay, FaRegCircleStop } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Progress } from "../ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Link } from "react-router-dom";
import TextWithLineBreaks from "../others/textWithLineBreaks";
import { latexToHTML } from "@/lib/utils";
import Mathlive from "mathlive";

const Index = (props) => {
  const [sessionId, setSessionId] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizResults, setQuizResults] = useState([]);
  const [showGrade, setShowGrade] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalDifficultyLevel, setTotalDifficultyLevel] = useState(0);
  const [correctDifficultyLevel, setCorrectDifficultyLevel] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [analyzedData, setAnalyzedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1;
  const [analyzeResult, { isLoading }] = useAnalyzeResultMutation();
  const [quizNextQuestion] = useQuizNextQuestionMutation();
  const utteranceRef = useRef(null);
  const [createQuizResult] = useCreateQuizResultMutation();
  const [quizResultId, setQuizResultId] = useState();
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [doneAnalysing, setDoneAnalysing] = useState(false);
  const [realQuiz, setRealQuiz] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo)
  const [newData2, setNewData2] = useState([]);
  const [scorePercentage, setScorePercentage] = useState(0);
  let score: any;

  let ldata = props?.data?.data;
  console.log("this is our ldata right here:", ldata);
  let newdata: any = [];
  

  const [quizRandomSelect] = useQuizRandomSelectMutation();
  const [updateQuizResult] = useUpdateQuizResultMutation();
  let data: any;

  const [timeRemaining, setTimeRemaining] = useState(null);
  const timerRef = useRef(null);

  const [quizResultHandled, setQuizResultHandled] = useState(false);

  useEffect(() => {
    if (ldata?.quizDuration && !timeRemaining) {
      const durationInMs = ldata.quizDuration * 60 * 1000;
      setTimeRemaining(durationInMs);
    }
  }, [ldata]);

  useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && !showGrade) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [timeRemaining, showGrade]);

  const handleTimeUp = () => {
    const finalResults = newData2?.map((quiz, index) => {
      const existingResult = quizResults[index];
      if (existingResult) {
        return existingResult;
      }

      return {
        question: quiz.question,
        selectedAnswer: "",
        correctAnswer: quiz.answer,
        correctOption: quiz.answer.toLowerCase() === "a" ? quiz.optionA :
                      quiz.answer.toLowerCase() === "b" ? quiz.optionB :
                      quiz.answer.toLowerCase() === "c" ? quiz.optionC :
                      quiz.answer.toLowerCase() === "d" ? quiz.optionD : "",
        isCorrect: false,
        wrongOption: "",
        options: selectedAnswer.toLowerCase() === "a" ? quiz.optionA :
                       selectedAnswer.toLowerCase() === "b" ? quiz.optionB :
                       selectedAnswer.toLowerCase() === "c" ? quiz.optionC :
                       selectedAnswer.toLowerCase() === "d" ? quiz.optionD : "",

        difficultyLevel: parseInt(quiz.difficultyLevel) || 0,
        selectedOption: selectedAnswer.toLowerCase() === "a" ? quiz.optionA :
                       selectedAnswer.toLowerCase() === "b" ? quiz.optionB :
                       selectedAnswer.toLowerCase() === "c" ? quiz.optionC :
                       selectedAnswer.toLowerCase() === "d" ? quiz.optionD : "",

      };
    });

    setQuizResults(finalResults);
    const finalCorrectAnswers = finalResults.filter(result => result.isCorrect).length;
    setCorrectAnswers(finalCorrectAnswers);
    setShowGrade(true);
    setIsQuizCompleted(true);
  };

  const getQuiz = async () => {
    if (ldata) {
      const payload = {
        objCode: ldata?.objCode,
        numberOfQuestions: ldata?.numberOfQuestions,
        followUp: ldata?.followUp,
        quizDuration: ldata?.quizDuration,
      };
      const res = await quizRandomSelect(payload);
      console.log("this is this res i am looking for", res);
      
      if (res.data) {
        setSessionId(res.data.sessionId);
        setCurrentQuiz(res.data);
        setTotalDifficultyLevel(res.data.totalQuestions);
      }
    }
  };

  useEffect(() => {
    getQuiz();
  }, [ldata]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer) return;

    try {
      const response = await quizNextQuestion({
        sessionId,
        userAnswer: selectedAnswer,
        selectedOption: selectedAnswer.toLowerCase() === "a" ? currentQuiz.optionA :
                       selectedAnswer.toLowerCase() === "b" ? currentQuiz.optionB :
                       selectedAnswer.toLowerCase() === "c" ? currentQuiz.optionC :
                       selectedAnswer.toLowerCase() === "d" ? currentQuiz.optionD : "",
        difficultyLevel: currentQuiz?.difficultyLevel
      });

      if (response.data.complete) {
        const results = response.data;
        console.log("this is the results right here:", results);
       // console.log("this is the results right here:", (results.answers.filter((answer:any) => answer.isCorrect).length/results.answers.length)*100);
        setQuizResults(results.answers);
        setScorePercentage(results.scorePercentage);
        score = results.scorePercentage;
        setCorrectAnswers(results.correctAnswers);
        setShowGrade(true);
        setIsQuizCompleted(true);

        
        const payload = {
          userInfo,
          quizResults: results.answers,
          scorePercentage: results.scorePercentage,
          classId: ldata?.classId,
          classRoomName: ldata?.classRoomName,
          topic: ldata?.topic,
          objCode: ldata?.objCode,
          category: ldata?.category,
          accountId: ldata?.accountId,
          userId: userInfo?._id,
          objective: ldata?.objective,
          subject: ldata?.subject,
        };

       console.log("this is our  payload right here:", payload);
      


        handleQuizResult(payload);
      } else {
        setCurrentQuiz(response.data);
        setSelectedAnswer("");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const handleRetakeQuiz = () => {
    setCorrectAnswers(0);
    setSelectedAnswer("");
    setCurrentIndex(0);
    setCurrentQuiz(data[0]);
    setShowGrade(false);
    setQuizResults([]);
    getQuiz();
    window.location.reload();
  };

  const speak = (text) => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    let currentWord = 0;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utteranceRef.current = utterance;
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
    }
  };

  const QuizContent = () => {
    return (
      <div className="bg-background rounded-lg md:px-24 p-3 md:pt-14 md:pb-20 space-y-6">
        <Timer />
        <h3 className="text-2xl font-medium capitalize">{currentQuiz?.objective}</h3>
        {currentQuiz?.question && (
          <h4
            className="rounded bg-[#EBF0FC] px-4 py-5 font-medium first-letter:uppercase"
            dangerouslySetInnerHTML={{
              __html: currentQuiz?.question
            }}
          ></h4>
        )}
        
        <div className="grid md:grid-cols-2 gap-3 mb-5 md:mb-0">
          {['a', 'b', 'c', 'd'].map((option) => (
            <label
              key={option}
              className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                selectedAnswer === option && "bg-primary/20"
              } border-primary text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect(option)}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelect(option)}
                className="appearance-none"
              />
              <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                {option.toUpperCase()}
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: latexToHTML(currentQuiz?.[`option${option.toUpperCase()}`])
                }}
              ></span>
            </label>
          ))}
        </div>

        <div className="relative md:pt-9">
          <Button
            onClick={handleNextQuestion}
            className="absolute right-0"
            type="button"
            disabled={!selectedAnswer}
          >
            {currentQuiz?.currentIndex === currentQuiz?.totalQuestions - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    );
  };

  const Timer = () => {
    if (!timeRemaining && timeRemaining !== 0) return null;

    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

    const getTimerColor = () => {
      if (timeRemaining <= 60000) {
        return 'text-red-500';
      } else if (timeRemaining <= 180000) {
        return 'text-yellow-500';
      }
      return 'text-slate-300';
    };

    return (
      <div className="bg-black text-white rounded-lg p-4 w-full mt-10">
        <div className="text-sm font-semibold justify-start text-slate-300">
          Timer
        </div>
        <div className={`text-2xl font-bold ${getTimerColor()}`}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>
    );
  };

  const handleQuizResult = async (payload) => {
    if (quizResultHandled) return;
    setQuizResultHandled(true);

    const response = await createQuizResult(payload);
    console.log("Response here: ", response.data.quizResultId);
    if (response?.data.status === true) {
      setQuizResultId(response?.data.quizResultId);
    }
  };

  const [quizScoreDIalogOpen, setQuizScoreDialogOpen] = useState(true);

  useEffect(() => {
    if (isQuizCompleted) {
      const payload = {
        userInfo,
        quizResults,
        scorePercentage: score,
        classId: ldata?.classId,
        classRoomName: ldata?.classRoomName,
        topic: ldata?.topic,
        objCode: ldata?.objCode,
        category: ldata?.category,
        accountId: ldata?.accountId,
        userId: userInfo?._id,
        objective: ldata?.objective,
        subject: ldata?.subject,
      };
      console.log("done", payload);
      handleQuizResult(payload);
    }
  }, [isQuizCompleted]);

  const Grade = () => {
    // const scorePercentage = ((correctDifficultyLevel / totalDifficultyLevel) * 100).toFixed(2);
    // score = scorePercentage;
    // const scorePercentage = quizResults?.scorePercentage;
    // score = scorePercentage;

    const handleNextPage = () => {
      if (currentPage < Math.ceil(analyzedData.length / itemsPerPage) - 1) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePrevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };

    const handleAnalyzeResult = async () => {
      document.getElementById("my_modal_3").showModal();
      const failedResults = await quizResults
        .filter((result) => !result?.isCorrect)
        .map((result) => ({
          question: result?.question,
          student_answer: result?.wrongOption,
          correct_answer: result?.correctOption,
        }));

      const newObject = {
        questions: failedResults,
        studentInfo: {
          age: userInfo?.dob,
          learningObjectives: `${ldata?.objective}: ${scorePercentage}`,
          neurodiversity: userInfo?.neurodiversity,
          gender: userInfo?.gender,
          userId: userInfo?._id,
        },
        studentName: userInfo?.fullName,
      };

      console.log("this is our newObject right here:", newObject);
      const response = await analyzeResult(newObject);
      const analyzedResponseData = response.data;

      const updatedQuizResults = quizResults.map((result) => {
        const analysis =
          analyzedResponseData.find(
            (item) => item.question === result?.question
          )?.analysis || "";
        return {
          ...result,
          analysis,
        };
      });
      setAnalyzedData(analyzedResponseData);
      setQuizResults(updatedQuizResults);
      setDoneAnalysing(true);
      setQuizScoreDialogOpen(false);

       document.getElementById("my_modal_3").close();
    };

    const handleUpdateQuizResult = async () => {
      const payload = {
        id: quizResultId,
        quizResults: quizResults,
      };

      const res = await updateQuizResult(payload);
      setDoneAnalysing(false);
    };

    useEffect(() => {
      if (doneAnalysing) {
        handleUpdateQuizResult();
      }
    }, [doneAnalysing]);

    return (
      <div className="text-2xl text-white w-full">
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
              <BreadcrumbLink>
                <Link to={`/student/classrooms/${ldata.classId}`}>Quizzes</Link>
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
               
                {data?.questionsAndAnswers.length} 
              </DialogTitle>
              <DialogDescription className="flex gap-3 pt-5 items-center">
                <div className="">Score: </div>
                <Progress value={scorePercentage} className="w-full h-2" />
                <div>{Math.round(scorePercentage)}%</div>
              </DialogDescription>
              {scorePercentage < 50 && (
                <p className="text-red-600 py-3">
                  You scored less than 50%. Do you want to retake the quiz?
                </p>
              )}
              {scorePercentage < 50 && (
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
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={
                    currentPage ===
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
          {quizResults.map((result, index) => (
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
                    Correct answer: {result?.correctAnswer.toUpperCase()}
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
          {
            // if the score is less than 50, show the analyze result button
            scorePercentage < 50 && (
            <Button
              variant="outline"
              onClick={handleAnalyzeResult}
              disabled={isLoading}
            >
              {isLoading ? "Analyzing your mistakes ..." : "Analyze Mistake(s)"}
            </Button>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
          <div className="flex">
            <Grade />
          </div>
        ) : (
          <>
            {currentQuiz === null ? (
              <div className="justify-center items-center text-[18px]">
                can not find quiz in this topic try another topic
              </div>
            ) : (
              <div className="min-w-full max-w-full">
                <QuizContent />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;