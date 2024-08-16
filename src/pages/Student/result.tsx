import React from "react";
import { useSelector } from "react-redux";

import { columns } from "../../components/table/columns";
import { DataTable } from "../../components/table/data-table";
import { useGetQuizResultByUserIdQuery } from "../../features/api/apiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Result = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const {
    data: quizResult,
    isLoading: quizResultLoading,
    isSuccess: quizResultSuccess,
    isError: quizResultError,
  } = useGetQuizResultByUserIdQuery(userInfo._id);

  return (
    <main>
      <Card x-chunk="dashboard-01-chunk-5">
        <CardHeader className="px-6 py-3">
          <CardTitle className="text-lg">Results</CardTitle>
        </CardHeader>
        <CardContent className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
          <DataTable
            columns={columns}
            data={quizResult?.data || []}
            isLoading={quizResultLoading}
          />
        </CardContent>
      </Card>
    </main>
  );
};
