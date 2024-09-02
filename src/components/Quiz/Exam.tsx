import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import { ExamQuestions } from "@/pages/Student/classrooms/exams";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Theory({ exam }: { exam: ExamQuestions }) {
  const userInfo = useSelector((state) => state?.user.userInfo);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // const handleInput = (e: ChangeEvent<HTMLTextAreaElement>, i: number) => {
  //   setAnswers({ ...answers, [e.target.name]: e.target.value });
  // };

  console.log({ userInfo });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const answers = Object.values(
      Object.fromEntries(new FormData(e.target).entries())
    );

    try {
      const res = await fetch(
        // "https://edat-microservice-v1.onrender.com/student/process_exam_responses",
        "http://localhost:5000/api/chat/markStudentResponse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("edat_token"),
          },
          body: JSON.stringify({
            questions: exam?.exam_question?.questions,
            student_responses: answers,
            student_name: userInfo?.fullName,
            student_id: userInfo?._id,
            class_id: exam?.exam_question?.class_id,
          }),
        }
      );
      const data = res.json();
      console.log({ examData: data });
      setIsLoading(false);
      if (res.ok) {
        toast("Submitted successfully");
        navigate("/student/classrooms");
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

    // const v = Object.keys(answers).map((e) => {
    //   return { question_code: e, answer: answers[e] };
    // });
    // try {
    //   const res = await quizSubmit({
    //     orgCode: user.org_code,
    //     userId: user.user_id,
    //     request: {
    //       student_id: user.user_id,
    //       class_id: questions?.[0].class_id,
    //       set_code: questions?.[0].set_code,
    //       student_response_data: v,
    //     },
    //   }).unwrap();
    //   console.log({ res });
    //   if (res == 0 || res) {
    //     toast({
    //       description: "Exam successfully submitted",
    //     });
    //     router.replace("/students/classroom");
    //   } else {
    //     toast({
    //       description: "Something went wrong",
    //       variant: "destructive",
    //     });
    //   }
    // } catch (err) {
    //   toast({
    //     variant: "destructive",
    //     description: "Something went wrong",
    //   });
    // }
  };

  return (
    <div className="my-8 w-full px-28">
      <h2 className="text-3xl font-medium text-center mb-10 capitalize">
        {exam?.exam_question?.questions[0].learning_objectives[0]} Test (10
        Minutes)
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
