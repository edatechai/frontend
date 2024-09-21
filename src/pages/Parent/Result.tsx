import { childResultColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { useGetChildResultQuery } from "@/features/api/apiSlice";
import { useParams } from "react-router-dom";

const ChildResult = () => {
  const { childId } = useParams();
  const { data, isLoading } = useGetChildResultQuery(childId);

  console.log({ childData: data });

  return (
    <main>
      <h1 className="text-2xl font-medium capitalize">
        {data?.data?.userInfo?.fullName}
      </h1>
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={childResultColumns}
          data={data?.data?.results || []}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
};

export default ChildResult;
