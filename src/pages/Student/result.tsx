import { columns } from "@/components/table/columns";
import { useSelector } from "react-redux";

import { DataTable } from "../../components/table/data-table";
import { useGetQuizResultByUserIdQuery } from "../../features/api/apiSlice";

// export type Results = {
//   category: string;
//   classRoomName: string;
//   updatedAt: string;
//   objective: string;
//   scorePercentage: string;
//   subject: string;
//   topic: string;
// };

// export const columns: ColumnDef<Results>[] = [
//   {
//     accessorKey: "classRoomName",
//     header: "Classroom",
//   },
//   {
//     accessorKey: "topic",
//     header: "Topic",
//   },
//   {
//     accessorKey: "subject",
//     header: "Subject",
//   },
//   //   {
//   //     accessorKey: "updatedAt",
//   //     header: "Date Taken",
//   //     columnFormatting: {
//   //       type: "date",
//   //       format: "MM/DD/YYYY",
//   //     },
//   //   },
//   {
//     accessorKey: "objective",
//     header: "Objective",
//   },
//   {
//     accessorKey: "scorePercentage",
//     header: ({ column }) => {
//       return (
//         <Button
//           variant="ghost"
//           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           className="hover:bg-primary hover:text-primary-foreground"
//         >
//           Score Percentage
//           <ArrowUpDown className="ml-2 h-4 w-4" />
//         </Button>
//       );
//     },
//     cell: ({ row }) => {
//       return <div>{Math.round(row.getValue("scorePercentage"))}%</div>;
//     },
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => <Button variant="outline">View Score</Button>,
//   },
// ];

export const Result = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: quizResult, isLoading: quizResultLoading } =
    useGetQuizResultByUserIdQuery(userInfo._id);

  return (
    <main>
      <h1>Results</h1>
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={columns}
          data={quizResult?.data || []}
          isLoading={quizResultLoading}
        />
      </div>
    </main>
  );
};
