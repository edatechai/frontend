import { FormEvent, useState } from "react";
import { toast } from "sonner";
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

function Theory({ exam }: { exam: ExamQuestions }) {
  const userInfo = useSelector((state) => state?.user.userInfo);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<any>(false);
  const [score, setScore] = useState(false);

  function closeDialog(x: boolean) {
    if (!x) {
      navigate("/student/classrooms");
      setScore(x);
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const answers = Object.values(
      Object.fromEntries(new FormData(e.target).entries())
    );

    const prepend = answers.map(
      (val, i) =>
        `the answer to question ${exam?.exam_question.questions[i].number} is ${val}`
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

  return (
    <div className="my-8 w-full">
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
                            {value?.[1]?.question.text}
                          </p>
                          <p>
                            <span className="font-medium">Your answer:</span>{" "}
                            {value?.[1]?.student_response.slice(28)}
                          </p>
                          <p>
                            <span className="font-medium">Feedback :</span>{" "}
                            {value?.[1]?.feedback}
                          </p>
                          <p>
                            <span className="font-medium">
                              Justification :{" "}
                            </span>{" "}
                            {value?.[1]?.justification}
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
            <p>{value.text}</p>

            <i>
              {value.marks} {value.marks > 1 ? "marks" : "mark"}
            </i>
            <label className="mt-7 block">
              <p>Answer:</p>
              <textarea
                name={value.text}
                className="w-full rounded-md p-2 h-36 border border-solid border-primary"
                placeholder="Input your answer (show your workings)"
                required
                // onChange={(e) => handleInput(e, index)}
              ></textarea>
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
