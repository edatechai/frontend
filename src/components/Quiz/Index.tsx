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
import { latexToHTML } from "@/lib/utils";
import Mathlive from "mathlive";

const Index = (props) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalDifficultyLevel, setTotalDifficultyLevel] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrade, setShowGrade] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const userInfo = useSelector((state) => state.user.userInfo);
  const [analyzedData, setAnalyzedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1; // Show one item per page
  const [analyzeResult, { isLoading }] = useAnalyzeResultMutation();
  // const [currentWordIndex, setCurrentWordIndex] = useState(-1); // Track the current word index
  // const [speakingText, setSpeakingText] = useState(""); // Track the text being spoken
  const utteranceRef = useRef(null); // Ref to hold the SpeechSynthesisUtterance
  const [createQuizResult] = useCreateQuizResultMutation();
  const [quizResultId, setQuizResultId] = useState();
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [doneAnalysing, setDoneAnalysing] = useState(false);
  const [correctDifficultyLevel, setCorrectDifficultyLevel] = useState(0);
  const [realQuiz, setRealQuiz] = useState(null);
  const [newData2, setNewData2] = useState([]);
  let score: any;

  let ldata = props?.data?.data;
  let newdata: any = [];

 

  const [quizRandomSelect] = useQuizRandomSelectMutation();
  const [updateQuizResult] = useUpdateQuizResultMutation();
  let data: any;

  const [timeRemaining, setTimeRemaining] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (ldata?.quizDuration && !timeRemaining) {
      // Convert minutes to milliseconds
      const durationInMs = ldata.quizDuration * 60 * 1000;
      setTimeRemaining(durationInMs);
    }
   
  }, [ldata]);

  useEffect(() => {
    if (timeRemaining && timeRemaining > 0 && !showGrade) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1000) { // Less than 1 second remaining
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
    // Create results for all unanswered questions
    const finalResults = newData2?.map((quiz, index) => {
      // Use existing result if question was answered
      const existingResult = quizResults[index];
      if (existingResult) {
        return existingResult;
      }

      // Create a new result for unanswered question
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
        difficultyLevel: parseInt(quiz.difficultyLevel) || 0,
      };
    });

    // Update quiz results with all questions (answered and unanswered)
    setQuizResults(finalResults);
    
    // Calculate final score based on only answered questions
    const finalCorrectAnswers = finalResults.filter(result => result.isCorrect).length;
    setCorrectAnswers(finalCorrectAnswers);
    
    // Show the grade view
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
      console.log("me", res);
      ldata = res?.data;
      
      if (res.data?.length > 0) {
        // map the new data to get the difficulty level of each question and sum them together
        const totalDifficultyLevel = res?.data.reduce((sum, question) => sum + parseInt(question.difficultyLevel), 0);
        setTotalDifficultyLevel(totalDifficultyLevel);
        console.log("totalDifficultyLevel", totalDifficultyLevel);
        setNewData2(res?.data);
        setCurrentQuiz(res?.data[0]);
       
      }
    }
  };


  

  useEffect(() => {
    getQuiz();
  }, [ldata]);

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
    // alert("this is currentQuiz", currentQuiz);
    console.log("this is newdata", newData2);
    console.log("selectedAnswer", selectedAnswer);
   
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

    console.log({ correctOptionValue });

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

    console.log({ wrongOptionValue });

    const result = {
      question: currentQuiz?.question,
      selectedAnswer: selectedAnswer,
      correctAnswer: currentQuiz?.answer,
      correctOption: correctOptionValue,
      isCorrect: isCorrect,
      wrongOption: wrongOptionValue,
    };

    console.log({ result });

    // If there's already a result for this question, update it instead of adding new
    const updatedResults = [...quizResults];
    if (currentIndex < updatedResults.length) {
      // Remove previous correct answer count if it was correct
      if (updatedResults[currentIndex]?.isCorrect) {
        setCorrectAnswers(correctAnswers - 1);
      }
      // Add new correct answer count if current is correct
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);

        
      }
      updatedResults[currentIndex] = result;
      setQuizResults(updatedResults);
    } else {
      // Add new result if we're on a new question
      setQuizResults([...quizResults, result]);
      if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
        setCorrectDifficultyLevel(correctDifficultyLevel + parseInt(newData2[currentIndex].difficultyLevel) || 0 );
       // setCorrectDifficultyLevel(correctDifficultyLevel + parseInt(newData2[currentIndex + 1].difficultyLevel) || 0 );
      }
    }

    if (currentIndex < newData2?.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuiz(newData2[currentIndex + 1]);
    
      
    
    } else {
      setShowGrade(true);
      setIsQuizCompleted(true);
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
    // reload page
    window.location.reload();
  };

  const speak = (text) => {
    // Stop any ongoing speech
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    // const words = text.split(" "); // Split the text into words
    let currentWord = 0; // Initialize current word index
    // setSpeakingText(text); // Set the speaking text
    // setCurrentWordIndex(0); // Reset the word index

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Set the speech rate to 0.8 (slower)
    //utterance.pitch = 1.5; // Set the pitch to 1.2 (more human-like)
    utteranceRef.current = utterance; // Set the ref to the current utterance
    // Handle the boundary event to update the current word index
    utterance.addEventListener("boundary", (event) => {
      if (event.name === "word") {
        currentWord++;
        // setCurrentWordIndex(currentWord);
      }
    });

    // Handle the end event to reset the word index
    // utterance.addEventListener("end", () => {
    //   setCurrentWordIndex(-1);
    // });

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
      // setCurrentWordIndex(-1);
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
              <div className="text-sm text-gray-700">{`${data?.objective}`}</div>
            </div>
          ))}
        </div>
        <Timer />
      </div>
    );
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      // Go back to previous question
      setCurrentIndex(currentIndex - 1);
      setCurrentQuiz(newData2[currentIndex - 1]);
      
      // Set the previously selected answer for this question
      const previousResult = quizResults[currentIndex - 1];
      setSelectedAnswer(previousResult?.selectedAnswer || "");
    }
  };

  const QuizContent = () => {
    return (
      <div className="bg-background rounded-lg md:px-24 p-3 md:pt-14 md:pb-20 space-y-6">
        <Timer />
        <h3 className="text-2xl font-medium capitalize">{data?.objective}</h3>
        {currentQuiz?.question && (
          <h4
            className="rounded bg-[#EBF0FC] px-4 py-5 font-medium first-letter:uppercase"
            dangerouslySetInnerHTML={{
              __html: currentQuiz?.question?.replaceAll(
                /\frac.*?\}.*?\}/g,
                //
                (match) => {
                  const m = match.replace(/^\f/, "\\f");
                  console.log({ mm: m.slice(0), m });
                  return katex.renderToString(match.replace(/^\f/, "\\f"));
                }
              ),
            }}
            // dangerouslySetInnerHTML={{
            //   __html: latexToHTML(currentQuiz?.question),
             
            // }}
          ></h4>
        )}
        <div>
          <div className="grid md:grid-cols-2 gap-3 mb-5 md:mb-0">
            <label
              className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                selectedAnswer === "a" && "bg-primary/20"
              } border-primary text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect("a")}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === "a"}
                onChange={() => handleAnswerSelect("a")}
                className="appearance-none"
              />
              <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                A
              </span>{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: latexToHTML(currentQuiz?.optionA),
                }}
              ></span>
            </label>
            <label
              className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                selectedAnswer === "b" && "bg-primary/20"
              } border-primary text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect("b")}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === "b"}
                onChange={() => handleAnswerSelect("b")}
                className="appearance-none"
              />
              <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                B
              </span>{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: latexToHTML(currentQuiz?.optionB),
                }}
              ></span>
            </label>
            <label
              className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                selectedAnswer === "c" && "bg-primary/20"
              } border-primary text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect("c")}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === "c"}
                onChange={() => handleAnswerSelect("c")}
                className="appearance-none"
              />
              <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                C
              </span>{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: latexToHTML(currentQuiz?.optionC),
                }}
              ></span>
            </label>
            <label
              className={`w-full py-4 rounded border text-foreground hover:border-lime-700 text-lg font-semibold ${
                selectedAnswer === "d" && "bg-primary/20"
              } border-primary text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect("d")}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === "d"}
                onChange={() => handleAnswerSelect("d")}
                className="appearance-none"
              />
              <span className="flex flex-none items-center justify-center size-7 text-xl font-medium bg-primary text-primary-foreground rounded-full">
                D
              </span>{" "}
              <span
                dangerouslySetInnerHTML={{
                  __html: latexToHTML(currentQuiz?.optionD),
                }}
              ></span>
            </label>
          </div>
        </div>
        <div className="relative md:pt-9">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            className="absolute"
            type="button"
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <Button
            onClick={handleNextQuestion}
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
    if (!timeRemaining && timeRemaining !== 0) return null;

    const minutes = Math.floor(timeRemaining / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

    const getTimerColor = () => {
      if (timeRemaining <= 60000) { // Last minute
        return 'text-red-500';
      } else if (timeRemaining <= 180000) { // Last 3 minutes
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

  console.log('this is the correct dfL', correctDifficultyLevel, correctAnswers, totalDifficultyLevel)

  const Grade = () => {
    console.log("correctAnswers", correctAnswers, ldata?.numberOfQuestions);
    console.log("totalDifficultyLevel", totalDifficultyLevel);
    console.log("quizResults", quizResults);
    console.log("correctDifficultyLevel", correctDifficultyLevel);
    const scorePercentage = ((correctDifficultyLevel / totalDifficultyLevel) * 100).toFixed(2);
    console.log("scorePercentage", scorePercentage);
    score = scorePercentage;
    console.log("score", score);
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
          learningObjectives: `${data?.category}: ${scorePercentage}`,
          neurodiversity: userInfo?.neurodiversity,
          gender: userInfo?.gender,
          userId: userInfo?._id,
        },
        studentName: userInfo?.fullName,
      };

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
                    // dangerouslySetInnerHTML={{
                    //   __html: result?.question?.replaceAll(
                    //     /\\.*?\}.*?\}/g,
                    //     //
                    //     (match) => katex.renderToString(match)
                    //   ),
                    // }}
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
                      // dangerouslySetInnerHTML={{
                      //   __html: result?.correctOption?.replaceAll(
                      //     /\.*?}.*?}/g,
                      //     //
                      //     (match) => katex.renderToString(match)
                      //   ),
                      // }}
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
          {correctAnswers < ldata?.numberOfQuestions && (
            <Button
              variant="outline"
              onClick={handleAnalyzeResult}
              disabled={isLoading}
            >
              {isLoading ? "Analyzing your mistakes ..." : "Analyze Mistake(s)"}
            </Button>
          )}
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
