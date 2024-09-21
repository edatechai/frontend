import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChatBot from "@/features/chatbot/chatbot";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useRecommendObjectivesQuery,
  useStudentRecommendationMutation,
} from "../../features/api/apiSlice";
import { RootState } from "../../app/store";
// import ChatBotWrapper from "@/components/ChatBotWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Objective = {
  objective_id: string;
  objcode: string;
  scores: number;
};

type RecData = {
  objectives: Objective[];
  questions: {
    question: string;
    answer: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
  }[];
};

const mockEng = [
  { avg_score: 20, objective_id: "The Basics of Grammar and Punctuation" },
  { avg_score: 25, objective_id: "Academic Writing Conventions" },
  { avg_score: 18, objective_id: "Principles of Literature Interpretation" },
];
const mockBiology = [
  { avg_score: 30, objective_id: "Digestive System" },
  { avg_score: 45, objective_id: "Evolution" },
  { avg_score: 28, objective_id: "Cell structure and function" },
  { avg_score: 38, objective_id: "Ecology" },
];

const Recommedation = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { data } = useRecommendObjectivesQuery();
  const [showChatBot, setShowChatBot] = useState(false);
  const [getRec, { isLoading, data: recData }] =
    useStudentRecommendationMutation();
  const [preview, setPreview] = useState<Objective | null>(null);
  const [showNoObjectMsg, setShowNoObjectMsg] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [currentStepPage, setCurrentStepPage] = useState(0);
  const [currentQuestionPage, setCurrentQuestionPage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    new Array(recData?.questions?.length).fill("")
  );
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizAttempted, setQuizAttempted] = useState(false);
  const [quizPassedCount, setQuizPassedCount] = useState(0);
  const stepsPerPage = 1;
  const questionsPerPage = 1;

  useEffect(() => {
    if (recData?.objectives?.length === 0) {
      setPreview(null);
      setShowNoObjectMsg(true);
    } else if (recData?.objectives?.length > 0) {
      setShowSteps(true);
      setPreview(null);
      setShowNoObjectMsg(false);
    }
  }, [recData]);

  console.log(" this is recData", data);

  const getRecommendation = async () => {
    const payload = {
      objective: preview?.objective_id,
      objcode: preview?.objcode,
    };

    console.log("thiss is payload", payload);
    try {
      const res = await getRec(payload);
      console.log("res here", res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStepNext = () => {
    if (currentStepPage < recData?.objectives[0]?.learningSteps?.length - 1) {
      setCurrentStepPage(currentStepPage + 1);
    }
  };

  const handleStepPrev = () => {
    if (currentStepPage > 0) {
      setCurrentStepPage(currentStepPage - 1);
    }
  };

  const handleQuestionNext = () => {
    if (currentQuestionPage < recData.questions.length - 1) {
      setCurrentQuestionPage(currentQuestionPage + 1);
    }
  };

  const handleQuestionPrev = () => {
    if (currentQuestionPage > 0) {
      setCurrentQuestionPage(currentQuestionPage - 1);
    }
  };

  const handleOptionSelect = (option: string, questionIndex: number) => {
    if (currentStepPage >= 4) {
      setSelectedOptions((prevOptions) => {
        const updatedOptions = [...prevOptions];
        updatedOptions[questionIndex] = option;
        return updatedOptions;
      });
    }
  };

  const evaluateQuiz = () => {
    const correctAnswers = recData.questions.reduce((acc, question, index) => {
      const isCorrect = selectedOptions[index] === question.answer;
      console.log(
        `Question ${index + 1}: ${isCorrect ? "Correct" : "Incorrect"}`
      );
      console.log(`Selected Option: ${selectedOptions[index]}`);
      return isCorrect ? acc + 1 : acc;
    }, 0);

    console.log(`Total correct answers: ${correctAnswers}`);

    if (correctAnswers === recData.questions.length) {
      setQuizPassedCount((prevCount) => prevCount + 1);
      setQuizPassed(true);
      console.log("Quiz passed");
    } else {
      setQuizPassed(false);
      console.log("Quiz failed");
    }

    setQuizAttempted(true);

    if (quizPassedCount + 1 >= 2) {
      // setShowChatBot(false);
      setCurrentStepPage(5);
      console.log("Moving to step 5");
    } else {
      //setShowChatBot(true);
      console.log("Opening chat with Eddey");
    }
  };

  const continueSteps = () => {
    // Reset all relevant state variables
    setCurrentQuestionPage(0);
    setQuizAttempted(false);
    setSelectedOptions(new Array(recData?.questions?.length).fill(""));
    setQuizPassed(false);
    setQuizPassedCount(0);
    setCurrentStepPage(0); // Reset to the first step
    //setShowChatBot(false);
    setShowCon(false);
  };

  const handleDialogClose = () => {
    setShowSteps(false);
    setShowChatBot(false);
  };

  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      {!!recData && (
        <dialog id="my_modal_4" className="modal">
          <div className="modal-box min-h-[90vh] max-w-5xl">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Click the button below to close</p>
            <div className="modal-action">
              <ChatBot
                userInfo={userInfo}
                rec={recData}
                onClose={() => document.getElementById("my_modal_4").close()}
              />
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}

      <div className="flex justify-center">
        {!showSteps &&
          !showCon &&
          data?.recommendLearningObjectivesData?.length && (
            <div className=" bg-white">
              <div className="mt-7">
                <div className="text-slate-800 font-medium space-y-3">
                  <p className="mb-4">
                    Hello{" "}
                    <span className="capitalize">{userInfo?.fullName}</span>,
                    based on your goals, aspirations and performance, here are
                    the learning objectives you need to revise
                  </p>
                  <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg">
                        {data?.recommendLearningObjectivesData?.[0]?.subject}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                      {data?.recommendLearningObjectivesData
                        ?.filter(
                          (value, index, self) =>
                            index ===
                            self.findIndex(
                              (t) =>
                                t.objective_id === value.objective_id &&
                                t.avg_score === value.avg_score
                            )
                        )
                        ?.map((i, index) => (
                          <Card
                            x-chunk="dashboard-01-chunk-0"
                            key={i}
                            className="flex flex-col justify-between"
                          >
                            <CardHeader>
                              <CardTitle className="text-sm font-medium line-clamp-2 capitalize">
                                {i.objective_id}
                              </CardTitle>
                              <CardDescription>
                                Average score: {Math.round(i.avg_score)}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button
                                variant="link"
                                className="text-xs"
                                onClick={() => {
                                  setPreview(i);
                                  setShowNoObjectMsg(false);
                                  setShowSteps(false);
                                }}
                              >
                                View Recommendation
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </CardContent>
                  </Card>
                  <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg">English</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                      {mockEng?.map((i, index) => (
                        <Card
                          x-chunk="dashboard-01-chunk-0"
                          key={i}
                          className="flex flex-col justify-between"
                        >
                          <CardHeader>
                            <CardTitle className="text-sm font-medium line-clamp-2 capitalize">
                              {i.objective_id}
                            </CardTitle>
                            <CardDescription>
                              Average score: {Math.round(i.avg_score)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button
                              variant="link"
                              className="text-xs"
                              onClick={() => {
                                setPreview(i);
                                setShowNoObjectMsg(false);
                                setShowSteps(false);
                              }}
                            >
                              View Recommendation
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                  <Card x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg">Biology</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                      {mockBiology.map((i, index) => (
                        <Card
                          x-chunk="dashboard-01-chunk-0"
                          key={i}
                          className="flex flex-col justify-between"
                        >
                          <CardHeader>
                            <CardTitle className="text-sm font-medium line-clamp-2 capitalize">
                              {i.objective_id}
                            </CardTitle>
                            <CardDescription>
                              Average score: {Math.round(i.avg_score)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button
                              variant="link"
                              className="text-xs"
                              onClick={() => {
                                setPreview(i);
                                setShowNoObjectMsg(false);
                                setShowSteps(false);
                              }}
                            >
                              View Recommendation
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

        {data && !data?.recommendLearningObjectivesData?.length && (
          <p>No recommendations</p>
        )}

        <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
          <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="capitalize">
                {preview?.objective_id}
              </DialogTitle>
              <DialogDescription>
                I'll walk you through{" "}
                <span className="text-green-500">{preview?.objective_id}</span>{" "}
                step by step, so you can understand it better.
              </DialogDescription>
            </DialogHeader>
            <p>When you're ready, click start.</p>
            <DialogFooter>
              <Button type="submit" onClick={getRecommendation}>
                Start
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showNoObjectMsg} onOpenChange={setShowNoObjectMsg}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ooops!</DialogTitle>
              <DialogDescription>
                Sorry, there is no recommendation for you on this learning
                objective at the moment, but you can talk to Eddey, our AI
                assistant, about this learning objective.
              </DialogDescription>
            </DialogHeader>
            {/* <DialogFooter>
            <Button
              onClick={() => {
                setShowNoObjectMsg(false);
              }}
              type="submit"
            >
              Chat with Eddey
            </Button>
          </DialogFooter> */}
          </DialogContent>
        </Dialog>

        {!(quizAttempted && !quizPassed) && (
          <Dialog open={showSteps} onOpenChange={handleDialogClose}>
            <DialogContent className="max-w-[95vw] md:max-w-[70vw]">
              <DialogHeader>
                <DialogTitle>{recData?.objectives?.[0]?.objective}</DialogTitle>

                <DialogDescription className="flex flex-col md:flex-row gap-5">
                  {currentStepPage === 4 ? (
                    <div className="bg-white p-6 rounded-lg">
                      <p className="text-lg font-medium mb-4">
                        It's time to test your knowledge!
                      </p>
                      <p>
                        Answer the questions on the right to proceed to the next
                        step.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white md:p-6 rounded-lg grid grid-flow-col gap-10 max-w-[90vw] min-w-[60%] text-left">
                      {!showNoObjectMsg &&
                        currentStepPage !==
                          recData?.objectives[0]?.learningSteps?.length && (
                          <div className="shadow  p-6 grow flex flex-col justify-between">
                            {recData?.objectives?.[0]?.learningSteps
                              .slice(
                                quizPassedCount >= 2
                                  ? currentStepPage
                                  : currentStepPage,
                                quizPassedCount >= 2
                                  ? currentStepPage + 1
                                  : currentStepPage + stepsPerPage
                              )
                              .map((step, index) => (
                                <div key={index} className="mt-7">
                                  <span className="text-green-500 text-lg font-medium px-1">
                                    {/* Step {step.stepNumber} */}
                                  </span>
                                  <div className="mt-3 text-slate-800">
                                    {step.instruction.charAt(0).toUpperCase() +
                                      step.instruction.slice(1)}
                                  </div>
                                </div>
                              ))}
                            <div className="flex justify-between mt-10">
                              <Button
                                onClick={handleStepPrev}
                                className="text-sm"
                                variant="outline"
                                disabled={
                                  currentStepPage ===
                                  (quizPassedCount >= 2 ? 4 : 0)
                                }
                              >
                                Previous
                              </Button>
                              {currentStepPage ===
                              recData?.objectives[0]?.learningSteps?.length -
                                1 ? (
                                <Button
                                  onClick={() => {
                                    setShowSteps(false), setShowCon(true);
                                  }}
                                  className="text-sm"
                                >
                                  Next
                                </Button>
                              ) : (
                                <Button
                                  onClick={handleStepNext}
                                  className="text-sm"
                                >
                                  Next
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                      {currentStepPage ===
                        recData?.objectives[0]?.learningSteps?.length && (
                        <div className="shadow-md p-6 grow flex flex-col justify-between">
                          <div className="mt-7">
                            <div className="text-slate-800">
                              Congratulations! You have completed all the
                              learning steps for this objective.
                            </div>
                          </div>
                          <div className="flex justify-end mt-10">
                            <Button
                              onClick={() => setShowSteps(false)}
                              className="text-sm"
                            >
                              Exit
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStepPage <= 4 && (
                    <div className="shadow-md p-6 grow flex flex-col justify-between">
                      <div className="mt-7">
                        {recData?.questions
                          .slice(
                            currentQuestionPage,
                            currentQuestionPage + questionsPerPage
                          )
                          .map((question, index) => (
                            <div key={index}>
                              <div className="text-slate-800 first-letter:uppercase">
                                {question.question.charAt(0).toUpperCase() +
                                  question.question.slice(1)}
                              </div>
                              <div className="mt-2 flex items-center">
                                <span className="mr-2 text-gray-700">A</span>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 text-gray-600"
                                    value="A"
                                    checked={
                                      selectedOptions[
                                        currentQuestionPage + index
                                      ] === "A"
                                    }
                                    onChange={() =>
                                      handleOptionSelect(
                                        "A",
                                        currentQuestionPage + index
                                      )
                                    }
                                  />
                                  <span className="ml-2 text-gray-700">
                                    {question.optionA}
                                  </span>
                                </label>
                              </div>
                              <div className="mt-2 flex items-center">
                                <span className="mr-2 text-gray-700">B</span>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 text-gray-600"
                                    value="B"
                                    checked={
                                      selectedOptions[
                                        currentQuestionPage + index
                                      ] === "B"
                                    }
                                    onChange={() =>
                                      handleOptionSelect(
                                        "B",
                                        currentQuestionPage + index
                                      )
                                    }
                                  />
                                  <span className="ml-2 text-gray-700">
                                    {question.optionB}
                                  </span>
                                </label>
                              </div>
                              <div className="mt-2 flex items-center">
                                <span className="mr-2 text-gray-700">C</span>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 text-gray-600"
                                    value="C"
                                    checked={
                                      selectedOptions[
                                        currentQuestionPage + index
                                      ] === "C"
                                    }
                                    onChange={() =>
                                      handleOptionSelect(
                                        "C",
                                        currentQuestionPage + index
                                      )
                                    }
                                  />
                                  <span className="ml-2 text-gray-700">
                                    {question.optionC}
                                  </span>
                                </label>
                              </div>
                              <div className="mt-2 flex items-center">
                                <span className="mr-2 text-gray-700">D</span>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 text-gray-600"
                                    value="D"
                                    checked={
                                      selectedOptions[
                                        currentQuestionPage + index
                                      ] === "D"
                                    }
                                    onChange={() =>
                                      handleOptionSelect(
                                        "D",
                                        currentQuestionPage + index
                                      )
                                    }
                                  />
                                  <span className="ml-2 text-gray-700">
                                    {question.optionD}
                                  </span>
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="flex justify-between mt-10">
                        <Button
                          // disable if currentStepPage is not grater or === 4
                          disabled={currentStepPage !== 4}
                          onClick={handleQuestionPrev}
                          className="text-sm"
                          variant="outline"
                        >
                          Previous
                        </Button>
                        {currentQuestionPage ===
                        recData?.questions.length - 1 ? (
                          <Button
                            disabled={currentStepPage !== 4}
                            onClick={evaluateQuiz}
                            className="text-sm"
                          >
                            Submit
                          </Button>
                        ) : (
                          <Button
                            disabled={currentStepPage !== 4}
                            onClick={handleQuestionNext}
                            className="text-sm"
                          >
                            Next
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* {quizPassed && currentStepPage === 5 && (
                  <div className="shadow-md p-6 grow flex flex-col justify-between">
                    <div className="mt-7">
                      
                      {recData?.objectives?.[0]?.learningSteps[4] && (
                        <div className="mt-5">
                          <span className="text-green-500 text-lg font-medium px-1">
                            Step {recData.objectives[0].learningSteps[4].stepNumber}
                          </span>
                          <div className="mt-3 text-slate-800">
                            {recData.objectives[0].learningSteps[4].instruction}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end mt-10">
                      <Button onClick={() => setCurrentStepPage(5)} className="text-sm">
                        Next
                      </Button>
                    </div>
                  </div>
                )} */}
                </DialogDescription>
              </DialogHeader>

              {/* <DialogFooter> */}
              <div className="text-sm text-slate-500 font-bold bg-yellow-100 p-2 rounded-md border border-yellow-300 shadow-sm">
                Remember: You can ask Eddey for help at any point!
              </div>
              <button
                className="btn text-sm flex items-center gap-2"
                onClick={() =>
                  document.getElementById("my_modal_4").showModal()
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Chat with Eddey
              </button>

              {/* {showChatBot && (
                <div className="mt-4 w-full">
                  <ChatBot userInfo={userInfo} rec={recData} />
                </div>
              )} */}
              {/* </DialogFooter> */}
            </DialogContent>
          </Dialog>
        )}

        {quizAttempted && quizPassed && quizPassedCount >= 2 && (
          <div className="mt-7 bg-white p-6 rounded-lg shadow-md">
            <div className="text-slate-700">
              Congratulations! You have passed the quizzes. Proceed to the next
              learning step.
            </div>
            <Button onClick={continueSteps}>Continue</Button>
          </div>
        )}

        {quizAttempted && !quizPassed && (
          <div className="mt-7 bg-white p-6 rounded-lg shadow-md">
            <div className="text-slate-700 mb-6">
              It seems you didn't get the correct answers. Please try again or
              chat with Eddey for assistance.
            </div>
            <div className="flex gap-5">
              <Button
                onClick={() =>
                  document.getElementById("my_modal_4").showModal()
                }
              >
                Chat with Eddey
              </Button>
              <Button
                onClick={() => {
                  setShowSteps(false), continueSteps();
                }}
              >
                Try again
              </Button>
            </div>
            {/* {showChatBot && (
            <div className="mt-4 w-full">
              <ChatBot userInfo={userInfo} rec={recData} />
            </div>
          )} */}
          </div>
        )}
      </div>
    </>
  );
};

export default Recommedation;
