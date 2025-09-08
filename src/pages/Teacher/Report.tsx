import { useFindMyClassesTeacherQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import * as React from "react";

interface UserInfo {
  _id: string;
  [key: string]: any;
}

interface RootState {
  user: {
    userInfo: UserInfo;
  };
}

interface ClassItem {
  _id: string;
  classTitle: string;
  numberOfStudents: any[];
  [key: string]: any;
}

const Report = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [previousPage, setPreviousPage] = useState(1);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  
  const { data: myClasses, isLoading, error, isFetching } = useFindMyClassesTeacherQuery({
    id: userInfo._id,
    page: currentPage,
    limit: limit,
  });
  
  console.log({ myClasses });

  const handlePageChange = (newPage: number) => {
    console.log("Changing page from", currentPage, "to", newPage);
    setIsPaginationLoading(true);
    setPreviousPage(currentPage);
    setCurrentPage(newPage);
  };

  // Reset pagination loading when data changes for the new page
  React.useEffect(() => {
    console.log("Effect triggered - currentPage:", currentPage, "previousPage:", previousPage, "isFetching:", isFetching, "data:", !!myClasses);
    
    // Only reset loading if we've actually changed pages and have data
    if (currentPage !== previousPage && myClasses && !isFetching) {
      console.log("Resetting pagination loading");
      setIsPaginationLoading(false);
      setPreviousPage(currentPage);
    }
    
    // Also reset on initial load
    if (currentPage === previousPage && myClasses && !isFetching && !isLoading) {
      setIsPaginationLoading(false);
    }
  }, [currentPage, previousPage, myClasses, isFetching, isLoading]);

  const pagination = myClasses?.pagination;

  return (
    <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8">
      <Card x-chunk="dashboard-01-chunk-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Classrooms</CardTitle>
          {pagination && (
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} classrooms
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span className="text-muted-foreground">Loading classrooms...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-red-500">Error loading classrooms. Please try again.</div>
            </div>
          ) : !myClasses?.classes?.length ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">No classrooms found</div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {myClasses?.classes?.map((i: ClassItem, index: number) => {
                  return (
                    <Card
                      x-chunk="dashboard-01-chunk-0"
                      key={i._id || index}
                      className="flex flex-col justify-between"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {i.classTitle}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between gap-5 pt-6">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>{i?.numberOfStudents?.length || 0}</div>
                        </span>
                        <Link
                          to={`/teacher/report/${i._id}`}
                          state={{ data: i }}
                          className="text-primary hover:underline text-sm font-semibold"
                        >
                          View Class Report
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.pages > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  {isPaginationLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!pagination.hasPrev || isPaginationLoading}
                          className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </button>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!pagination.hasNext || isPaginationLoading}
                          className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Page {pagination.page} of {pagination.pages}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                            const pageNumber = Math.max(1, Math.min(
                              pagination.pages - 4,
                              pagination.page - 2
                            )) + i;
                            
                            if (pageNumber > pagination.pages) return null;
                            
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                disabled={isPaginationLoading}
                                className={`w-8 h-8 text-sm rounded ${
                                  pageNumber === pagination.page
                                    ? 'bg-primary text-primary-foreground'
                                    : 'border border-gray-300 hover:bg-gray-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;
