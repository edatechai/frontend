import { childResultColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useGetChildResultQuery } from "@/features/api/apiSlice";
import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { apiSlice } from "@/features/api/apiSlice";

const ChildResult = () => {
  const { childId } = useParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isError, error } = useGetChildResultQuery(
    { childId: childId as string, page, limit: pageSize },
    { skip: !childId }
  );

  // Background prefetch: kick off fetching as soon as childId is available
  const prefetchChildResult = apiSlice.usePrefetch("getChildResult");
  useEffect(() => {
    if (!childId) return;
    // Prefetch first page immediately
    prefetchChildResult({ childId: childId as string, page: 1, limit: pageSize }, { force: true });
    // Also prefetch the next page to make pagination feel instant
    prefetchChildResult({ childId: childId as string, page: 2, limit: pageSize }, { force: false });
  }, [childId, pageSize, prefetchChildResult]);

  const serverPaging = useMemo(() => {
    const p = data?.pagination;
    return p
      ? {
          page: p.page,
          pages: p.pages,
          total: p.total,
          hasPrev: p.hasPrev,
          hasNext: p.hasNext,
          pageSize,
          onPageChange: (nextPage: number) => setPage(nextPage),
          onPageSizeChange: (nextSize: number) => {
            setPageSize(nextSize);
            setPage(1);
          },
        }
      : undefined;
  }, [data?.pagination, pageSize]);

  return (
    <main>
      <h1 className="text-2xl font-medium capitalize">
        {data?.data?.userInfo?.fullName}
      </h1>
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={childResultColumns}
          data={data?.data?.results || []}
          isLoading={!!isLoading}
          isError={!!isError}
          error={error}
          serverPaging={serverPaging}
          pageSize={pageSize}
        />
      </div>
    </main>
  );
};

export default ChildResult;
