import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AITaskSchema } from "@/lib/schema";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const examBoards = [
  "AQA - Assessment and Qualifications Alliance",
  "Edexcel - Pearson Edexcel",
  "OCR - Oxford Cambridge and RSA Examinations",
  "WJEC - Welsh Joint Education Committee",
  "CCEA - Council for the Curriculum, Examinations & Assessment",
  "Cambridge Assessment International Education (CAIE)",
  "International Baccalaureate (IB) - Offers the IB Diploma Programme",
  "National Examinations Council (NECO)",
  "West African Examinations Council (WAEC)",
  "National Business and Technical Examinations Board (NABTEB)",
  "Joint Admissions and Matriculation Board (JAMB)",
];

export default function Examstyled({
  search,
  handleSearchChange,
  filteredObjectives,
  handleObjectiveSelect,
  classId,
  openDialog,
  country,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof AITaskSchema>>({
    mode: "onChange",
    resolver: zodResolver(AITaskSchema),
  });

  const navigation = useNavigate()
  console.log({ errors });

  const onSubmit = async ({
    exam_board,
    estimated_time: exam_length,
    total_questions: num_questions,
    total_score: total_marks,
  }: z.infer<typeof AITaskSchema>) => {
    const payload = {
      class_id: classId,
      role: "teacher",
      exam_board,
      country,
      exam_length,
      num_questions,
      total_marks,
      learning_objectives: [search],
      subject: "Mathematics",
    };
    console.log({ payload });
    try {
      const res = await fetch(
        "https://edat-microservice-v1.onrender.com/exam/generate_exam_questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (res.ok) {
        openDialog(false);
        toast("Exam task created successfully");
        alert("Exam task created successfully")
        window.location.href = "/teacher"
      } else {
        toast.error("Request failed.", {
          description: "Something went wrong, please try again",
        });
      }
    } catch (err) {
      toast.error("Request failed.", {
        description: "Something went wrong, please try again",
      });
    }
  };

  return (
    <DialogContent className="h-[90vh] overflow-y-auto max-w-[95vw] sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Create Exam Style Questions</DialogTitle>
        <DialogDescription className="flex gap-3 pt-5 flex-col">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Label>
              learning objectives
              <span className="flex items-center gap-2 relative mt-2">
                <Input
                  value={search}
                  onChange={handleSearchChange}
                  type="text"
                  className="w-full"
                  placeholder="Search"
                  required
                />
                {filteredObjectives?.length > 0 && (
                  <ul className="absolute left-0 top-full bg-white border border-gray-300 w-full z-50 overflow-y-auto">
                    {filteredObjectives.map((objective, index: number) => (
                      <li
                        key={index}
                        className="p-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleObjectiveSelect(objective)}
                      >
                        {objective?.objective}
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </Label>

            <Label>
              Estimated Time (In Minutes)
              <Input
                type="text"
                {...register("estimated_time")}
                className="mt-1"
              />
              <i className="text-red-400 text-xs block">
                {errors?.estimated_time?.message}
              </i>
            </Label>
            <Label>
              Total Questions
              <Input
                type="number"
                {...register("total_questions")}
                className="mt-1"
              />
              <i className="text-red-400 text-xs block">
                {errors?.total_questions?.message}
              </i>
            </Label>
            <Label>
              Total Score
              <Input
                type="number"
                {...register("total_score")}
                className="mt-1"
              />
              <i className="text-red-400 text-xs block">
                {errors?.total_score?.message}
              </i>
            </Label>
            {/* <Label>
                Points Per Question
                <Input
                  type="number"
                  {...register("points_per_question")}
                  className="mt-1"
                />
                
                  <i className="text-red-400 text-xs block">{errors?.points_per_question?.message}</p>
                
              </Labei> */}
            <Label className="relative text-slate-900">
              Exam Board
              <select
                className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8"
                {...register("exam_board")}
              >
                <option value="">--Exam Board--</option>
                {examBoards.map((style, index) => (
                  <option key={index} value={style}>
                    {style.charAt(0).toLocaleUpperCase() + style.slice(1)}
                  </option>
                ))}
              </select>
              <i className="text-red-400 text-xs block">
                {errors?.exam_board?.message}
              </i>
            </Label>
            <div className="w-full flex justify-center mt-5">
              <Button disabled={isSubmitting}>
                {isSubmitting && (
                  <span className="mr-2 animate-spin">
                    <Loader />
                  </span>
                )}
                Generate Task
              </Button>
            </div>
          </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
