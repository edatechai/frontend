import { useGetAllQuizzesByTeacherIdQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
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

interface QuizGroup {
  _id: {
    subject: string;
    classId: string;
    classRoomName: string;
  };
  quizzes: any[];
}

export default function Quizzes() {
  const [selectedQuiz, setSelectedQuiz] = useState<any[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const [previousPage, setPreviousPage] = useState(1);
  
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  console.log("this is user", userInfo);
  
  const { data, isLoading, error, isFetching } = useGetAllQuizzesByTeacherIdQuery({
    id: userInfo._id,
    page: currentPage,
    limit: limit,
  });
  
  console.log("Quiz data:", data, "isFetching:", isFetching, "isPaginationLoading:", isPaginationLoading);

  const handlePageChange = (newPage: number) => {
    console.log("Changing page from", currentPage, "to", newPage);
    setIsPaginationLoading(true);
    setPreviousPage(currentPage);
    setCurrentPage(newPage);
  };

  // Reset pagination loading when data changes for the new page
  React.useEffect(() => {
    console.log("Effect triggered - currentPage:", currentPage, "previousPage:", previousPage, "isFetching:", isFetching, "data:", !!data);
    
    // Only reset loading if we've actually changed pages and have data
    if (currentPage !== previousPage && data && !isFetching) {
      console.log("Resetting pagination loading");
      setIsPaginationLoading(false);
      setPreviousPage(currentPage);
    }
    
    // Also reset on initial load
    if (currentPage === previousPage && data && !isFetching && !isLoading) {
      setIsPaginationLoading(false);
    }
  }, [currentPage, previousPage, data, isFetching, isLoading]);

  const pagination = data?.pagination;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Task</h1>
        {pagination && (
          <div className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} quiz groups
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading quizzes...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-red-500">Error loading quizzes. Please try again.</div>
        </div>
      ) : !data?.data?.length ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">No quizzes found</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((quiz: QuizGroup) => (
              <div 
                key={`${quiz._id.subject}-${quiz._id.classId}-${quiz._id.classRoomName}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-[16px] font-semibold text-gray-800">{quiz?._id.classRoomName}</h2>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {quiz.quizzes?.length || 0} quiz{quiz.quizzes?.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Subject:</span> {quiz._id.subject}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-end items-right">
                    <div
                      className="px-4 py-2 text-[14px] cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={() => {
                        setSelectedQuiz(quiz?.quizzes);
                        setIsModalOpen(true);
                      }}
                    >
                      View Task Details
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              {isPaginationLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev || isPaginationLoading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext || isPaginationLoading}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
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
                                ? 'bg-blue-600 text-white'
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

      {/* Modal */}
      {isModalOpen && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Quiz Details</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="space-y-4">
              {selectedQuiz?.map((quiz: any, index: number) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="text-[17px] font-semibold mb-2">Objective: {quiz?.objective}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <p><span className="font-medium">Topic:</span> {quiz?.topic ? quiz?.topic : 'Not set'}</p>
                    <p><span className="font-medium">Duration:</span> {quiz?.quizDuration ? quiz?.quizDuration : 'Not set'} minutes</p>
                    <p><span className="font-medium">Total Questions:</span> {quiz?.numberOfQuestions}</p>
                    <p><span className="font-medium">Status:</span> {quiz?.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
