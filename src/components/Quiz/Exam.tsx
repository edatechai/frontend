import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import katex from "katex";
import { FaSpinner } from "react-icons/fa";
import { ExamQuestions } from "@/pages/Student/classrooms/exams";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { getColor } from "@/lib/jsons";
import "mathlive";
import { MathfieldElement } from "mathlive";
import { convertLatexToMarkup, convertLatexToMathMl, validateLatex, convertMathMlToLatex } from 'mathlive';

function Theory({ exam }: { exam: ExamQuestions }) {
  const userInfo = useSelector((state) => state?.user.userInfo);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<any>(false);
  const [score, setScore] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(exam?.exam_question?.exam_length * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(new Event('submit') as FormEvent<HTMLFormElement>);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    // Add visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSubmit(new Event('submit') as FormEvent);
        toast("Exam auto-submitted due to tab switch", {
          description: "Switching tabs during an exam is not allowed",
        });
      }
    };

    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Empty dependency array since we want this to run once

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  function closeDialog(x: boolean) {
    if (!x) {
      navigate("/student/classrooms");
      setScore(x);
    }
  }

  

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);

    // Get all math-field elements from the document instead of the form
    const mathFields = Array.from(document.querySelectorAll('math-field')) as MathfieldElement[];
    
    // If no math fields found, handle the error gracefully
    if (!mathFields.length) {
      setIsLoading(false);
      toast("No answers found to submit", {
        style: { color: "red" },
      });
      return;
    }

    // Get their LaTeX values
    const answers = mathFields.map(field => field.value);

    const prepend = answers.map(
      (val, i) =>
        `${val}`
    );

    try {
      const res = await fetch(
        "https://edat-microservice-v1.onrender.com/student/process_exam_responses",
        // "http://localhost:5000/api/chat/markStudentResponse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("edat_token"),
          },
          body: JSON.stringify({
            exam_questions: exam?.exam_question,
            student_responses: prepend,
            student_name: userInfo?.fullName,
            student_id: userInfo?._id,
            class_id: exam?.exam_question?.class_id,
          }),
        }
      );
      const data = await res.json();
      console.log({ examData: data });
      setIsLoading(false);
      if (res.ok) {
        toast("Submitted successfully");
        setScore(data);
      } else {
        toast("Request failed.", {
          description: "Something went wrong",
          style: { color: "red" },
        });
      }
    } catch (err) {
      toast("Request failed.", {
        description: "Something went wrong",
        style: { color: "red" },
      });
    }
  };

  console.log({ score });

  // Add this to handle mathfield value changes
  const handleMathFieldInput = (element: MathfieldElement, index: number) => {
    // You can access the LaTeX value using element.value
    console.log(`Question ${index + 1} answer:`, element.value);
  };

  return (
    <div className="my-8  mt-10 mb-10">
      <div className="mb-10 top-4 right-4 bg-black text-white px-4 py-2 rounded-md font-bold w-fit ml-auto">
        Time Remaining: {formatTime(timeLeft)}
      </div>

      {!!score && (
        <Dialog open={!!score} onOpenChange={closeDialog}>
          <DialogContent className="h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Your Result</DialogTitle>
              <DialogDescription className="flex gap-3 pt-5 flex-col">
                <div className="flex gap-2  mb-12">
                  <p className="font-semibold">Overall Mark</p>
                  <p>{score?.total_marks} </p>
                </div>
                <h5 className="font-semibold">Learning Outcome Performance:</h5>
                <div className="space-y-3">
                  {Object.keys(score?.performance_per_objective)
                    .map((key) => [
                      key,
                      score?.performance_per_objective?.[key],
                    ])
                    .map((value, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between capitalize"
                        >
                          <p>
                            {value?.[0]} ({value?.[1]?.raw_score}/
                            {value?.[1]?.total_available})
                          </p>
                          <div className="flex gap-2 w-40 justify-start">
                            <div className="h-8 w-20 relative bg-slate-300 rounded-sm">
                              <div
                                className={`absolute left-0 top-0 h-8 rounded-sm`}
                                style={{
                                  width: `${value?.[1].percentage}%`,
                                  backgroundColor: getColor(
                                    value?.[1].percentage
                                  ),
                                }}
                              ></div>
                            </div>
                            <p>({value?.[1].percentage}%)</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <h4 className="mt-8 text-xl font-semibold mb-2">
                  Examiner Feedback:
                </h4>
                
                <div className="space-y-3 text-left">
                  {Object.keys(score?.results_per_question)
                    .map((key) => [key, score?.results_per_question?.[key]])
                    .map((value, index) => {
                      return (
                        <div
                          key={index}
                          className="border rounded p-2 space-y-2"
                        >
                          <p>
                            <span className="font-medium">The Question:</span>{" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: value?.[1]?.question.text?.replaceAll(
                                  /(\frac.*?\}.*?\}|[0-9]+\^{[0-9]+}|\*)/g,
                                  (match) => katex.renderToString(match.replace(/^\f/, "\\f"))
                                ),
                              }}
                            />
                          </p>
                          <p>
                            <span className="font-medium">Your answer:</span>{" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: value?.[1]?.student_response ? 
                                  convertLatexToMarkup(value?.[1]?.student_response, {
                                    mathstyle: "displaystyle"
                                  })
                                  : ""
                              }}
                            />
                          </p>
                          <p>
                            <span className="font-medium">Feedback:</span>{" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: value?.[1]?.feedback?.replaceAll(
                                  /(\frac.*?\}.*?\}|[0-9]+\^{[0-9]+}|\*)/g,
                                  (match) => katex.renderToString(match.replace(/^\f/, "\\f"))
                                ),
                              }}
                            />
                          </p>
                          <p>
                            <span className="font-medium">Justification:</span>{" "}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: value?.[1]?.justification?.replaceAll(
                                  /(\frac.*?\}.*?\}|[0-9]+\^{[0-9]+}|\*)/g,
                                  (match) => katex.renderToString(match.replace(/^\f/, "\\f"))
                                ),
                              }}
                            />
                          </p>
                        </div>
                      );
                    })}
                </div>
                {/* <p>{examinersFeedback?.recommendation}</p>
            <p className="mt-2">
              <span className="font-semibold pr-2">Overall:</span>
              {examinersFeedback?.summary}
            </p> */}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <h2 className="text-3xl font-medium text-center mb-10 capitalize">
        {exam?.exam_question?.questions[0].learning_objectives[0]} Test
      </h2>
      <p className="font-medium">
        Instructions: Answer all questions. Show all Workings for full marks
      </p>
      <form className="flex gap-10 mt-8 flex-col" onSubmit={handleSubmit}>
        {exam?.exam_question?.questions?.map((value, index) => (
          <div key={index} className="space-y-2">
            <h5 className="px-3 py-2 rounded bg-primary text-white w-fit">
              Question {value?.number}
            </h5>
            {/* <p>{value.text}</p> */}
            <div
              dangerouslySetInnerHTML={{
                __html: value.text?.replaceAll(
                  /\frac.*?\}.*?\}/g,
                  //
                  (match) => {
                    const m = match.replace(/^\f/, "\\f");
                    console.log({ mm: m.slice(0), m });
                    return katex.renderToString(match.replace(/^\f/, "\\f"));
                  }
                ),
              }}
            ></div>

            <i>
              {value.marks} {value.marks > 1 ? "marks" : "mark"}
            </i>
            <label className="mt-7 block">
              <p>Answer:</p>
              <math-field
                answer={value.text}
                name={value.text}
                class="w-full rounded-md p-2 h-36 border border-solid border-primary"
                style={{
                  display: "block",
                  minHeight: "144px", // equivalent to h-36
                  caretColor: "var(--primary)",
                  backgroundColor: "white",
                }}
                onInput={(evt) => handleMathFieldInput(evt.target as MathfieldElement, index)}
                virtual-keyboard-mode="manual"
                virtual-keyboard-theme="material"
                required
              ></math-field>
            </label>
          </div>
        ))}
        <Button disabled={isLoading} className="w-40 mx-auto">
          {isLoading && (
            <span className="mr-2 h-4 w-4 animate-spin">
              <FaSpinner />
            </span>
          )}
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Theory;
