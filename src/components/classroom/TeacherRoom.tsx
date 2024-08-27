import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AITaskSchema } from "@/lib/schema";
import {
  useFindAllQuizQuery,
  useFindAllObjectivesQuery,
  useCreateQuizMutation,
} from "../../features/api/apiSlice";
import Books from "../../assets/books.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Loader, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getInitialsFromFullName } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const TeacherRoom = () => {
  let { state } = useLocation();
  console.log("this is state", state?.data);

  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: allObjectives, isLoading: isLoadingObjectives } =
    useFindAllObjectivesQuery();
  const [createQuiz, { isLoading: isLoadingQuiz }] = useCreateQuizMutation();
  const { data: AllQuiz } = useFindAllQuizQuery();
  const [openExamTypeDialog, setOpenExamTypeDialog] = useState(false);
  const [openQuizDialog, setOpenQuizDialog] = useState(false);

  console.log("here me", AllQuiz);

  const isLoading = false;

  const {
    register,
    handleSubmit: tyui,
    formState: { errors },
  } = useForm<z.infer<typeof AITaskSchema>>({
    mode: "onChange",
    resolver: zodResolver(AITaskSchema),
  });

  const dialogRef = useRef(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [search, setSearch] = useState("");
  const [filteredObjectives, setFilteredObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [followUp, setFollowUp] = useState("");
  const [classRoomName, setClassRoomName] = useState();

  // const handleSearchChange = (e) => {
  //   const value = e.target.value;
  //   setSearch(value);
  //   if (value.trim() === '') {
  //     setFilteredObjectives([]);
  //   } else {
  //     const filtered = allObjectives?.filter((objective) =>
  //       objective?.objective?.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setFilteredObjectives(filtered);
  //   }
  // };

  console.log(classRoomName);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      setFilteredObjectives([]);
    } else {
      const filtered = allObjectives?.filter((objective) => {
        const searchValue = value.toLowerCase();
        return (
          objective?.objective?.toLowerCase().includes(searchValue) ||
          objective?.category?.toLowerCase().includes(searchValue) ||
          objective?.topic?.toLowerCase().includes(searchValue) ||
          objective?.subject?.toLowerCase().includes(searchValue)
        );
      });
      setFilteredObjectives(filtered);
    }
  };

  const handleObjectiveSelect = (objective) => {
    console.log("this is it", objective);
    setSelectedObjective(objective);
    setSearch(objective?.objective);
    setFilteredObjectives([]);
  };

  const handleSubmit = async () => {
    // Submit handler logic
    const payload = {
      classRoomName: state?.data?.classTitle,
      classId: state?.data?._id,
      accountId: userInfo.accountId,
      objCode: selectedObjective?.objCode,
      objective: selectedObjective?.objective,
      category: selectedObjective?.category,
      subject: selectedObjective?.subject,
      topic: selectedObjective?.topic,
      numberOfQuestions,
      followUp,
      teacherId: userInfo?._id,
      teacherName: userInfo?.fullName,
    };

    const response = await createQuiz(payload);
    console.log(response);
    console.log("heere", payload);
    if (response.data.status === true) {
      dialogRef.current.close();
      alert(response.data.message);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <>
      {/* create class modal */}
      <dialog id="my_modal_3" className="modal" ref={dialogRef}>
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Create Quiz</h3>

          <div className="mt-4">
            <Label className="form-control w-full min-w-full">
              <div className="label mt-4">
                <span className="label-text font-medium">
                  Search learning outcome
                </span>
              </div>

              <Label className="input input-bordered flex items-center gap-2 relative">
                <Input
                  value={search}
                  onChange={handleSearchChange}
                  type="text"
                  className="w-full"
                  placeholder="Search"
                />
                {filteredObjectives.length > 0 && (
                  <ul className="absolute left-0 top-full bg-white border border-gray-300 w-full  overflow-y-auto">
                    {filteredObjectives.map((objective, index) => (
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
              </Label>

              <div className="label mt-4">
                <span className="label-text font-medium">
                  Number of questions
                </span>
              </div>
              <Label className="input input-bordered flex items-center gap-2">
                <Input
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  type="text"
                  className="w-full"
                  placeholder="Number of questions"
                />
              </Label>

              <div className="label mt-4">
                <span className="label-text font-medium">
                  Describe follow-up learning activities
                </span>
              </div>
              <textarea
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
                placeholder="Describe follow-up learning activities"
                className="textarea textarea-bordered textarea-lg w-full max-w-full min-w-full"
              ></textarea>
            </Label>
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} className="btn min-w-full">
              Create Quiz
            </button>
          </div>
        </div>
      </dialog>

      <div className="flex flex-row justify-end mb-5">
        <Button onClick={() => setOpenExamTypeDialog(true)}>
          Create a quiz
        </Button>
      </div>

      <Card x-chunk="dashboard-01-chunk-5">
        <CardHeader className="px-6 py-3">
          <CardTitle className="text-lg">Students</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {state?.data?.numberOfStudents &&
            state?.data?.numberOfStudents.map((student, index: number) => (
              <Link
                key={index}
                to=""
                className="flex gap-2 items-center p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-slate-50"
              >
                <span
                  className="text-white flex items-center justify-center size-11 rounded-full text-xl bg-lime-700 uppercase"
                  // style={{ backgroundColor: avatarColors[index] }}
                >
                  {getInitialsFromFullName(student.fullName)}
                </span>
                <span className="flex flex-col">
                  <p className="text-lg capitalize">{student.fullName}</p>
                </span>
              </Link>
            ))}
        </CardContent>
      </Card>

      <Link
        to="/teacher/class/create-report"
        state={{ studentData: state.data.numberOfStudents }}
        className="hover:underline text-primary w-fit"
      >
        Create Report
      </Link>

      {/* <Card x-chunk="dashboard-01-chunk-5">
        <CardHeader className="px-6 py-3">
          <CardTitle className="text-lg">quizzes</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {AllQuiz?.map((i, index) => {
            return (
              <div className="">
                <div className="card bg-white border-2 border-slate-300 text-primary-content w-96">
                  <div className="card-body px-3 py-3">
                    <img src={Books} className=" h-[200px] rounded-md" />
                    <h2 className="card-title text-slate-950">{i?.subject}</h2>
                    <p className="text-slate-800">Topic: {i?.topic}</p>
                    <div className="text-slate-950"></div>
                    <div className="card-actions justify-start">
                      <div className="flex-row flex">
                        <div className="avatar">
                          <div className="w-[50px] rounded-xl">
                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                          </div>
                        </div>
                        <div className="px-3 justify-center">
                          <div className="text-slate-800 font-semibold text-[18px]">
                            {i?.teacherName}
                          </div>
                          <div className="text-slate-800 font-semibold text-[14px]">
                            {i?.classRoomName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card> */}
      <Dialog open={openExamTypeDialog} onOpenChange={setOpenExamTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Quiz Type</DialogTitle>
            <DialogDescription className="flex gap-3 pt-5 flex-col">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenQuizDialog(true);
                  setOpenExamTypeDialog(false);
                }}
              >
                Exam Style Questions (summative assesment)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // setOpenQuizDialog(true);
                  document.getElementById("my_modal_3").showModal();
                  setOpenExamTypeDialog(false);
                }}
              >
                Learning Outcome Quizzes (formative assessment)
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={openQuizDialog} onOpenChange={setOpenQuizDialog}>
        <DialogContent className="h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Exam Style Questions</DialogTitle>
            <DialogDescription className="flex gap-3 pt-5 flex-col">
              <Label className="input input-bordered flex items-center gap-2 relative">
                <Input
                  value={search}
                  onChange={handleSearchChange}
                  type="text"
                  className="w-full"
                  placeholder="Search"
                />
                {filteredObjectives.length > 0 && (
                  <ul className="absolute left-0 top-full bg-white border border-gray-300 w-full  overflow-y-auto">
                    {filteredObjectives.map((objective, index) => (
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
              </Label>

              <Label>
                Estimated Time (In Minutes)
                <Input
                  type="text"
                  {...register("estimated_time")}
                  className="mt-1"
                />
                <span className="text-red-400 text-xs">
                  <i>{errors?.estimated_time?.message}</i>
                </span>
              </Label>
              <Label>
                Total Questions
                <Input
                  type="number"
                  {...register("total_questions")}
                  className="mt-1"
                />
                <span className="text-red-400 text-xs">
                  <i>{errors?.total_questions?.message}</i>
                </span>
              </Label>
              <Label>
                Total Score
                <Input
                  type="number"
                  {...register("total_score")}
                  className="mt-1"
                />
                <span className="text-red-400 text-xs">
                  <i>{errors?.total_score?.message}</i>
                </span>
              </Label>
              <Label>
                Points Per Question
                <Input
                  type="number"
                  {...register("points_per_question")}
                  className="mt-1"
                />
                <span className="text-red-400 text-xs">
                  <i>{errors?.points_per_question?.message}</i>
                </span>
              </Label>
              <Label className="relative text-slate-900">
                Question Type
                <select
                  className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8"
                  {...register("question_type")}
                >
                  <option value="">--Select Question Type--</option>
                  {["multiple_choice", "exam"].map((style, index) => (
                    <option key={index} value={style}>
                      {style.charAt(0).toLocaleUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
                <span className="text-red-400 text-xs">
                  <i>{errors?.question_type?.message}</i>
                </span>
              </Label>
              <Label className="relative text-slate-900">
                Select Country
                <select
                  className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8"
                  {...register("user_country")}
                >
                  <option value="">--Select Country--</option>
                  {["India", "Nigeria"].map((style, index) => (
                    <option key={index} value={style}>
                      {style.charAt(0).toLocaleUpperCase() + style.slice(1)}
                    </option>
                  ))}
                  <span className="text-red-400 text-xs">
                    <i>{errors?.user_country?.message}</i>
                  </span>
                </select>
              </Label>
              <Label className="relative text-slate-900">
                Exam Board
                <select
                  className="w-full h-14 mt-1 border-border bg-transparent border-solid border rounded-md pl-[10px] pr-8"
                  {...register("exam_board")}
                >
                  <option value="">--Exam Board--</option>
                  {["WAEC", "JAMB", "CBSE"].map((style, index) => (
                    <option key={index} value={style}>
                      {style.charAt(0).toLocaleUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </select>
                <span className="text-red-400 text-xs">
                  <i>{errors?.exam_board?.message}</i>
                </span>
              </Label>
              <div className="w-full flex justify-center mt-5">
                <Button disabled={isLoading}>
                  {isLoading && (
                    <span className="mr-2 animate-spin">
                      <Loader />
                    </span>
                  )}
                  Generate Task
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeacherRoom;
