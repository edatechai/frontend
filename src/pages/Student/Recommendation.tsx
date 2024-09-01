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

const Recommedation = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data } = useRecommendObjectivesQuery();
  const [showChatBot, setShowChatBot] = useState(false);
  const [getRec, { isLoading, data: recData }] =
    useStudentRecommendationMutation();
  const [preview, setPreview] = useState("");
  const [showNoObjectMsg, setShowNoObjectMsg] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStepPage, setCurrentStepPage] = useState(0);
  const [currentQuestionPage, setCurrentQuestionPage] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizAttempted, setQuizAttempted] = useState(false);
  const stepsPerPage = 1;
  const questionsPerPage = 1;

  useEffect(() => {
    if (recData?.objectives?.length === 0) {
      setPreview("");
      setShowNoObjectMsg(true);
    }
    if (recData?.objectives?.length > 0) {
      setShowSteps(true);
      setPreview("");
      setShowNoObjectMsg(false);
    }
  }, [recData]);

  const getRecommendation = async () => {
    const payload = {
      objective: preview?.objective_id,
      objcode: preview?.objcode,
    };
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

  const handleOptionSelect = (option) => {
    if (currentStepPage >= 4) {
      setSelectedOption(option);
    }
  };

  const evaluateQuiz = () => {
    let correctAnswers = 0;

    recData.questions.forEach((question, index) => {
      if (selectedOption === question.answer) {
        correctAnswers++;
      }
    });

    if (correctAnswers > 0) {
      setQuizPassed(true);
      setCurrentStepPage(5);
    } else {
      setQuizPassed(false);
    }

    setQuizAttempted(true);

    // If the quiz is failed, reset the currentStepPage to avoid showing the 5th step
    if (!quizPassed) {
      setCurrentStepPage(3);
    } else {
      setCurrentStepPage(5);
    }
  };

  const continueSteps = () => {
    setCurrentQuestionPage(0);
    setQuizAttempted(false);
    setSelectedOption("");
    setQuizPassed(false);
    setCurrentStepPage(5); // Allow continuation to 5th step only if quiz is passed
  };

  return (
    <div className="flex justify-center">
      {!showSteps && (
        <div className="rounded-lg border border-slate-300 py-5 px-7 bg-white shadow-md">
          <div className="mt-7">
            <div className="text-slate-800 font-medium">
              Hello <span className="capitalize">{userInfo?.fullName}</span>,
              based on your goals, aspirations and performance in{" "}
              {data?.recommendLearningObjectivesData?.[0]?.subject}, here are
              the learning objectives you need to revise
              <ul className="mt-5 list-disc list-inside">
                {data?.recommendLearningObjectivesData?.map((i, index) => (
                  <li
                    key={index}
                    className="mt-2 font-normal text-black/75 text-sm italic"
                  >
                    <button
                      onClick={() => {
                        setPreview(i);
                        setShowNoObjectMsg(false);
                        setShowSteps(false);
                      }}
                      className="text-primary hover:underline capitalize text-base cursor-pointer"
                    >
                      {i.objective_id}
                    </button>{" "}
                    (Current score: {i.scores})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <Dialog open={!!preview} onOpenChange={setPreview}>
        <DialogContent className="sm:max-w-[425px]">
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
              objective at the moment, but you can talk to Eddy, our AI
              assistant, about this learning objective.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowNoObjectMsg(false);
              }}
              type="submit"
            >
              Chat with Eddy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!(quizAttempted && !quizPassed) && (
        <Dialog open={showSteps} onOpenChange={setShowSteps}>
          <DialogContent className="max-w-[90vw]">
            <DialogHeader>
              <DialogTitle>{recData?.objectives?.[0]?.objective}</DialogTitle>
              <DialogDescription>
                {quizAttempted && !quizPassed ? null : (
                  <div className="bg-white p-6 rounded-lg grid grid-flow-col gap-10 max-w-[90vw] min-w-[60%]">
                    {!showNoObjectMsg && (
                      <div className="shadow-md p-6 grow flex flex-col justify-between">
                        {!(currentStepPage === 4) &&
                          recData?.objectives?.[0]?.learningSteps
                            .slice(
                              currentStepPage,
                              currentStepPage + stepsPerPage
                            )
                            .map((step, index) => (
                              <div key={index} className="mt-7">
                                {currentStepPage === 4 ? null : (
                                  <>
                                    {" "}
                                    <span className="text-green-500 text-lg font-medium px-1">
                                      Step {step.stepNumber}
                                    </span>
                                    <div className="mt-3 text-slate-800">
                                      {step.instruction}
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                        {currentStepPage === 4 && !quizAttempted && (
                          <div className="mt-7">
                            <div className="text-slate-800 font-medium">
                              Let's test your understanding. Please try the quiz
                              on your right.
                            </div>
                          </div>
                        )}
                        {currentStepPage === 4 && !quizAttempted ? null : (
                          <div className="flex justify-between items-center mt-4 gap-11">
                            <Button
                              onClick={handleStepPrev}
                              disabled={
                                currentStepPage === 0 ||
                                (currentStepPage === 4 && !quizAttempted)
                              }
                            >
                              Previous Step
                            </Button>
                            <Button
                              onClick={handleStepNext}
                              disabled={
                                currentStepPage ===
                                  recData?.objectives[0]?.learningSteps
                                    ?.length -
                                    1 ||
                                (currentStepPage === 4 && !quizAttempted)
                              }
                            >
                              Next Step
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {!showNoObjectMsg && !quizAttempted && (
                      <div className="bg-white p-6 rounded-lg shadow-md grow">
                        <div className="mt-7 ">
                          {recData?.questions
                            .slice(
                              currentQuestionPage,
                              currentQuestionPage + questionsPerPage
                            )
                            .map((question, index) => (
                              <div key={index} className="text-slate-800">
                                <div className="py-3 px-2 rounded bg-green-700/70 text-primary-foreground text-center mb-3">
                                  {question.question}
                                </div>

                                <div
                                  onClick={() => handleOptionSelect("A")}
                                  className={`cursor-pointer p-2 rounded mb-2 border border-primary/50 ${
                                    selectedOption === "A" ? "bg-blue-100" : ""
                                  }`}
                                >
                                  <span className="font-semibold mr-2">A</span>{" "}
                                  {question.optionA}
                                </div>
                                <div
                                  onClick={() => handleOptionSelect("B")}
                                  className={`cursor-pointer p-2 rounded mb-2 border border-primary/50 ${
                                    selectedOption === "B" ? "bg-blue-100" : ""
                                  }`}
                                >
                                  <span className="font-semibold mr-2">B</span>{" "}
                                  {question.optionB}
                                </div>
                                <div
                                  onClick={() => handleOptionSelect("C")}
                                  className={`cursor-pointer p-2 rounded mb-2 border border-primary/50 ${
                                    selectedOption === "C" ? "bg-blue-100" : ""
                                  }`}
                                >
                                  <span className="font-semibold mr-2">C</span>{" "}
                                  {question.optionC}
                                </div>
                                <div
                                  onClick={() => handleOptionSelect("D")}
                                  className={`cursor-pointer p-2 rounded mb-2 border border-primary/50 ${
                                    selectedOption === "D" ? "bg-blue-100" : ""
                                  }`}
                                >
                                  <span className="font-semibold mr-2">D</span>{" "}
                                  {question.optionD}
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-5 items-center mt-4">
                          <div className="flex justify-between w-full gap-11">
                            <Button
                              onClick={handleQuestionPrev}
                              disabled={currentQuestionPage === 0}
                            >
                              Previous Question
                            </Button>
                            <Button
                              onClick={handleQuestionNext}
                              disabled={
                                currentQuestionPage ===
                                recData?.questions?.length - 1
                              }
                            >
                              Next Question
                            </Button>
                          </div>
                          <Button
                            onClick={evaluateQuiz}
                            disabled={!selectedOption}
                            className="btn bg-green-600 hover:bg-green-700"
                          >
                            Submit Quiz
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showChatBot} onOpenChange={setShowChatBot}>
        <DialogContent className="sm:max-w-[425px] p-0">
          {/* <DialogTitle>hello</DialogTitle> */}
          <ChatBot userInfo={userInfo} rec={data} />
        </DialogContent>
      </Dialog>

      {quizAttempted && quizPassed && (
        <div className="mt-7 bg-white p-6 rounded-lg shadow-md">
          <div className="text-slate-700">
            Congratulations! You got the correct answers. Continue with the
            learning steps.
          </div>
          <Button onClick={continueSteps}>Continue Steps</Button>
        </div>
      )}
      {quizAttempted && !quizPassed && (
        <div className="mt-7 bg-white p-6 rounded-lg shadow-md">
          <div className="text-slate-700 mb-6">
            It seems you didn't get the correct answers. Please contact your
            teacher for further instructions or chat with Eddy, our AI
            assistant.
          </div>
          <Button onClick={() => setShowChatBot(true)} className="ml-[80%]">
            Chat with Eddy
          </Button>
        </div>
      )}
    </div>
  );
};

export default Recommedation;
