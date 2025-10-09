import { useFindMyClassesTeacherQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { JoinClassroom } from "./joinClassroom.tsx";
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

const TeachersClassroom = () => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(8);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);

  const { data: myClasses, isLoading, error, isFetching } = useFindMyClassesTeacherQuery({
    id: userInfo?._id,
    page: currentPage,
    limit: limit,
  }, {
    skip: !userInfo,
  });

  const handlePageChange = (newPage: number) => {
    setIsPaginationLoading(true);
    setCurrentPage(newPage);
  };

  // Reset pagination loading when data arrives
  React.useEffect(() => {
    if (!isFetching) {
      setIsPaginationLoading(false);
    }
  }, [isFetching]);

  const pagination = myClasses?.pagination;

  return (
    <>
      <JoinClassroom userInfo={userInfo} />

      <div className="min-h-screen w-full flex flex-1 flex-col gap-4 md:gap-8 mt-7">
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
              <div className="flex justify-center items-center py-8">
                <div className="text-muted-foreground">Loading classrooms...</div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-red-500">Error loading classrooms</div>
              </div>
            ) : !myClasses?.data?.length ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-muted-foreground">No classrooms found</div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                  {myClasses?.data?.map((i: ClassItem, index: number) => {
                    return (
                      <Card
                        x-chunk="dashboard-01-chunk-0"
                        key={index}
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
                            to="/teacher/class"
                            state={{ data: i }}
                            className="text-primary hover:underline text-sm font-semibold"
                          >
                            Enter Classroom
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    {isPaginationLoading ? (
                      <div className="flex items-center justify-center w-full py-4">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!pagination.hasPrev || isPaginationLoading}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!pagination.hasNext || isPaginationLoading}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
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
                                <Button
                                  key={pageNumber}
                                  variant={pageNumber === pagination.page ? "default" : "outline"}
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => handlePageChange(pageNumber)}
                                  disabled={isPaginationLoading}
                                >
                                  {pageNumber}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TeachersClassroom;