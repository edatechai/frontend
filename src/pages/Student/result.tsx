import { resultColumns } from "@/components/table/columns";
import { useSelector } from "react-redux";

import { DataTable } from "../../components/table/data-table";
import { useGetQuizResultByUserIdQuery } from "../../features/api/apiSlice";

export const Result = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { data: quizResult, isLoading: quizResultLoading } =
    useGetQuizResultByUserIdQuery(userInfo._id);
  console.log({ q: quizResult?.data });

  return (
    <main>
      <h1 className="text-lg font-medium">Results</h1>
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={resultColumns}
          data={quizResult?.data || []}
          isLoading={quizResultLoading}
        />
      </div>
    </main>
  );
};
