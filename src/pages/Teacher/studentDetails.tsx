import { columns, resultColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useStudentDetailsQuery } from "@/features/api/apiSlice";
import { Link, useParams } from "react-router-dom";

function StudentDetails() {
  const { userId } = useParams();
  const { data, isLoading } = useStudentDetailsQuery(userId);
  console.log({ data });

  return (
    <main>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/teacher">Classrooms</Link>
          </BreadcrumbItem>
          {/* <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/teacher/class">Students</Link>
          </BreadcrumbItem> */}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="capitalize">
              {data?.data?.[0]?.userInfo?.fullName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-lg font-medium capitalize mt-5">
        {data?.data?.[0]?.userInfo?.fullName} Result
      </h1>
      <div className="w-[calc(100vw-32px)] md:w-[calc(100vw-252px)] lg:w-[calc(100vw-328px)] overflow-x-auto">
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}

export default StudentDetails;
