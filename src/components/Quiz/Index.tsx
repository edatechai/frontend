import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  useAnalyzeResultMutation,
  useQuizRandomSelectMutation,
  useCreateQuizResultMutation,
  useUpdateQuizResultMutation,
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

const Index = (props) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrade, setShowGrade] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [analyzedData, setAnalyzedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1; // Show one item per page
  const [analyzeResult, { isLoading, isSuccess, isError, error }] =
    useAnalyzeResultMutation();
  const [currentWordIndex, setCurrentWordIndex] = useState(-1); // Track the current word index
  const [speakingText, setSpeakingText] = useState(""); // Track the text being spoken
  const utteranceRef = useRef(null); // Ref to hold the SpeechSynthesisUtterance
  const [createQuizResult] = useCreateQuizResultMutation();
  const [quizResultId, setQuizResultId] = useState();
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [doneAnalysing, setDoneAnalysing] = useState(false);
  let score = "";

  const data = props?.data?.data;
  console.log("find ddata", data);
  useEffect(() => {
    setIsQuizCompleted(false);
  });

  const [quizRandomSelect] = useQuizRandomSelectMutation();
  const [updateQuizResult] = useUpdateQuizResultMutation();

  const getQuiz = async () => {
    if (data) {
      const payload = {
        objCode: data?.objCode,
        numberOfQuestions: data?.numberOfQuestions,
      };
      const res = await quizRandomSelect(payload);
      console.log("me", res);
      if (res.data?.length > 0) {
        setCurrentQuiz(res?.data[0]);
      }
    }
  };

  useEffect(() => {
    getQuiz();
  }, [data]);

  const handleAnswerSelect = (answer) => {
    // console.log(isQuizCompleted)
    setSelectedAnswer(answer);
    // if (isQuizComplete()) {
    //   setIsQuizCompleted(true);
    // }
  };

  // const handleTimeExpired = () => {
  //   if (timedQuiz) {
  //     setIsQuizCompleted(true);
  //   }
  // };

  const handleNextQuestion = () => {
    const isCorrect =
      selectedAnswer.toLowerCase() === currentQuiz?.answer.toLowerCase();

    const correctOptionValue =
      currentQuiz?.answer.toLowerCase() === "a"
        ? currentQuiz?.optionA
        : currentQuiz?.answer.toLowerCase() === "b"
        ? currentQuiz?.optionB
        : currentQuiz?.answer.toLowerCase() === "c"
        ? currentQuiz?.optionC
        : currentQuiz?.answer.toLowerCase() === "d"
        ? currentQuiz?.optionD
        : "";

    const wrongOptionValue =
      selectedAnswer.toLowerCase() === "a"
        ? currentQuiz?.optionA
        : selectedAnswer.toLowerCase() === "b"
        ? currentQuiz?.optionB
        : selectedAnswer.toLowerCase() === "c"
        ? currentQuiz?.optionC
        : selectedAnswer.toLowerCase() === "d"
        ? currentQuiz?.optionD
        : "";

    const result = {
      question: currentQuiz?.question,
      selectedAnswer: selectedAnswer,
      correctAnswer: currentQuiz?.answer,
      correctOption: correctOptionValue,
      isCorrect: isCorrect,
      wrongOption: wrongOptionValue,
    };

    setQuizResults([...quizResults, result]);

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    setSelectedAnswer("");
    if (currentIndex < data.questionsAndAnswers.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuiz(data.questionsAndAnswers[currentIndex + 1]);
    } else {
      setShowGrade(true);
      setIsQuizCompleted(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCorrectAnswers(0);
    setSelectedAnswer("");
    setCurrentIndex(0);
    setCurrentQuiz(data.questionsAndAnswers[0]);
    setShowGrade(false);
    setQuizResults([]);
    getQuiz();
    // reload page
    window.location.reload();
  };

  const speak = (text) => {
    // Stop any ongoing speech
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    const words = text.split(" "); // Split the text into words
    let currentWord = 0; // Initialize current word index
    setSpeakingText(text); // Set the speaking text
    setCurrentWordIndex(0); // Reset the word index

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Set the speech rate to 0.8 (slower)
    //utterance.pitch = 1.5; // Set the pitch to 1.2 (more human-like)
    utteranceRef.current = utterance; // Set the ref to the current utterance
    // Handle the boundary event to update the current word index
    utterance.addEventListener("boundary", (event) => {
      if (event.name === "word") {
        currentWord++;
        setCurrentWordIndex(currentWord);
      }
    });

    // Handle the end event to reset the word index
    utterance.addEventListener("end", () => {
      setCurrentWordIndex(-1);
    });

    window.speechSynthesis.speak(utterance);
  };

  // const speak = (text) => {
  //   // Stop any ongoing speech
  //   if (utteranceRef.current) {
  //     window.speechSynthesis.cancel();
  //   }

  //   const words = text.split(' '); // Split the text into words
  //   let currentWord = 0; // Initialize current word index
  //   setSpeakingText(text); // Set the speaking text
  //   setCurrentWordIndex(0); // Reset the word index

  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.rate = 0.8; // Set the speech rate to 0.8 (slower)
  //   utterance.pitch = 1.2; // Set the pitch to 1.2 (more human-like)
  //   //utterance.volume = 1; // Set the volume to 1 (maximum)
  //   utterance.ref.current = utterance; // Set the ref to the current utterance

  //   // Handle the boundary event to update the current word index
  //   utterance.addEventListener('boundary', (event) => {
  //     if (event.name === 'word') {
  //       currentWord++;
  //       setCurrentWordIndex(currentWord);
  //     }
  //   });

  //   // Handle the end event to reset the word index
  //   utterance.addEventListener('end', () => {
  //     setCurrentWordIndex(-1);
  //   });

  //   window.speechSynthesis.speak(utterance);
  // }

  const stopSpeech = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      setCurrentWordIndex(-1);
    }
  };

  const Sidebar = () => {
    return (
      <div className="w-64 bg-white shadow-lg p-4 max-h-screen  border-slate-300 border-[1px] rounded-lg min-w-[20%]">
        <div className="flex items-center mb-6">
          <div>
            <div className="text-lg font-semibold">{data?.subject}</div>
            <div className="text-sm text-gray-500">{data?.category}</div>
          </div>
        </div>

        <div className="space-y-2">
          {data?.questionsAndAnswers.map((i, index) => (
            <div
              onClick={() => {
                setCurrentQuiz(i);
                setCurrentIndex(index);
              }}
              key={index}
              className={`p-4 rounded-lg cursor-pointer ${
                index === currentIndex ? "bg-purple-200" : "bg-green-200"
              }`}
            >
              <div className="font-semibold">Quiz {index + 1}</div>
              <div className="text-sm text-gray-700">{`${data?.topic}`}</div>
            </div>
          ))}
        </div>
        <Timer />
      </div>
    );
  };

  const QuizContent = () => {
    return (
      <div className="border-slate-300 border-[1px] rounded-lg p-6 space-y-6">
        <h3 className="text-2xl font-medium capitalize">{data?.objective}</h3>
        <div className="flex items-center">
          <hr className="w-8 h-0.5 bg-primary" />
          <div className="border-x-2 border-primary rounded-full p-3 w-full">
            <div className="text-lg text-center border-2 border-primary rounded-full font-semibold mb-2 p-3 first-letter:capitalize">
              {currentQuiz?.question}
            </div>
          </div>
          <hr className="w-8 h-0.5 bg-primary" />
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <span className="flex items-center">
              <hr className="bg-primary w-10 h-0.5" />
              <div className="border-x-2 border-primary p-1.5 rounded-full w-full">
                <label
                  className={`w-full py-4 rounded-full text-foreground hover:border-lime-700 ${
                    selectedAnswer === "a" && "bg-primary/20"
                  } border-primary border-2 text-start items-center flex gap-3 cursor-pointer`}
                  onClick={() => handleAnswerSelect("a")}
                >
                  <input
                    type="checkbox"
                    checked={selectedAnswer === "a"}
                    onChange={() => handleAnswerSelect("a")}
                    className="appearance-none"
                  />
                  <span className="flex items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                    A
                  </span>{" "}
                  {currentQuiz?.optionA}
                </label>
              </div>
              <hr className="bg-primary w-10 h-0.5" />
              <div className="border-x-2 border-primary p-1.5 rounded-full w-full">
                <label
                  className={`w-full py-4 rounded-full text-foreground hover:border-lime-700 ${
                    selectedAnswer === "b" && "bg-primary/20"
                  } border-primary border-2 text-start items-center flex gap-3 cursor-pointer`}
                  onClick={() => handleAnswerSelect("b")}
                >
                  <input
                    type="checkbox"
                    checked={selectedAnswer === "b"}
                    onChange={() => handleAnswerSelect("b")}
                    className="appearance-none"
                  />
                  <span className="flex items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                    B
                  </span>{" "}
                  {currentQuiz?.optionB}
                </label>
              </div>
              <hr className="bg-primary w-10 h-0.5" />
            </span>

            <span className="flex items-center">
              <hr className="bg-primary w-10 h-0.5" />
              <div className="border-x-2 border-primary p-1.5 rounded-full w-full">
                <label
                  className={`w-full py-4 rounded-full text-foreground hover:border-lime-700 ${
                    selectedAnswer === "c" && "bg-primary/20"
                  } border-primary border-2 text-start items-center flex gap-3 cursor-pointer`}
                  onClick={() => handleAnswerSelect("c")}
                >
                  <input
                    type="checkbox"
                    checked={selectedAnswer === "c"}
                    onChange={() => handleAnswerSelect("c")}
                    className="appearance-none"
                  />
                  <span className="flex items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                    C
                  </span>{" "}
                  {currentQuiz?.optionC}
                </label>
              </div>
              <hr className="bg-primary w-10 h-0.5" />
              <div className="border-x-2 border-primary p-1.5 rounded-full w-full">
                <label
                  className={`w-full py-4 rounded-full text-foreground hover:border-lime-700 ${
                    selectedAnswer === "d" && "bg-primary/20"
                  } border-primary border-2 text-start items-center flex gap-3 cursor-pointer`}
                  onClick={() => handleAnswerSelect("d")}
                >
                  <input
                    type="checkbox"
                    checked={selectedAnswer === "d"}
                    onChange={() => handleAnswerSelect("d")}
                    className="appearance-none"
                  />
                  <span className="flex items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                    D
                  </span>{" "}
                  {currentQuiz?.optionD}
                </label>
              </div>
              <hr className="bg-primary w-10 h-0.5" />
            </span>
          </div>
        </div>
        {/* <div className="flex justify-between">
          <button
            className="btn btn-secondary"
            onClick={() => setShowGrade(true)}
          >
            Finish quiz
          </button>
          <button className="btn btn-primary" onClick={handleNextQuestion}>
            Next question
          </button>
        </div> */}
        <div style={{ position: "relative", marginBlock: "10px" }}>
          {/* {currentQuestion > 0 && ( */}
          <Button
            variant="outline"
            // onClick={handlePrevious}
            // disabled={isQuizCompleted}
            className="absolute"
            type="button"
          >
            Previous
          </Button>

          <Button
            onClick={handleNextQuestion}
            // disabled={
            //   !values?.[`question_${currentQuestion}`] || isQuizCompleted
            // }
            className="absolute right-0"
            type="button"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const Timer = () => {
    return (
      <div className="bg-black text-white rounded-lg p-4 w-full mt-10">
        <div className="text-sm font-semibold justify-start text-slate-300">
          Timer
        </div>
        <div className="text-2xl font-bold text-slate-300">00:59:32</div>
      </div>
    );
    // return (
    //   <div className="bg-black text-white rounded-lg p-4 w-full mt-10">
    //     <div className="text-sm font-semibold justify-start text-slate-300">Timer</div>
    //     <div className="text-2xl font-bold text-slate-300">
    //       {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    //     </div>
    //   </div>
    // );
  };

  const handleQuizResult = async (payload) => {
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
        classId: data?.classId,
        classRoomName: data?.classRoomName,
        topic: data?.topic,
        objCode: data?.objCode,
        category: data?.category,
        accountId: data?.accountId,
        userId: userInfo?._id,
      };
      handleQuizResult(payload);
    }
  }, [isQuizCompleted]);

  const Grade = () => {
    const scorePercentage =
      (correctAnswers / data?.questionsAndAnswers.length) * 100;
    score = scorePercentage;
    //setNewScore(scorePercentage)
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
        .filter((result) => !result.isCorrect)
        .map((result) => ({
          question: result.question,
          student_answer: result.wrongOption,
          correct_answer: result.correctOption,
        }));

      const newObject = {
        questions: failedResults,
        student_info: {
          age: userInfo?.age,
          learning_objectives: `${data?.category}: ${scorePercentage}`,
          disability: userInfo?.neurodiversity,
        },
        student_name: userInfo?.fullName,
      };

      const response = await analyzeResult(newObject);
      const analyzedResponseData = response.data;

      const updatedQuizResults = quizResults.map((result) => {
        const analysis =
          analyzedResponseData.find((item) => item.question === result.question)
            ?.analysis || "";
        return {
          ...result,
          analysis,
        };
      });
      setAnalyzedData(analyzedResponseData);
      setQuizResults(updatedQuizResults);
      setDoneAnalysing(true);
      console.log("all good", quizResults);
      setQuizScoreDialogOpen(false);

      document.getElementById("my_modal_3").close();
    };

    console.log("outside", quizResults);
    console.log("quizResultId", quizResultId);

    const handleUpdateQuizResult = async () => {
      const payload = {
        id: quizResultId,
        quizResults: quizResults,
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
                <Link to={`/student/classrooms/${data.classId}`}>Quizzes</Link>
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
                You got {correctAnswers} out of{" "}
                {data?.questionsAndAnswers.length} correct.
              </DialogTitle>
              <DialogDescription className="flex gap-3 pt-5 items-center">
                <div className="">Score: </div>
                <Progress value={scorePercentage} className="w-full h-2" />
                <div>{scorePercentage}%</div>
              </DialogDescription>
              {scorePercentage < 80 && (
                <p className="text-red-600 py-3">
                  You scored less than 80%. Do you want to retake the quiz?
                </p>
              )}
              {scorePercentage < 80 && (
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
            <div className="px-2 border-slate-300 border-[1px] mt-2 rounded-md text-slate-800 text-[16px] min-w-full ">
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
                result.isCorrect ? "bg-green-200" : "bg-red-200"
              }`}
            >
              <div className="font-semibold text-[18px]">
                Question: {result.question}
              </div>
              <div className="text-sm">
                Your answer: {result.selectedAnswer.toUpperCase()}
              </div>
              <div className="text-sm">
                Correct answer: {result.correctAnswer.toUpperCase()}
              </div>
              <div className="text-sm">
                Correct option: {result.correctOption}
              </div>
              <div className="text-sm font-bold">
                {result.isCorrect ? "Correct" : "Wrong"}
              </div>
              {result?.analysis && (
                <div className="text-sm">
                  <TextWithLineBreaks texts={results?.analysis} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* <div className="mt-8 text-black">
        <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
        {quizResults.map((result, index) => (
          <div key={index} className={`p-4 mb-4 rounded-lg ${result.isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
            <div className="font-semibold text-[18px]">Question: {result.question}</div>
            <div className="text-sm">Your answer: {result.selectedAnswer.toUpperCase()}</div>
            <div className="text-sm">Correct answer: {result.correctAnswer.toUpperCase()}</div>
            <div className="text-sm">Correct option: {result.correctOption}</div>
            <div className="text-sm font-bold">{result.isCorrect ? 'Correct' : 'Wrong'}</div>
            {result?.analysis && (
              <div className="text-sm">Analysis: {result?.analysis}</div>
            )}
          </div>
        ))}
      </div> */}
      </div>
    );
  };

  return (
    <div
      className={`flex w-full min-w-full bg-white p-4 ${
        isLoading ? "blur-lg" : ""
      }`}
    >
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

      {/* <Sidebar /> */}
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
