import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  useFindAllObjectivesQuery,
  useCreateQuizMutation,
  useLazyGetAllQuizByObjCodeQuery,
} from "../../features/api/apiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getInitialsFromFullName } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Examstyled from "./Examstyled";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import EditQuiz from "../Quiz/multiple-choice/editQuiz";

const TeacherRoom = () => {
  let { state } = useLocation();
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log({ userInfo });
  const { data: allObjectives, isLoading: isLoadingObjectives } =
    useFindAllObjectivesQuery();
  const [createQuiz, { isLoading: isLoadingQuiz }] = useCreateQuizMutation();
  // const { data: AllQuiz } = useFindAllQuizQuery();
  // const { data: AllQuiz } = useGetAllQuizByObjCodeQuery("NM_6");
  const [openExamTypeDialog, setOpenExamTypeDialog] = useState(false);
  const [openQuizDialog, setOpenQuizDialog] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openEditQuizDialog, setOpenEditQuizDialog] = useState(false);
  const [getAllQuiz, { data }] = useLazyGetAllQuizByObjCodeQuery();
  const [edittedIndexes, setEdittedIndexes] = useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [search, setSearch] = useState("");
  const [filteredObjectives, setFilteredObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [followUp, setFollowUp] = useState("");

  console.log("all i need here", { allObjectives, data });
  console.log({ edittedIndexes });
  // console.log({ data: data?.filter((val) => val.country == "United Kingdom") });

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
      console.log("this is fileter", filtered);
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
      const getAllQ = await getAllQuiz({
        lo: selectedObjective?.objective,
        country: userInfo?.country,
        objCode: selectedObjective?.objCode,
      });

      console.log("data here", getAllQ);

      toast(response.data.message);
      setOpenQuizDialog(false);
      setOpenEditQuizDialog(true);
    } else {
      toast.error("Error creating quiz", {
        description: response.data.message,
      });
    }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/teacher">Classrooms</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Students</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* create class modal */}
      <Dialog open={openQuizDialog} onOpenChange={setOpenQuizDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Quiz</DialogTitle>
            {/* <DialogDescription className="flex gap-3 pt-5 flex-col">
            </DialogDescription> */}
            <div className="modal-box w-11/12 max-w-5xl">
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
                    {filteredObjectives?.length > 0 && (
                      <ul className="absolute left-0 top-full bg-white border border-gray-300 w-full  overflow-y-auto">
                        {filteredObjectives.map((objective, index) => (
                          <li
                            key={index}
                            className="p-4 cursor-pointer first-letter:capitalize hover:bg-gray-100"
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
              <Button
                onClick={handleSubmit}
                className="mt-4 w-full"
                disabled={isLoadingQuiz}
              >
                {isLoadingQuiz && (
                  <span className="mr-2 animate-spin">
                    <Loader />
                  </span>
                )}
                Create Quiz
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="flex flex-row justify-end mb-5">
        <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-orange-600 text-white hover:bg-orange-500 hover:text-white"
            >
              Set a new task for students
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select task type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  setOpenQuizDialog(true);
                  setOpenDropdown(false);
                }}
              >
                Multiple choice questions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenExamTypeDialog(true);
                  setOpenDropdown(false);
                }}
              >
                Exam styled questions
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
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
                to={`/teacher/class/${student?._id}`}
                className="flex cursor-pointer gap-2 items-center p-3 rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-slate-50"
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

      <div className="flex justify-end w-full mt-5">
        <Link
          to="/teacher/class/create-report"
          state={{ studentData: state.data.numberOfStudents }}
          className="rounded bg-primary text-primary-foreground px-2 py-1.5"
        >
          Create Report
        </Link>
      </div>

      <Dialog open={openExamTypeDialog} onOpenChange={setOpenExamTypeDialog}>
        <Examstyled
          filteredObjectives={filteredObjectives}
          handleObjectiveSelect={handleObjectiveSelect}
          handleSearchChange={handleSearchChange}
          search={search}
          classId={state?.data?._id}
          country={userInfo?.country}
          openDialog={setOpenExamTypeDialog}
        />
      </Dialog>

      <Dialog open={openEditQuizDialog} onOpenChange={setOpenEditQuizDialog}>
        <DialogContent className="h-[90vh] max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Edit Questions</DialogTitle>
            {/* <DialogDescription className="flex gap-3 pt-5 flex-col">
            </DialogDescription> */}
          </DialogHeader>
          <div className="overflow-y-auto">
            {data?.map((question, index) => {
              if (edittedIndexes?.indexOf(question._id) == -1) {
                return (
                  <EditQuiz
                    index={index}
                    question={question}
                    setEdittedIndexes={setEdittedIndexes}
                    edittedIndexes={edittedIndexes}
                  />
                );
              } else return <></>;
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeacherRoom;
