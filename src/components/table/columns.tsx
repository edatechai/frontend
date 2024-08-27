import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
