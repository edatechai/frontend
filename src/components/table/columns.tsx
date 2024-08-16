import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Results = {
  category: string;
  classRoomName: string;
  updatedAt: string;
  objective: string;
  scorePercentage: string;
  subject: string;
  topic: string;
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
  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => <Button variant="outline">View Score</Button>,
  //   },
];
