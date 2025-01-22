import { useGetAllQuizzesByTeacherIdQuery } from "../../features/api/apiSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Quizzes() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const userInfo = useSelector((state: any) => state.user.userInfo);
  console.log("this is user",userInfo);
  const { data } = useGetAllQuizzesByTeacherIdQuery(userInfo._id);
  console.log(data);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Task</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((quiz) => (
          <div 
            key={quiz._id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-[16px] font-semibold text-gray-800">{quiz?._id.classRoomName}</h2>
             
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-end items-right">
                
                <div
                  className=" px-4 py-2 text-[14px] cursor-pointer  text-blue-600  transition-colors"
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
              {selectedQuiz?.map((quiz, index) => (
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
