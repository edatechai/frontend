import { useSelector } from "react-redux";

import { columns } from "../../components/table/columns";
import { DataTable } from "../../components/table/data-table";
import { useGetQuizResultByUserIdQuery } from "../../features/api/apiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
