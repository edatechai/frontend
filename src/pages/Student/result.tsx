import { useState } from "react";
import { resultColumns } from "@/components/table/columns";
import { useSelector } from "react-redux";
import { DataTable } from "../../components/table/data-table";
import { useGetQuizResultByUserIdQuery } from "../../features/api/apiSlice";

export const Result = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data: quizResult, isLoading: quizResultLoading, isFetching: quizResultFetching } =
    useGetQuizResultByUserIdQuery({ id: userInfo._id, page, limit });
  console.log({ q: quizResult });

  return (
    <main>
    
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={resultColumns}
          data={quizResult?.data || []}
          isLoading={quizResultLoading || quizResultFetching}
          pageSize={limit}
          serverPaging={{
            page: quizResult?.pagination?.page || page,
            pages: quizResult?.pagination?.pages || 1,
            total: quizResult?.pagination?.total,
            hasPrev: quizResult?.pagination?.hasPrev,
            hasNext: quizResult?.pagination?.hasNext,
            pageSize: limit,
            onPageChange: (p) => setPage(p),
            onPageSizeChange: (n) => { setPage(1); setLimit(n); }
          }}
        />
      </div>
    </main>
  );
};
