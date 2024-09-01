import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Ellipsis } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import {
  useUpdateNumberOfLearningObjectiveMutation,
  useUpdatePassScoreMutation,
} from "@/features/api/apiSlice";
import { Input } from "../ui/input";
import { Label } from "recharts";

export type licenses = {
  email: string;
  fullName: string;
  licenseCode: string;
  licenseLimit: number;
  parentLicense: string;
  role: string;
};

export type Results = {
  category: string;
  classRoomName: string;
  updatedAt: string;
  objective: string;
  scorePercentage: string;
  subject: string;
  topic: string;
  quizResults: {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    correctOption: string;
    isCorrect: boolean;
    wrongOption: string;
  }[];
};

export type Child = {
  user: {
    _id: string;
    fullName: string;
    email: string;
    license: string;
    role: string;
    username: string;
    passScore: number;
    numberOfLearningObjectives: number;
  };
};

export const columns: ColumnDef<Results>[] = [
  //   {
  //     accessorKey: "category",
  //     header: "Category",
  //   },
  {
    accessorKey: "classRoomName",
    header: "Classroom",
  },
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  //   {
  //     accessorKey: "updatedAt",
  //     header: "Date Taken",
  //     columnFormatting: {
  //       type: "date",
  //       format: "MM/DD/YYYY",
  //     },
  //   },
  {
    accessorKey: "objective",
    header: "Objective",
  },
  {
    accessorKey: "scorePercentage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary hover:text-primary-foreground"
        >
          Score Percentage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{Math.round(row.getValue("scorePercentage"))}%</div>;
    },
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => (
  //     <Button
  //       variant="outline"
  //       onClick={() => {
  //         console.log(row.original);
  //       }}
  //     >
  //       View Score
  //     </Button>
  //   ),
  // },
];

export const resultColumns: ColumnDef<Results>[] = [
  //   {
  //     accessorKey: "category",
  //     header: "Category",
  //   },
  {
    accessorKey: "classRoomName",
    header: "Classroom",
  },
  {
    accessorKey: "topic",
    header: "Topic",
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  //   {
  //     accessorKey: "updatedAt",
  //     header: "Date Taken",
  //     columnFormatting: {
  //       type: "date",
  //       format: "MM/DD/YYYY",
  //     },
  //   },
  {
    accessorKey: "objective",
    header: "Objective",
  },
  {
    accessorKey: "scorePercentage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary hover:text-primary-foreground"
        >
          Score Percentage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{Math.round(row.getValue("scorePercentage"))}%</div>;
    },
  },
  {
    id: "actions",
    header: "Action",
    enableHiding: false,
    cell: ({ row }) => (
      <Sheet>
        <SheetTrigger className="whitespace-nowrap rounded bg-white p-2 border">
          View Report
        </SheetTrigger>
        <SheetContent className="sm:w-[540px] overflow-auto">
          <SheetHeader className="overflow-y-scroll  text-left">
            <SheetTitle>Quiz Report</SheetTitle>
            <SheetDescription>
              {row.original.quizResults.map((val, index: number) => (
                <Card className="mb-3" key={index}>
                  <CardHeader>
                    <CardTitle>Question {index + 1}</CardTitle>
                    <CardDescription>Question: {val.question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {val.isCorrect ? (
                      <p className="text-green-700">
                        You choose the right answer
                      </p>
                    ) : (
                      <p className="text-destructive">
                        You choose a wrong answer
                      </p>
                    )}
                    <p>Correct option: {val.correctOption}</p>
                    <p>Correct answer: {val.correctAnswer}</p>
                    <p>Your answer: {val.selectedAnswer}</p>
                    <p>{val.wrongOption}</p>
                  </CardContent>
                </Card>
              ))}
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    ),
  },
];

export const licenseColumns: ColumnDef<licenses>[] = [
  {
    accessorKey: "licenseCode",
    header: "License Code",
  },
  {
    accessorKey: "parentLicense",
    header: "Parent License",
  },
  {
    accessorKey: "licenseLimit",
    header: "License Limit",
  },
  {
    accessorKey: "fullName",
    cell: ({ row }) => {
      if (!row.original.fullName) {
        return <span>Not assigned</span>;
      } else return <span>{row.original.fullName}</span>;
    },
    header: "Owner",
  },
  {
    accessorKey: "email",
    cell: ({ row }) => {
      if (!row.original.email) {
        return <span>Not assigned</span>;
      } else return <span>{row.original.email}</span>;
    },
    header: "Email",
  },
  {
    accessorKey: "role",
    cell: ({ row }) => {
      if (!row.original.role) {
        return <span>Not assigned</span>;
      } else return <span>{row.original.role}</span>;
    },
    header: "Role",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const license = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(license.licenseCode);
                toast("Copied!");
              }}
            >
              Copy license code
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(license.parentLicense);
                toast("Copied!");
              }}
            >
              Copy parent's license code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const childColumns: ColumnDef<Child>[] = [
  {
    header: "Name",
    cell: ({ row }) => row.original.user.fullName,
  },
  {
    header: "License code",
    cell: ({ row }) => row.original.user.license,
  },
  {
    header: "Quiz taken",
    cell: ({ row }) => row.original.user.passScore,
  },
  {
    // accessorKey: "passScore",
    header: "Minimum score",
    cell: ({ row }) => row.original.user.passScore,
  },
  {
    // accessorKey: "numberOfLearningObjectives",
    header: "Learning objectives",
    cell: ({ row }) => row.original.user.numberOfLearningObjectives,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const { _id } = row.original.user;
      const [updatePassScore, { isLoading: sisloading }] =
        useUpdatePassScoreMutation();
      const [updateNumberOfLearningObjective, { isLoading: sisloading2 }] =
        useUpdateNumberOfLearningObjectiveMutation();
      const [passScore, setPassScore] = useState("");
      const [numberOfLearningObjectives, setNumberOfLearningObjectives] =
        useState("");

      const handleUpdateNumberOfLearningObjective = async () => {
        try {
          const res = await updateNumberOfLearningObjective({
            id: _id,
            numberOfLearningObjectives: numberOfLearningObjectives,
          }).unwrap();
          console.log(res);
          if (res.status === true) {
            alert("pass score updated successfully");
          }
        } catch (error) {
          console.error("Error updating pass score:", error);
          alert(error);
        }
      };

      const handleUpdate = async () => {
        try {
          const res = await updatePassScore({
            id: _id,
            passScore: passScore,
          }).unwrap();
          console.log(res);
          if (res.status === true) {
            alert("pass score updated successfully");
          }
        } catch (error) {
          console.error("Error updating pass score:", error);
          alert(error);
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-border w-full">
                  Update minimum score
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update child minimum score</DialogTitle>
                  <DialogDescription>
                    <div className="mt-4">
                      <Label>Minimum score</Label>
                      <Input
                        value={passScore}
                        disabled={sisloading}
                        onChange={(e) => setPassScore(e.target.value)}
                        type="text"
                        className="w-full"
                        placeholder="Enter license code"
                      />
                    </div>
                    <Button
                      onClick={handleUpdate}
                      disabled={sisloading}
                      className="mx-auto block mt-4"
                    >
                      Submit
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <DropdownMenuSeparator />
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-border w-full">
                  Update number of objectives
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Number of learning objective</DialogTitle>
                  <DialogDescription>
                    <div className="mt-4">
                      <Label>Number</Label>
                      <Input
                        value={numberOfLearningObjectives}
                        disabled={sisloading}
                        onChange={(e) =>
                          setNumberOfLearningObjectives(e.target.value)
                        }
                        type="text"
                        className="w-full"
                        placeholder="Enter a number"
                      />
                    </div>
                    <Button
                      onClick={handleUpdateNumberOfLearningObjective}
                      disabled={sisloading2}
                      className="mx-auto block mt-4"
                    >
                      Submit
                    </Button>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
