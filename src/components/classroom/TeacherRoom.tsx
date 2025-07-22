import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  useFindAllObjectivesQuery,
  useCreateQuizMutation,
  useLazyGetAllQuizByObjCodeQuery,
  useGetAccountByIdQuery
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const TeacherRoom = () => {
  let { state } = useLocation();
  const userInfo = useSelector((state: any) => state?.user.userInfo);
  const { data: schoolData } = useGetAccountByIdQuery(userInfo?.accountId);
  const { data: allObjectives } = useFindAllObjectivesQuery({
    subject: state?.data?.subject,
    country: schoolData?.country,
  });

  console.log("this is userInfo here me", userInfo)
  console.log("this is class data", state?.data)
  const [createQuiz] = useCreateQuizMutation();
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
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
  const [quizDuration, setQuizDuration] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [quizStart, setQuizStart] = useState("");
  const [quizEnd, setQuizEnd] = useState("");

  // Ref for the dropdown list
  const dropdownRef = useRef<HTMLUListElement>(null);

  // Handler to scroll the dropdown list up
  const scrollUp = () => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollBy({ top: -40, behavior: "smooth" });
    }
  };

  // Handler to scroll the dropdown list down
  const scrollDown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollBy({ top: 40, behavior: "smooth" });
    }
  };

  const checkIfExceededLimit = async () => {
    const monthlyLimit = state?.data?.monthlyRequestCount;
    const lastRequestMonth = state?.data?.lastRequestMonth;
    const lastRequestYear = state?.data?.lastRequestYear;
    console.log("this is lastRequestMonth", lastRequestMonth);
    console.log("this is lastRequestYear", lastRequestYear);
    console.log("this is monthlyLimit", monthlyLimit);

    const isNewMonth = () => {
      const currentDate = new Date();
      return lastRequestMonth !== currentDate.getMonth() + 1 || // Months are 0-indexed in JavaScript
             lastRequestYear !== currentDate.getFullYear();
    };

    if (monthlyLimit >= 1 && !isNewMonth()) {
      toast.error("You have exceeded your monthly limit try again next month");
    } else {
      setOpenExamTypeDialog(true);
      setOpenDropdown(false);
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // console.log({ value1: value });

    // console.log({ statetes: state });

    console.log({ subject: allObjectives.length });

    if (value.trim() === "") {
      setFilteredObjectives([]);
    } else {
      const filtered = allObjectives
        ?.filter((objective) => {
          const searchValue = value.toLowerCase();
          const matchesSearch =
            objective?.objective?.toLowerCase().includes(searchValue) ||
            objective?.category?.toLowerCase().includes(searchValue) ||
            objective?.topic?.toLowerCase().includes(searchValue) ||
            objective?.subject?.toLowerCase().includes(searchValue);

          return matchesSearch;

          // Filter based on country and objCode
          // if (userInfo.country === "United Kingdom") {
          //   return matchesSearch && objective.objCode.startsWith("E");
          // } else if (userInfo.country === "Nigeria") {
          //   return matchesSearch && objective.objCode.startsWith("N");
          // } else {
          //   return matchesSearch; // For other countries, don't filter by objCode
          // }
        })
        .filter((objs) => {
          // console.log({ subject1: objs.subject, state: state.data.subject });
          return objs.subject == state.data.subject;
        });

      setFilteredObjectives(filtered);

      // console.log({ userInfo });
      console.log("this is filtered", filtered);
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
    setIsLoadingQuiz(true);
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
      quizDuration: isCustomDuration ? customDuration : quizDuration,
      scheduledDate: quizStart ? quizStart : null,
      quizEnd,
    };

    console.log("this is payload", payload);

    const response = await createQuiz(payload);
   
    if (response.data.status === true) {
      console.log("Quiz created successfully, now fetching questions...");
      console.log("Request params:", {
        lo: selectedObjective?.objective,
        country: schoolData?.country,
        objCode: selectedObjective?.objCode,
        page: 1,
        limit: 50
      });

      try {
        const getAllQ = await getAllQuiz({
          lo: selectedObjective?.objective,
          country: schoolData?.country,
          objCode: selectedObjective?.objCode,
          page: 1,
          limit: 50, // Start with smaller chunks for faster loading
        });

        console.log("getAllQ response:", getAllQ);
        console.log("getAllQ data:", getAllQ.data);
        console.log("getAllQ error:", getAllQ.error);
        console.log("getAllQ isLoading:", getAllQ.isLoading);
        console.log("getAllQ isSuccess:", getAllQ.isSuccess);
        console.log("getAllQ isError:", getAllQ.isError);

        if (getAllQ.error) {
          console.error("Error fetching questions:", getAllQ.error);
          toast.error("Error fetching questions");
        } else if (getAllQ.data) {
          console.log("Questions fetched successfully:", getAllQ.data.length);
          toast(response.data.message);
          setOpenQuizDialog(false);
          setOpenEditQuizDialog(true);
        } else {
          console.warn("No data received from getAllQuiz");
          toast.warning("No questions found");
        }
      } catch (error) {
        console.error("Exception in getAllQuiz:", error);
        toast.error("Error fetching questions");
      }

      setIsLoadingQuiz(false);
    } else {
      toast.error("Error creating quiz", {
        description: response.data.message,
      });
      setIsLoadingQuiz(false);
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
            <div className=" ">
              <div className="mt-4">
                <Label className="form-control w-full min-w-full">
                  <div className="label mt-4">
                    <span className="label-text font-medium">
                      Search learning outcome
                    </span>
                  </div>

                  <div className="relative">
                    <Input
                      value={search}
                      onChange={handleSearchChange}
                      type="text"
                      className=""
                      placeholder="Search"
                    />
                    {filteredObjectives?.length > 0 && (
                      <div className="absolute left-0 top-full bg-white border border-gray-300 w-full overflow-hidden z-10">
                        {/* Scroll Up Button */}
                        <button
                          type="button"
                          onClick={scrollUp}
                          className="w-full text-center py-1 bg-gray-200 hover:bg-gray-300"
                          aria-label="Scroll Up"
                        >
                          ▲
                        </button>

                        {/* Dropdown List */}
                        <ul
                          ref={dropdownRef}
                          className="max-h-60 overflow-y-auto"
                        >
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

                        {/* Scroll Down Button */}
                        <button
                          type="button"
                          onClick={scrollDown}
                          className="w-full text-center py-1 bg-gray-200 hover:bg-gray-300"
                          aria-label="Scroll Down"
                        >
                          ▼
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="label mt-4">
                    <span className="label-text font-medium">
                      Number of questions
                    </span>
                  </div>
                  <Input
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(e.target.value)}
                    type="text"
                    className="w-full"
                    placeholder="Number of questions"
                  />

                  {/* how long is the quiz */}
                  <div className="label mt-4">
                    <span className="label-text font-medium">
                      How long is the quiz in minutes
                    </span>
                  </div>
                  {isCustomDuration ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={customDuration}
                        onChange={(e) => {
                          setCustomDuration(e.target.value);
                          setQuizDuration(e.target.value);
                        }}
                        placeholder="Enter minutes"
                        className="w-full"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsCustomDuration(false);
                          setCustomDuration("");
                          setQuizDuration("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Select 
                      value={quizDuration} 
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setIsCustomDuration(true);
                        } else {
                          setQuizDuration(value);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select duration in minutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="custom">Custom duration...</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {/* Scheduled Inputs */}
                  <div className="mt-4">
                    <Label className="form-control w-full min-w-full">
                      <div className="label mt-4">
                        <span className="label-text font-medium">
                          Do you want to schedule this quiz for a later date and time?
                        </span>
                      </div>
                      <Input
                        type="datetime-local"
                        value={quizStart}
                        onChange={(e) => setQuizStart(e.target.value)}
                        className="w-full"
                      />
                    </Label>
                  </div>

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

              {/* <DropdownMenuItem
                onClick={() => {
                  checkIfExceededLimit()
                 
                }}
              >
                Exam styled questions
              </DropdownMenuItem> */}
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
                    userInfo={userInfo}
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
