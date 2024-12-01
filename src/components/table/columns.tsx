import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Ellipsis,
  Delete,
  Pencil,
  Loader,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import {
  useDeleteAimByIDMutation,
  useDeleteSubjectByIDMutation,
  useDeleteYearGroupByIDMutation,
  useUpdateArmByIDMutation,
  useUpdateNumberOfLearningObjectiveMutation,
  useUpdatePassScoreMutation,
  useUpdateSubjectByIDMutation,
  useUpdateYearGroupByIDMutation,
} from "@/features/api/apiSlice";
import { Input } from "../ui/input";
import { Label } from "recharts";
import { toTitleCase } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Label as FormLabel } from "../ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArmFormSchema,
  SubjectFormSchema,
  YearGroupFormSchema,
} from "../org/classSettings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DataTable } from "./data-table";
import QuizReport from "../Quiz/quizReport";

export type licenses = {
  email: string;
  fullName: string;
  licenseCode: string;
  licenseLimit: number;
  parentLicense: string;
  role: string;
};

export type org = {
  accountName: string;
  email: string;
  category: string;
  numberOfLicense: string;
  license: {
    licenseCode: string;
    parentLicense: string;
    email: string;
    fullName?: string;
    role?: string;
    username?: string;
  }[];
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

export type YearGroup = {
  _id: string;
  accountId: string;
  yearGroup: string;
  createdAt: string;
};

export type Arm = {
  _id: string;
  accountId: string;
  aim: string;
  createdAt: string;
};

export type Subject = {
  _id: string;
  accountId: string;
  subject: string;
  createdAt: string;
};

export const columns: ColumnDef<Results>[] = [
  {
    accessorKey: "updatedAt",
    // header: "Date",
    sortingFn: "datetime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
          className="hover:bg-primary hover:text-primary-foreground p-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      date.toISOString().substring(0, 10);
      return (
        <div className="whitespace-nowrap">
          {date.toISOString().substring(0, 10)}
        </div>
      );
    },
  },
  {
    accessorKey: "classRoomName",
    header: "Classroom",
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => {
      return <div>{toTitleCase(row.getValue("topic"))}</div>;
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "objective",
    header: "Objective",
    cell: ({ row }) => {
      return <div>{toTitleCase(row.getValue("objective"))}</div>;
    },
  },
  {
    accessorKey: "scorePercentage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary hover:text-primary-foreground px-0"
        >
          Score Percentage
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="px-3 py-2.5 bg-border w-fit rounded-md">
          {Math.round(row.getValue("scorePercentage"))}%
        </div>
      );
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
  {
    accessorKey: "updatedAt",
    // header: "Date",
    sortingFn: "datetime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
          className="hover:bg-primary hover:text-primary-foreground p-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return <div>{date.toISOString().substring(0, 10)}</div>;
    },
  },
  {
    accessorKey: "classRoomName",
    header: "Classroom",
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => {
      return <div>{toTitleCase(row.getValue("topic"))}</div>;
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "objective",
    header: "Objective",
    cell: ({ row }) => {
      return <div>{toTitleCase(row.getValue("objective"))}</div>;
    },
  },
  {
    accessorKey: "scorePercentage",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-primary hover:text-primary-foreground p-0"
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
    cell: ({ row }) => <QuizReport quizResults={row.original.quizResults} />,
  },
];
export const childResultColumns: ColumnDef<Results>[] = [
  // {
  //   accessorKey: "createdAt",
  //   // header: "Date",
  //   sortingFn: "datetime",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
  //         className="hover:bg-primary hover:text-primary-foreground"
  //       >
  //         Date
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue("createdAt"));
  //     date.toISOString().substring(0, 10);
  //     return <div>{row.getValue("createdAt").slice(0, 10)}</div>;
  //   },
  // },
  {
    accessorKey: "classRoomName",
    header: "Classroom",
  },
  {
    accessorKey: "topic",
    header: "Topic",
    cell: ({ row }) => {
      return <div>{toTitleCase(row.getValue("topic"))}</div>;
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "objective",
    header: "Objective",
    cell: ({ row }) => {
      return <div>{toTitleCase(row.getValue("objective"))}</div>;
    },
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
    cell: ({ row }) => <QuizReport quizResults={row.original.quizResults} />,
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
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      if (!row.original.username) {
        return <span>Not assigned</span>;
      } else return <span>{row.original.username}</span>;
    }
  },
  {
    accessorKey: "fullName",
    cell: ({ row }) => {
      if (!row.original.fullName) {
        return <span>Not assigned</span>;
      } else return <span className="capitalize">{row.original.fullName}</span>;
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

            {license.username && (
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(license.username);
                toast("Username copied!");
              }}
            >
              Copy username
            </DropdownMenuItem>
            )}


            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(license.licenseCode);
                toast("License code copied!");
              }}
            >
              Copy license code
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(license.parentLicense);
                toast("Parent's license code copied!");
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
    cell: ({ row }) => (
      <div className="capitalize">{row.original.user.fullName}</div>
    ),
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

export const yearGroupColumns: ColumnDef<YearGroup>[] = [
  {
    accessorKey: "yearGroup",
    header: "Year group",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toISOString().substring(0, 10)}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const yearGroup = row.original;
      const [updateYearGroup, { isLoading }] = useUpdateYearGroupByIDMutation();
      const [deleteYearGroup, { isLoading: isDeleting }] =
        useDeleteYearGroupByIDMutation();
      const form = useForm<z.infer<typeof YearGroupFormSchema>>({
        resolver: zodResolver(YearGroupFormSchema),
        defaultValues: {
          yearGroup: yearGroup?.yearGroup,
        },
      });

      async function onSubmit(data: z.infer<typeof YearGroupFormSchema>) {
        try {
          const response = await updateYearGroup({
            payload: {
              yearGroup: data.yearGroup,
              accountId: yearGroup.accountId,
            },
            id: yearGroup._id,
          });
          if (response.error) {
            toast.error("Year group creation failed", {
              description: response?.error?.data?.message,
            });
            console.log({ backendError: response.error });
          } else {
            toast(response.data.message);
          }
        } catch (error) {
          toast.error("Year group creation failed", {
            description: "Something went wrong",
          });
          console.log("error", error);
        }
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 border-0 bg-transparent font-normal gap-2 w-full justify-start cursor-pointer hover:bg-border"
                >
                  <Pencil className="size-4" /> Edit year group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit year group</DialogTitle>
                  <DialogDescription>
                    Make changes to the year group here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="yearGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YearGroup</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <span className="mr-2 animate-spin">
                          <Loader />
                        </span>
                      )}
                      Save changes
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger className="flex gap-2 border-0 relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-border">
                <Delete className="size-4" />
                Delete year group
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to delete{" "}
                    {yearGroup.yearGroup}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the year group from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteYearGroup(yearGroup._id)}
                    disabled={isDeleting}
                    className="bg-orange-700"
                  >
                    {isLoading && (
                      <span className="mr-2 animate-spin">
                        <Loader />
                      </span>
                    )}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const ArmColumns: ColumnDef<Arm>[] = [
  {
    accessorKey: "aim",
    header: "Arm",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toISOString().substring(0, 10)}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const aim = row.original;
      const [updateArm, { isLoading }] = useUpdateArmByIDMutation();
      const [deleteArm, { isLoading: isDeleting }] = useDeleteAimByIDMutation();
      const form = useForm<z.infer<typeof ArmFormSchema>>({
        resolver: zodResolver(ArmFormSchema),
        defaultValues: {
          aim: aim?.aim,
        },
      });

      async function onSubmit(data: z.infer<typeof ArmFormSchema>) {
        try {
          const response = await updateArm({
            payload: {
              aim: data.aim,
              accountId: aim.accountId,
            },
            id: aim._id,
          });
          if (response.error) {
            toast.error("Arm creation failed", {
              description: response?.error?.data?.message,
            });
            console.log({ backendError: response.error });
          } else {
            toast(response.data.message);
          }
        } catch (error) {
          toast.error("Arm creation failed", {
            description: "Something went wrong",
          });
          console.log("error", error);
        }
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 border-0 bg-transparent font-normal gap-2 w-full justify-start cursor-pointer hover:bg-border"
                >
                  <Pencil className="size-4" /> Edit arm
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit arm</DialogTitle>
                  <DialogDescription>
                    Make changes to the arm here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-2/3 space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="aim"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Arm</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <span className="mr-2 animate-spin">
                          <Loader />
                        </span>
                      )}
                      Save changes
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger className="flex gap-2 border-0 relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-border">
                <Delete className="size-4" />
                Delete arm
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to delete {aim?.aim}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the arm from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteArm(aim._id);
                    }}
                    disabled={isDeleting}
                    className="bg-orange-700"
                  >
                    {isLoading && (
                      <span className="mr-2 animate-spin">
                        <Loader />
                      </span>
                    )}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const subjectColumns: ColumnDef<Subject>[] = [
  {
    accessorKey: "subject",
    header: "subject",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toISOString().substring(0, 10)}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const subject = row.original;
      const [updateSubject, { isLoading }] = useUpdateSubjectByIDMutation();
      const [deleteSubject, { isLoading: isDeleting }] =
        useDeleteSubjectByIDMutation();
      const form = useForm<z.infer<typeof SubjectFormSchema>>({
        resolver: zodResolver(SubjectFormSchema),
        defaultValues: {
          subject: subject.subject,
        },
      });

      async function onSubmit(data: z.infer<typeof SubjectFormSchema>) {
        try {
          const response = await updateSubject({
            payload: {
              subject: data.subject,
              accountId: subject.accountId,
            },
            id: subject._id,
          });
          if (response.error) {
            toast.error("Arm creation failed", {
              description: response?.error?.data?.message,
            });
            console.log({ backendError: response.error });
          } else {
            toast(response.data.message);
          }
        } catch (error) {
          toast.error("Arm creation failed", {
            description: "Something went wrong",
          });
          console.log("error", error);
        }
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 border-0 bg-transparent font-normal gap-2 w-full justify-start cursor-pointer hover:bg-border"
                >
                  <Pencil className="size-4" /> Edit subject
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit arm</DialogTitle>
                  <DialogDescription>
                    Make changes to the arm here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="full space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem className="w-2/3">
                          <FormLabel>Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mathematics">
                                Mathematics
                              </SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="Chemistry">
                                Chemistry
                              </SelectItem>
                              <SelectItem value="Physic">Physis</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && (
                          <span className="mr-2 animate-spin">
                            <Loader />
                          </span>
                        )}
                        Save changes
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger className="flex gap-2 border-0 relative select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-border">
                <Delete className="size-4" />
                Delete subject
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to delete{" "}
                    {subject?.subject}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the subject from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteSubject(subject._id);
                    }}
                    disabled={isDeleting}
                    className="bg-orange-700"
                  >
                    {isLoading && (
                      <span className="mr-2 animate-spin">
                        <Loader />
                      </span>
                    )}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const orgColumns: ColumnDef<org>[] = [
  {
    cell: ({ row }) => (
      <span className="capitalize">{row.original.license[0].fullName}</span>
    ),
    header: "Contact Details",
  },
  {
    accessorKey: "accountName",
    header: "Name of Organisation",
  },
  {
    header: "Email Address",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.license[0].email}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    header: "Number of Licenses",
    accessorKey: "numberOfLicense",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const license = row.original;
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Licenses</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-x-hidden overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Licenses</DialogTitle>
              {/* <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription> */}
            </DialogHeader>
            <div className="overflow-x-auto">
              <DataTable
                columns={orgLicenseColumns}
                data={license.license}
                isLoading={false}
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
];

export const orgLicenseColumns: ColumnDef<org["license"][0]>[] = [
  {
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="">{row?.original?.fullName || "Not assigned"}</div>
      );
    },
  },
  {
    header: "Email",
    cell: ({ row }) => {
      return <div className="">{row?.original?.email || "Not assigned"}</div>;
    },
  },
  {
    accessorKey: "licenseCode",
    header: "License",
  },
  {
    accessorKey: "parentLicense",
    header: "Parent license",
  },
  {
    header: "Role",
    cell: ({ row }) => {
      return <div className="">{row?.original?.role || "Not assigned"}</div>;
    },
  },
];
