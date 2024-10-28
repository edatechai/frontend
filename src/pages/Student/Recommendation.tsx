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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TextWithLineBreaks, {
  TextWithLineBreaksRec,
} from "@/components/others/textWithLineBreaks";
import { Loader, MessageSquare } from "lucide-react";
import { latexToHTML, toTitleCase } from "@/lib/utils";

type Objective = {
  objective_id: string;
  objcode: string;
  scores: number;
};

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
  const [recs, setRecs] = useState();
  const stepsPerPage = 1;
  const questionsPerPage = 1;

  console.log({ recQuery: data, recData });

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

  useEffect(() => {
    if (data?.recommendLearningObjectivesData.length > 0) {
      const v = data?.recommendLearningObjectivesData;
      // v.push(

      // );
      setRecs(
        [...v].sort(function (a, b) {
          return a?.importance_rating + b?.importance_rating;
        })
      );
    }
  }, [data]);

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
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 rounded bg-background p-6">
                <img alt="waving hand" src="/waving_hand.png" />
                <p>
                  Hello <span className="capitalize">{userInfo?.fullName}</span>
                  , based on your goals, aspirations and performance, here are
                  the learning objectives you need to revise
                </p>
              </div>
              <Card x-chunk="dashboard-01-chunk-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">Study Plans</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:gap-8">
                  {recs
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
                      <div
                        key={index}
                        className="flex flex-col md:flex-row items-start justify-between gap-4 md:items-center border border-[#EBF0FC] md:border-x-[23px] md:border-y-[30px] rounded text-sm font-light pl-5 pb-10 pt-5 pr-12"
                      >
                        <span className="grid gap-1 text-lg">
                          <h3 className="text-xl font-medium line-clamp-2">
                            {toTitleCase(i.objective_id)}
                          </h3>
                          <span className="">
                            Average score: {Math.round(i.avg_score)}%
                          </span>
                          <span>Subject: {i.subject}</span>
                          <span>Importance Rating: {i.importance_rating}</span>
                        </span>
                        <Button
                          className="text-xs h-8 self-end md:self-center"
                          onClick={() => {
                            setPreview(i);
                            setShowNoObjectMsg(false);
                            setShowSteps(false);
                          }}
                        >
                          View Study Plan
                        </Button>
                      </div>
                    ))}
                </CardContent>
              </Card>
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
              <Button
                type="submit"
                onClick={getRecommendation}
                disabled={isLoading}
              >
                {isLoading && (
                  <span className="mr-2 animate-spin">
                    <Loader />
                  </span>
                )}
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
                <DialogTitle>
                  <p className="capitalize">
                    {recData?.objectives?.[0]?.objective}
                  </p>
                </DialogTitle>

                <DialogDescription className="flex flex-col md:flex-row gap-5 overflow-auto max-h-[70vh]">
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
                    <div className="bg-white rounded border-foreground/20 border p-4 grid grid-flow-col gap-10 max-w-[90vw] min-w-[60%] text-left">
                      {!showNoObjectMsg &&
                        currentStepPage !==
                          recData?.objectives[0]?.learningSteps?.length && (
                          <div className=" grow flex flex-col justify-between">
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
                                <div className="mt-10 text-slate-800 first-letter:capitalize">
                                  {
                                    <TextWithLineBreaksRec
                                      texts={step.instruction}
                                    />
                                  }
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
                    <div className="border border-foreground/20 rounded p-4 grow flex flex-col justify-between min-w-[22vw]">
                      <div className="my-auto">
                        {recData?.questions
                          .slice(
                            currentQuestionPage,
                            currentQuestionPage + questionsPerPage
                          )
                          .map((question, index) => (
                            <div key={index}>
                              <p
                                className="mb-4 first-letter:uppercase"
                                dangerouslySetInnerHTML={{
                                  __html: latexToHTML(question.question),
                                }}
                              ></p>
                              <div className="flex mb-3 items-center">
                                <span className="mr-2">A</span>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 flex-none"
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
                                  <span
                                    className="ml-2"
                                    dangerouslySetInnerHTML={{
                                      __html: latexToHTML(question.optionA),
                                    }}
                                  ></span>
                                </label>
                              </div>
                              <div className="flex mb-3 items-center">
                                <span className="mr-2">B</span>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 flex-none"
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
                                  <span
                                    className="ml-2"
                                    dangerouslySetInnerHTML={{
                                      __html: latexToHTML(question.optionB),
                                    }}
                                  ></span>
                                </label>
                              </div>
                              <div className="flex mb-3 items-center">
                                <span className="mr-2">C</span>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 flex-none"
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
                                  <span
                                    className="ml-2"
                                    dangerouslySetInnerHTML={{
                                      __html: latexToHTML(question.optionC),
                                    }}
                                  ></span>
                                </label>
                              </div>
                              <div className="flex mb-3 items-center">
                                <span className="mr-2">D</span>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 flex-none"
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
                                  <span
                                    className="ml-2"
                                    dangerouslySetInnerHTML={{
                                      __html: latexToHTML(question.optionD),
                                    }}
                                  ></span>
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                      {!(currentStepPage !== 4) && (
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
                      )}
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="bg-[#EBF0FC] px-4 py-3 md:py-1 rounded flex flex-col md:flex-row justify-between items-center gap-3">
                <p>
                  <span className="font-bold">Remember:</span> You can ask Eddey
                  for help at any point!
                </p>
                <Button
                  className="btn text-sm flex items-center gap-2 w-full md:w-fit"
                  onClick={() =>
                    document.getElementById("my_modal_4").showModal()
                  }
                >
                  <MessageSquare />
                  Chat with Eddey
                </Button>
              </div>
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
