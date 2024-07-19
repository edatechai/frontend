


// // // import React, { useState, useEffect } from 'react';
// // // import { Link, useLocation } from 'react-router-dom';
// // // import { useSelector } from 'react-redux';
// // // import { useAnalyzeResultMutation } from '../../features/api/apiSlice';

// // // const Index = (props) => {
// // //   const [currentQuiz, setCurrentQuiz] = useState(null);
// // //   const [correctAnswers, setCorrectAnswers] = useState(0);
// // //   const [selectedAnswer, setSelectedAnswer] = useState('');
// // //   const [currentIndex, setCurrentIndex] = useState(0);
// // //   const [showGrade, setShowGrade] = useState(false);
// // //   const [quizResults, setQuizResults] = useState([]);
// // //   const [correctOption, setCorrectOption] = useState('');
// // //   const userInfo = useSelector((state) => state.user.userInfo);
// // //   const [analyzedData, setAnalyzedData] = useState()
// // //   const [analyzeResult, { isLoading, isSuccess, isError, error }] = useAnalyzeResultMutation()
  

// // //   const data = props?.data.data;

// // //   console.log(data);

// // //   // Set the first quiz on page load
// // //   useEffect(() => {
// // //     if (data?.questionsAndAnswers.length > 0) {
// // //       setCurrentQuiz(data.questionsAndAnswers[0]);
// // //     }
// // //   }, [data]);

// // //   const handleAnswerSelect = (answer) => {
// // //     setSelectedAnswer(answer);
// // //   };

// // //   const handleNextQuestion = () => {
// // //     const isCorrect = selectedAnswer.toLowerCase() === currentQuiz?.answer.toLowerCase();
    
    
// // //         // Determine the correct option value
// // //         const correctOptionValue = 
// // //         currentQuiz?.answer.toLowerCase() === 'a' ? currentQuiz?.optionA :
// // //         currentQuiz?.answer.toLowerCase() === 'b' ? currentQuiz?.optionB :
// // //         currentQuiz?.answer.toLowerCase() === 'c' ? currentQuiz?.optionC :
// // //         currentQuiz?.answer.toLowerCase() === 'd' ? currentQuiz?.optionD : '';
  
// // //       // Determine the wrong option value
// // //       const wrongOptionValue = 
// // //         selectedAnswer.toLowerCase() === 'a' ? currentQuiz?.optionA :
// // //         selectedAnswer.toLowerCase() === 'b' ? currentQuiz?.optionB :
// // //         selectedAnswer.toLowerCase() === 'c' ? currentQuiz?.optionC :
// // //         selectedAnswer.toLowerCase() === 'd' ? currentQuiz?.optionD : '';
  
// // //       const result = {
// // //         question: currentQuiz?.question,
// // //         selectedAnswer: selectedAnswer,
// // //         correctAnswer: currentQuiz?.answer,
// // //         correctOption: correctOptionValue,
// // //         isCorrect: isCorrect,
// // //         wrongOption: wrongOptionValue,
// // //       };

// // //     setQuizResults([...quizResults, result]);

// // //     if (isCorrect) {
// // //       setCorrectAnswers(correctAnswers + 1);
// // //     }
// // //     setSelectedAnswer('');
// // //     if (currentIndex < data.questionsAndAnswers.length - 1) {
// // //       setCurrentIndex(currentIndex + 1);
// // //       setCurrentQuiz(data.questionsAndAnswers[currentIndex + 1]);
// // //     } else {
// // //       setShowGrade(true);
// // //     }
// // //   };

// // //   const handleRetakeQuiz = () => {
// // //     setCorrectAnswers(0);
// // //     setSelectedAnswer('');
// // //     setCurrentIndex(0);
// // //     setCurrentQuiz(data.questionsAndAnswers[0]);
// // //     setShowGrade(false);
// // //     setQuizResults([]);
// // //   };

// // //   const Sidebar = () => {
// // //     return (
// // //       <div className="w-64 bg-white shadow-lg p-4 max-h-screen min-h-screen border-slate-300 border-[1px] rounded-lg">
// // //         <div className="flex items-center mb-6">
// // //           <div>
// // //             <div className="text-lg font-semibold">{data?.subject}</div>
// // //             <div className="text-sm text-gray-500">{data?.category}</div>
// // //           </div>
// // //         </div>

// // //         <div className="space-y-2">
// // //           {data?.questionsAndAnswers.map((i, index) => (
// // //             <div
// // //               onClick={() => {
// // //                 setCurrentQuiz(i);
// // //                 setCurrentIndex(index);
// // //               }}
// // //               key={index}
// // //               className={`p-4 rounded-lg cursor-pointer ${index === currentIndex ? 'bg-purple-200' : 'bg-green-200'}`}
// // //             >
// // //               <div className="font-semibold">Quiz {index + 1}</div>
// // //               <div className="text-sm text-gray-700">{`${data?.topic}`}</div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //         <Timer />
// // //       </div>
// // //     );
// // //   };

// // //   const QuizContent = () => {
// // //     return (
// // //       <div className='border-slate-300 border-[1px] rounded-lg p-6'>
// // //         <div className="mb-4 text-sm text-purple-700">Lesson 1 of 2</div>
// // //         <div className="text-2xl font-semibold mb-2">Question: {currentQuiz?.question}</div>

// // //         <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
// // //           <div className="space-y-2">
// // //             <div
// // //               className={`w-full p-4 rounded-lg ${selectedAnswer === 'a' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
// // //               onClick={() => handleAnswerSelect('a')}
// // //             >
// // //               <input
// // //                 type="checkbox"
// // //                 checked={selectedAnswer === 'a'}
// // //                 onChange={() => handleAnswerSelect('a')}
// // //                 className="checkbox checkbox-lg"
// // //               />
// // //               <div>Option A: {currentQuiz?.optionA}</div>
// // //             </div>

// // //             <div
// // //               className={`w-full p-4 rounded-lg ${selectedAnswer === 'b' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
// // //               onClick={() => handleAnswerSelect('b')}
// // //             >
// // //               <input
// // //                 type="checkbox"
// // //                 checked={selectedAnswer === 'b'}
// // //                 onChange={() => handleAnswerSelect('b')}
// // //                 className="checkbox checkbox-lg"
// // //               />
// // //               <div>Option B: {currentQuiz?.optionB}</div>
// // //             </div>

// // //             <div
// // //               className={`w-full p-4 rounded-lg ${selectedAnswer === 'c' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
// // //               onClick={() => handleAnswerSelect('c')}
// // //             >
// // //               <input
// // //                 type="checkbox"
// // //                 checked={selectedAnswer === 'c'}
// // //                 onChange={() => handleAnswerSelect('c')}
// // //                 className="checkbox checkbox-lg"
// // //               />
// // //               <div>Option C: {currentQuiz?.optionC}</div>
// // //             </div>

// // //             <div
// // //               className={`w-full p-4 rounded-lg ${selectedAnswer === 'd' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
// // //               onClick={() => handleAnswerSelect('d')}
// // //             >
// // //               <input
// // //                 type="checkbox"
// // //                 checked={selectedAnswer === 'd'}
// // //                 onChange={() => handleAnswerSelect('d')}
// // //                 className="checkbox checkbox-lg"
// // //               />
// // //               <div>Option D: {currentQuiz?.optionD}</div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //         <div className="flex justify-between">
// // //           <button className="btn btn-secondary" onClick={() => setShowGrade(true)}>Finish quiz</button>
// // //           <button className="btn btn-primary" onClick={handleNextQuestion}>Next question</button>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   const Timer = () => {
// // //     return (
// // //       <div className="bg-black text-white rounded-lg p-4 w-full mt-10">
// // //         <div className="text-sm font-semibold justify-start text-slate-300">Timer</div>
// // //         <div className="text-2xl font-bold text-slate-300">00:59:32</div>
// // //       </div>
// // //     );
// // //   };

// // //   const Grade = () => {
// // //     const scorePercentage = (correctAnswers / data?.questionsAndAnswers.length) * 100;
// // //     console.log("Quiz Results: ", quizResults); // Log the quiz results
    
// // //     // Create the new object with only the failed results
// // //     const failedResults = quizResults.filter(result => !result.isCorrect).map(result => ({
// // //       question: result.question,
// // //       student_answer: result.wrongOption,
// // //       correct_answer: result.correctOption
// // //     }));

// // //     const newObject = {
// // //       questions: failedResults,
// // //       student_info: {
// // //         age: userInfo?.age,
// // //         learning_objectives: `${data?.category}: ${scorePercentage}`,
// // //         disability: userInfo?.neurodiversity
// // //       },
// // //       student_name: userInfo?.fullName
// // //     };

// // //     console.log("New Object: ", newObject); // Log the new object

// // //     const handleAnalyzeResult = async ()=>{
// // //      const response = await analyzeResult(newObject)
// // //      console.log("Response: ", response);
// // //      setAnalyzedData(response.data)
// // //     }

// // //     return (
// // //       <div className="text-2xl text-white">
// // //         <div className='card card-body border-[1px] border-slate-300 rounded-md '>
// // //           <div className='text-[18px] text-slate-800'>You got {correctAnswers} out of {data?.questionsAndAnswers.length} correct.</div>
// // //           <div className='w-full flex items-center gap-4'>
// // //             <div className='text-slate-800 text-[16px]'>Score: </div>
// // //             <progress className="progress progress-primary text-slate-800" value={scorePercentage} max="100"></progress>
// // //             <div className='text-slate-800 text-[16px]'>
// // //               {scorePercentage}%
// // //             </div>
// // //           </div>
// // //           {scorePercentage < 50 && (
// // //             <div>
// // //               <p className="text-red-600 text-[16px] ">You scored less than 50%. Do you want to retake the quiz.</p>
// // //               <button className="btn  mt-4" onClick={handleRetakeQuiz}>Retake Quiz</button>
// // //               <button className="btn  mt-4 ml-4" onClick={handleAnalyzeResult}>Analyze Result</button>
// // //             </div>
// // //           )}
// // //         </div>
// // //         <div className='mt-4 text-slate-800'>Recommendation</div>
// // //         <div className='px-2 border-slate-300 border-[1px] mt-2 rounded-md text-slate-800 text-[16px] '>
// // //           {/* Additional recommendations or content can go here */}
// // //           {
// // //             analyzedData?.map((i, index)=>{
// // //               return(
// // //                 <div key={index} className="px-4">
// // //                   <div className='text-[18px] font-bold mt-4'>{i?.question}</div>
// // //                   <div className='text-[16px] mt-2'>{i?.analysis}</div>
// // //                   </div>
// // //               )
// // //             })
// // //           }
// // //         </div>
// // //         <div className="mt-8 text-black">
// // //           <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
// // //           {quizResults.map((result, index) => (
// // //             <div key={index} className={`p-4 mb-4 rounded-lg ${result.isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
// // //               <div className="font-semibold text-[18px]">Question: {result.question}</div>
// // //               <div className="text-sm">Your answer: {result.selectedAnswer.toUpperCase()}</div>
// // //               <div className="text-sm">Correct answer: {result.correctAnswer.toUpperCase()}</div>
// // //               <div className="text-sm">Correct option: {result.correctOption}</div>
// // //               <div className="text-sm font-bold">{result.isCorrect ? 'Correct' : 'Wrong'}</div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   return (
// // //     <div className="flex min-h-screen bg-white p-4">
// // //       <Sidebar />
// // //       <div className="px-4 min-h-screen">
// // //         {showGrade ? 
// // //           <div className='flex'>
// // //             <Grade />
// // //           </div>
// // //         : 
// // //           <div>
// // //             <QuizContent />
// // //           </div>
// // //         }
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Index;





// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import { useSelector } from 'react-redux';
// // import { useAnalyzeResultMutation } from '../../features/api/apiSlice';

// // const Index = (props) => {
// //   const [currentQuiz, setCurrentQuiz] = useState(null);
// //   const [correctAnswers, setCorrectAnswers] = useState(0);
// //   const [selectedAnswer, setSelectedAnswer] = useState('');
// //   const [currentIndex, setCurrentIndex] = useState(0);
// //   const [showGrade, setShowGrade] = useState(false);
// //   const [quizResults, setQuizResults] = useState([]);
// //   const [correctOption, setCorrectOption] = useState('');
// //   const userInfo = useSelector((state) => state.user.userInfo);
// //   const [analyzedData, setAnalyzedData] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(0);
// //   const itemsPerPage = 5; // Number of items to display per page
// //   const [analyzeResult, { isLoading, isSuccess, isError, error }] = useAnalyzeResultMutation();

// //   const data = props?.data.data;

// //   console.log(data);

// //   useEffect(() => {
// //     if (data?.questionsAndAnswers.length > 0) {
// //       setCurrentQuiz(data.questionsAndAnswers[0]);
// //     }
// //   }, [data]);

// //   const handleAnswerSelect = (answer) => {
// //     setSelectedAnswer(answer);
// //   };

// //   const handleNextQuestion = () => {
// //     const isCorrect = selectedAnswer.toLowerCase() === currentQuiz?.answer.toLowerCase();
    
// //     const correctOptionValue = 
// //       currentQuiz?.answer.toLowerCase() === 'a' ? currentQuiz?.optionA :
// //       currentQuiz?.answer.toLowerCase() === 'b' ? currentQuiz?.optionB :
// //       currentQuiz?.answer.toLowerCase() === 'c' ? currentQuiz?.optionC :
// //       currentQuiz?.answer.toLowerCase() === 'd' ? currentQuiz?.optionD : '';

// //     const wrongOptionValue = 
// //       selectedAnswer.toLowerCase() === 'a' ? currentQuiz?.optionA :
// //       selectedAnswer.toLowerCase() === 'b' ? currentQuiz?.optionB :
// //       selectedAnswer.toLowerCase() === 'c' ? currentQuiz?.optionC :
// //       selectedAnswer.toLowerCase() === 'd' ? currentQuiz?.optionD : '';

// //     const result = {
// //       question: currentQuiz?.question,
// //       selectedAnswer: selectedAnswer,
// //       correctAnswer: currentQuiz?.answer,
// //       correctOption: correctOptionValue,
// //       isCorrect: isCorrect,
// //       wrongOption: wrongOptionValue,
// //     };

// //     setQuizResults([...quizResults, result]);

// //     if (isCorrect) {
// //       setCorrectAnswers(correctAnswers + 1);
// //     }
// //     setSelectedAnswer('');
// //     if (currentIndex < data.questionsAndAnswers.length - 1) {
// //       setCurrentIndex(currentIndex + 1);
// //       setCurrentQuiz(data.questionsAndAnswers[currentIndex + 1]);
// //     } else {
// //       setShowGrade(true);
// //     }
// //   };

// //   const handleRetakeQuiz = () => {
// //     setCorrectAnswers(0);
// //     setSelectedAnswer('');
// //     setCurrentIndex(0);
// //     setCurrentQuiz(data.questionsAndAnswers[0]);
// //     setShowGrade(false);
// //     setQuizResults([]);
// //   };

 

// //   const speak = (text) => {
// //     const utterance = new SpeechSynthesisUtterance(text);
// //     window.speechSynthesis.speak(utterance);
// //   };

// //   const Sidebar = () => {
// //     return (
// //       <div className="w-64 bg-white shadow-lg p-4 max-h-screen min-h-screen border-slate-300 border-[1px] rounded-lg">
// //         <div className="flex items-center mb-6">
// //           <div>
// //             <div className="text-lg font-semibold">{data?.subject}</div>
// //             <div className="text-sm text-gray-500">{data?.category}</div>
// //           </div>
// //         </div>

// //         <div className="space-y-2">
// //           {data?.questionsAndAnswers.map((i, index) => (
// //             <div
// //               onClick={() => {
// //                 setCurrentQuiz(i);
// //                 setCurrentIndex(index);
// //               }}
// //               key={index}
// //               className={`p-4 rounded-lg cursor-pointer ${index === currentIndex ? 'bg-purple-200' : 'bg-green-200'}`}
// //             >
// //               <div className="font-semibold">Quiz {index + 1}</div>
// //               <div className="text-sm text-gray-700">{`${data?.topic}`}</div>
// //             </div>
// //           ))}
// //         </div>
// //         <Timer />
// //       </div>
// //     );
// //   };

// //   const QuizContent = () => {
// //     return (
// //       <div className='border-slate-300 border-[1px] rounded-lg p-6'>
// //         <div className="mb-4 text-sm text-purple-700">Lesson 1 of 2</div>
// //         <div className="text-2xl font-semibold mb-2">Question: {currentQuiz?.question}</div>

// //         <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
// //           <div className="space-y-2">
// //             <div
// //               className={`w-full p-4 rounded-lg ${selectedAnswer === 'a' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
// //               onClick={() => handleAnswerSelect('a')}
// //             >
// //               <input
// //                 type="checkbox"
// //                 checked={selectedAnswer === 'a'}
// //                 onChange={() => handleAnswerSelect('a')}
// //                 className="checkbox checkbox-lg"
// //               />
// //               <div>Option A: {currentQuiz?.optionA}</div>
// //             </div>

// //             <div
// //               className={`w-full p-4 rounded-lg ${selectedAnswer === 'b' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
// //               onClick={() => handleAnswerSelect('b')}
// //             >
// //               <input
// //                 type="checkbox"
// //                 checked={selectedAnswer === 'b'}
// //                 onChange={() => handleAnswerSelect('b')}
// //                 className="checkbox checkbox-lg"
// //               />
// //               <div>Option B: {currentQuiz?.optionB}</div>
// //             </div>

// //             <div
// //               className={`w-full p-4 rounded-lg ${selectedAnswer === 'c' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
// //               onClick={() => handleAnswerSelect('c')}
// //             >
// //               <input
// //                 type="checkbox"
// //                 checked={selectedAnswer === 'c'}
// //                 onChange={() => handleAnswerSelect('c')}
// //                 className="checkbox checkbox-lg"
// //               />
// //               <div>Option C: {currentQuiz?.optionC}</div>
// //             </div>

// //             <div
// //               className={`w-full p-4 rounded-lg ${selectedAnswer === 'd' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
// //               onClick={() => handleAnswerSelect('d')}
// //             >
// //               <input
// //                 type="checkbox"
// //                 checked={selectedAnswer === 'd'}
// //                 onChange={() => handleAnswerSelect('d')}
// //                 className="checkbox checkbox-lg"
// //               />
// //               <div>Option D: {currentQuiz?.optionD}</div>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="flex justify-between">
// //           <button className="btn btn-secondary" onClick={() => setShowGrade(true)}>Finish quiz</button>
// //           <button className="btn btn-primary" onClick={handleNextQuestion}>Next question</button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const Timer = () => {
// //     return (
// //       <div className="bg-black text-white rounded-lg p-4 w-full mt-10">
// //         <div className="text-sm font-semibold justify-start text-slate-300">Timer</div>
// //         <div className="text-2xl font-bold text-slate-300">00:59:32</div>
// //       </div>
// //     );
// //   };

// //   const Grade = () => {
// //     const scorePercentage = (correctAnswers / data?.questionsAndAnswers.length) * 100;
// //     const totalPages = Math.ceil(analyzedData.length / itemsPerPage);

// //     const handleNextPage = () => {
// //       if (currentPage < totalPages - 1) {
// //         setCurrentPage(currentPage + 1);
// //       }
// //     };

// //     const handlePrevPage = () => {
// //       if (currentPage > 0) {
// //         setCurrentPage(currentPage - 1);
// //       }
// //     };


// //     const handleAnalyzeResult = async () => {
// //       const failedResults = quizResults.filter(result => !result.isCorrect).map(result => ({
// //         question: result.question,
// //         student_answer: result.wrongOption,
// //         correct_answer: result.correctOption
// //       }));
  
// //       const newObject = {
// //         questions: failedResults,
// //         student_info: {
// //           age: userInfo?.age,
// //           learning_objectives: `${data?.category}: ${scorePercentage}`,
// //           disability: userInfo?.neurodiversity
// //         },
// //         student_name: userInfo?.fullName
// //       };
  
// //       const response = await analyzeResult(newObject);
// //       setAnalyzedData(response.data);
// //     };

// //     return (
// //       <div className="text-2xl text-white">
// //         <div className='card card-body border-[1px] border-slate-300 rounded-md '>
// //           <div className='text-[18px] text-slate-800'>You got {correctAnswers} out of {data?.questionsAndAnswers.length} correct.</div>
// //           <div className='w-full flex items-center gap-4'>
// //             <div className='text-slate-800 text-[16px]'>Score: </div>
// //             <progress className="progress progress-primary text-slate-800" value={scorePercentage} max="100"></progress>
// //             <div className='text-slate-800 text-[16px]'>
// //               {scorePercentage}%
// //             </div>
// //           </div>
// //           {scorePercentage < 50 && (
// //             <div>
// //               <p className="text-red-600 text-[16px] ">You scored less than 50%. Do you want to retake the quiz.</p>
// //               <button className="btn  mt-4" onClick={handleRetakeQuiz}>Retake Quiz</button>
// //               <button className="btn  mt-4 ml-4" onClick={handleAnalyzeResult}>Analyze Result</button>
// //             </div>
// //           )}
// //         </div>
// //         <div className='mt-4 text-slate-800'>Recommendation</div>
// //         <div className='px-2 border-slate-300 border-[1px] mt-2 rounded-md text-slate-800 text-[16px] '>
// //           {analyzedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((i, index) => (
// //             <div key={index} className="px-4">
// //               <div className='text-[18px] font-bold mt-4'>{i?.question}</div>
// //               <div className='text-[16px] mt-2'>{i?.analysis}</div>
// //               <button onClick={() => speak(i?.analysis)} className="btn btn-primary mt-2">Play</button>
// //             </div>
// //           ))}
// //           <div className="flex justify-between mt-4">
// //             <button onClick={handlePrevPage} disabled={currentPage === 0} className="btn btn-secondary">Previous</button>
// //             <button onClick={handleNextPage} disabled={currentPage === totalPages - 1} className="btn btn-secondary">Next</button>
// //           </div>
// //         </div>
// //         <div className="mt-8 text-black">
// //           <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
// //           {quizResults.map((result, index) => (
// //             <div key={index} className={`p-4 mb-4 rounded-lg ${result.isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
// //               <div className="font-semibold text-[18px]">Question: {result.question}</div>
// //               <div className="text-sm">Your answer: {result.selectedAnswer.toUpperCase()}</div>
// //               <div className="text-sm">Correct answer: {result.correctAnswer.toUpperCase()}</div>
// //               <div className="text-sm">Correct option: {result.correctOption}</div>
// //               <div className="text-sm font-bold">{result.isCorrect ? 'Correct' : 'Wrong'}</div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="flex min-h-screen bg-white p-4">
// //       <Sidebar />
// //       <div className="px-4 min-h-screen">
// //         {showGrade ? 
// //           <div className='flex'>
// //             <Grade />
// //           </div>
// //         : 
// //           <div>
// //             <QuizContent />
// //           </div>
// //         }
// //       </div>
// //     </div>
// //   );
// // };

// // export default Index;




// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { useAnalyzeResultMutation } from '../../features/api/apiSlice';

// const Index = (props) => {
//   const [currentQuiz, setCurrentQuiz] = useState(null);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [showGrade, setShowGrade] = useState(false);
//   const [quizResults, setQuizResults] = useState([]);
//   const [correctOption, setCorrectOption] = useState('');
//   const userInfo = useSelector((state) => state.user.userInfo);
//   const [analyzedData, setAnalyzedData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 5; // Number of items to display per page
//   const [analyzeResult, { isLoading, isSuccess, isError, error }] = useAnalyzeResultMutation();
//   const [currentWordIndex, setCurrentWordIndex] = useState(-1); // Track the current word index
//   const [speakingText, setSpeakingText] = useState(''); // Track the text being spoken
//   const utteranceRef = useRef(null); // Ref to hold the SpeechSynthesisUtterance

//   const data = props?.data.data;

//   console.log(data);

//   useEffect(() => {
//     if (data?.questionsAndAnswers.length > 0) {
//       setCurrentQuiz(data.questionsAndAnswers[0]);
//     }
//   }, [data]);

//   const handleAnswerSelect = (answer) => {
//     setSelectedAnswer(answer);
//   };

//   const handleNextQuestion = () => {
//     const isCorrect = selectedAnswer.toLowerCase() === currentQuiz?.answer.toLowerCase();
    
//     const correctOptionValue = 
//       currentQuiz?.answer.toLowerCase() === 'a' ? currentQuiz?.optionA :
//       currentQuiz?.answer.toLowerCase() === 'b' ? currentQuiz?.optionB :
//       currentQuiz?.answer.toLowerCase() === 'c' ? currentQuiz?.optionC :
//       currentQuiz?.answer.toLowerCase() === 'd' ? currentQuiz?.optionD : '';

//     const wrongOptionValue = 
//       selectedAnswer.toLowerCase() === 'a' ? currentQuiz?.optionA :
//       selectedAnswer.toLowerCase() === 'b' ? currentQuiz?.optionB :
//       selectedAnswer.toLowerCase() === 'c' ? currentQuiz?.optionC :
//       selectedAnswer.toLowerCase() === 'd' ? currentQuiz?.optionD : '';

//     const result = {
//       question: currentQuiz?.question,
//       selectedAnswer: selectedAnswer,
//       correctAnswer: currentQuiz?.answer,
//       correctOption: correctOptionValue,
//       isCorrect: isCorrect,
//       wrongOption: wrongOptionValue,
//     };

//     setQuizResults([...quizResults, result]);

//     if (isCorrect) {
//       setCorrectAnswers(correctAnswers + 1);
//     }
//     setSelectedAnswer('');
//     if (currentIndex < data.questionsAndAnswers.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//       setCurrentQuiz(data.questionsAndAnswers[currentIndex + 1]);
//     } else {
//       setShowGrade(true);
//     }
//   };

//   const handleRetakeQuiz = () => {
//     setCorrectAnswers(0);
//     setSelectedAnswer('');
//     setCurrentIndex(0);
//     setCurrentQuiz(data.questionsAndAnswers[0]);
//     setShowGrade(false);
//     setQuizResults([]);
//   };

//   const handleAnalyzeResult = async () => {
//     const failedResults = quizResults.filter(result => !result.isCorrect).map(result => ({
//       question: result.question,
//       student_answer: result.wrongOption,
//       correct_answer: result.correctOption
//     }));

//     const newObject = {
//       questions: failedResults,
//       student_info: {
//         age: userInfo?.age,
//         learning_objectives: `${data?.category}: ${scorePercentage}`,
//         disability: userInfo?.neurodiversity
//       },
//       student_name: userInfo?.fullName
//     };

//     const response = await analyzeResult(newObject);
//     setAnalyzedData(response.data);
//   };

//   const speak = (text) => {
//     const words = text.split(' '); // Split the text into words
//     let currentWord = 0; // Initialize current word index
//     setSpeakingText(text); // Set the speaking text
//     setCurrentWordIndex(0); // Reset the word index

//     const utterance = new SpeechSynthesisUtterance(text);
//     utteranceRef.current = utterance; // Set the ref to the current utterance

//     // Handle the boundary event to update the current word index
//     utterance.addEventListener('boundary', (event) => {
//       if (event.name === 'word') {
//         currentWord++;
//         setCurrentWordIndex(currentWord);
//       }
//     });

//     // Handle the end event to reset the word index
//     utterance.addEventListener('end', () => {
//       setCurrentWordIndex(-1);
//     });

//     window.speechSynthesis.speak(utterance);
//   };

//   const Sidebar = () => {
//     return (
//       <div className="w-64 bg-white shadow-lg p-4 max-h-screen min-h-screen border-slate-300 border-[1px] rounded-lg">
//         <div className="flex items-center mb-6">
//           <div>
//             <div className="text-lg font-semibold">{data?.subject}</div>
//             <div className="text-sm text-gray-500">{data?.category}</div>
//           </div>
//         </div>

//         <div className="space-y-2">
//           {data?.questionsAndAnswers.map((i, index) => (
//             <div
//               onClick={() => {
//                 setCurrentQuiz(i);
//                 setCurrentIndex(index);
//               }}
//               key={index}
//               className={`p-4 rounded-lg cursor-pointer ${index === currentIndex ? 'bg-purple-200' : 'bg-green-200'}`}
//             >
//               <div className="font-semibold">Quiz {index + 1}</div>
//               <div className="text-sm text-gray-700">{`${data?.topic}`}</div>
//             </div>
//           ))}
//         </div>
//         <Timer />
//       </div>
//     );
//   };

//   const QuizContent = () => {
//     return (
//       <div className='border-slate-300 border-[1px] rounded-lg p-6'>
//         <div className="mb-4 text-sm text-purple-700">Lesson 1 of 2</div>
//         <div className="text-2xl font-semibold mb-2">Question: {currentQuiz?.question}</div>

//         <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
//           <div className="space-y-2">
//             <div
//               className={`w-full p-4 rounded-lg ${selectedAnswer === 'a' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
//               onClick={() => handleAnswerSelect('a')}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedAnswer === 'a'}
//                 onChange={() => handleAnswerSelect('a')}
//                 className="checkbox checkbox-lg"
//               />
//               <div>Option A: {currentQuiz?.optionA}</div>
//             </div>

//             <div
//               className={`w-full p-4 rounded-lg ${selectedAnswer === 'b' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
//               onClick={() => handleAnswerSelect('b')}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedAnswer === 'b'}
//                 onChange={() => handleAnswerSelect('b')}
//                 className="checkbox checkbox-lg"
//               />
//               <div>Option B: {currentQuiz?.optionB}</div>
//             </div>

//             <div
//               className={`w-full p-4 rounded-lg ${selectedAnswer === 'c' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
//               onClick={() => handleAnswerSelect('c')}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedAnswer === 'c'}
//                 onChange={() => handleAnswerSelect('c')}
//                 className="checkbox checkbox-lg"
//               />
//               <div>Option C: {currentQuiz?.optionC}</div>
//             </div>

//             <div
//               className={`w-full p-4 rounded-lg ${selectedAnswer === 'd' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
//               onClick={() => handleAnswerSelect('d')}
//             >
//               <input
//                 type="checkbox"
//                 checked={selectedAnswer === 'd'}
//                 onChange={() => handleAnswerSelect('d')}
//                 className="checkbox checkbox-lg"
//               />
//               <div>Option D: {currentQuiz?.optionD}</div>
//             </div>
//           </div>
//         </div>
//         <div className="flex justify-between">
//           <button className="btn btn-secondary" onClick={() => setShowGrade(true)}>Finish quiz</button>
//           <button className="btn btn-primary" onClick={handleNextQuestion}>Next question</button>
//         </div>
//       </div>
//     );
//   };

//   const Timer = () => {
//     return (
//       <div className="bg-black text-white rounded-lg p-4 w-full mt-10">
//         <div className="text-sm font-semibold justify-start text-slate-300">Timer</div>
//         <div className="text-2xl font-bold text-slate-300">00:59:32</div>
//       </div>
//     );
//   };

//   const Grade = () => {
//     const scorePercentage = (correctAnswers / data?.questionsAndAnswers.length) * 100;
//     console.log("Quiz Results: ", quizResults); 
    
//     const handleNextPage = () => {
//       if (currentPage < Math.ceil(analyzedData.length / itemsPerPage) - 1) {
//         setCurrentPage(currentPage + 1);
//       }
//     };

//     const handlePrevPage = () => {
//       if (currentPage > 0) {
//         setCurrentPage(currentPage - 1);
//       }
//     };



//     const handleAnalyzeResult = async () => {
//       const failedResults = quizResults.filter(result => !result.isCorrect).map(result => ({
//         question: result.question,
//         student_answer: result.wrongOption,
//         correct_answer: result.correctOption
//       }));
  
//       const newObject = {
//         questions: failedResults,
//         student_info: {
//           age: userInfo?.age,
//           learning_objectives: `${data?.category}: ${scorePercentage}`,
//           disability: userInfo?.neurodiversity
//         },
//         student_name: userInfo?.fullName
//       };
  
//       const response = await analyzeResult(newObject);
//       setAnalyzedData(response.data);
//     };

//     return (
//       <div className="text-2xl text-white">
//         <div className='card card-body border-[1px] border-slate-300 rounded-md '>
//           <div className='text-[18px] text-slate-800'>You got {correctAnswers} out of {data?.questionsAndAnswers.length} correct.</div>
//           <div className='w-full flex items-center gap-4'>
//             <div className='text-slate-800 text-[16px]'>Score: </div>
//             <progress className="progress progress-primary text-slate-800" value={scorePercentage} max="100"></progress>
//             <div className='text-slate-800 text-[16px]'>
//               {scorePercentage}%
//             </div>
//           </div>
//           {scorePercentage < 50 && (
//             <div>
//               <p className="text-red-600 text-[16px] ">You scored less than 50%. Do you want to retake the quiz.</p>
//               <button className="btn  mt-4" onClick={handleRetakeQuiz}>Retake Quiz</button>
//               <button className="btn  mt-4 ml-4" onClick={handleAnalyzeResult}>Analyze Result</button>
//             </div>
//           )}
//         </div>
//         <div className='mt-4 text-slate-800'>Recommendation</div>
//         <div className='px-2 border-slate-300 border-[1px] mt-2 rounded-md text-slate-800 text-[16px] '>
//           {analyzedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((i, index) => (
//             <div key={index} className="px-4">
//               <div className='text-[18px] font-bold mt-4'>{i?.question}</div>
//               <div className='text-[16px] mt-2'>
//                 {i?.analysis.split(' ').map((word, idx) => (
//                   <span key={idx} className={idx === currentWordIndex ? 'bg-yellow-300' : ''}>{word} </span>
//                 ))}
//               </div>
//               <button onClick={() => speak(i?.analysis)} className="btn btn-primary mt-2">Play</button>
//             </div>
//           ))}
//           <div className="flex justify-between mt-4">
//             <button onClick={handlePrevPage} disabled={currentPage === 0} className="btn btn-secondary">Previous</button>
//             <button onClick={handleNextPage} disabled={currentPage === Math.ceil(analyzedData.length / itemsPerPage) - 1} className="btn btn-secondary">Next</button>
//           </div>
//         </div>
//         <div className="mt-8 text-black">
//           <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
//           {quizResults.map((result, index) => (
//             <div key={index} className={`p-4 mb-4 rounded-lg ${result.isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
//               <div className="font-semibold text-[18px]">Question: {result.question}</div>
//               <div className="text-sm">Your answer: {result.selectedAnswer.toUpperCase()}</div>
//               <div className="text-sm">Correct answer: {result.correctAnswer.toUpperCase()}</div>
//               <div className="text-sm">Correct option: {result.correctOption}</div>
//               <div className="text-sm font-bold">{result.isCorrect ? 'Correct' : 'Wrong'}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex min-h-screen bg-white p-4">
//       <Sidebar />
//       <div className="px-4 min-h-screen">
//         {showGrade ? 
//           <div className='flex'>
//             <Grade />
//           </div>
//         : 
//           <div>
//             <QuizContent />
//           </div>
//         }
//       </div>
//     </div>
//   );
// };

// export default Index;

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAnalyzeResultMutation } from '../../features/api/apiSlice';

const Index = (props) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrade, setShowGrade] = useState(false);
  const [quizResults, setQuizResults] = useState([]);
  const [correctOption, setCorrectOption] = useState('');
  const userInfo = useSelector((state) => state.user.userInfo);
  const [analyzedData, setAnalyzedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1; // Show one item per page
  const [analyzeResult, { isLoading, isSuccess, isError, error }] = useAnalyzeResultMutation();
  const [currentWordIndex, setCurrentWordIndex] = useState(-1); // Track the current word index
  const [speakingText, setSpeakingText] = useState(''); // Track the text being spoken
  const utteranceRef = useRef(null); // Ref to hold the SpeechSynthesisUtterance

  const data = props?.data.data;

  console.log(data);

  useEffect(() => {
    if (data?.questionsAndAnswers.length > 0) {
      setCurrentQuiz(data.questionsAndAnswers[0]);
    }
  }, [data]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer.toLowerCase() === currentQuiz?.answer.toLowerCase();
    
    const correctOptionValue = 
      currentQuiz?.answer.toLowerCase() === 'a' ? currentQuiz?.optionA :
      currentQuiz?.answer.toLowerCase() === 'b' ? currentQuiz?.optionB :
      currentQuiz?.answer.toLowerCase() === 'c' ? currentQuiz?.optionC :
      currentQuiz?.answer.toLowerCase() === 'd' ? currentQuiz?.optionD : '';

    const wrongOptionValue = 
      selectedAnswer.toLowerCase() === 'a' ? currentQuiz?.optionA :
      selectedAnswer.toLowerCase() === 'b' ? currentQuiz?.optionB :
      selectedAnswer.toLowerCase() === 'c' ? currentQuiz?.optionC :
      selectedAnswer.toLowerCase() === 'd' ? currentQuiz?.optionD : '';

    const result = {
      question: currentQuiz?.question,
      selectedAnswer: selectedAnswer,
      correctAnswer: currentQuiz?.answer,
      correctOption: correctOptionValue,
      isCorrect: isCorrect,
      wrongOption: wrongOptionValue,
    };

    setQuizResults([...quizResults, result]);

    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    setSelectedAnswer('');
    if (currentIndex < data.questionsAndAnswers.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuiz(data.questionsAndAnswers[currentIndex + 1]);
    } else {
      setShowGrade(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCorrectAnswers(0);
    setSelectedAnswer('');
    setCurrentIndex(0);
    setCurrentQuiz(data.questionsAndAnswers[0]);
    setShowGrade(false);
    setQuizResults([]);
  };


  const speak = (text) => {
    // Stop any ongoing speech
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    const words = text.split(' '); // Split the text into words
    let currentWord = 0; // Initialize current word index
    setSpeakingText(text); // Set the speaking text
    setCurrentWordIndex(0); // Reset the word index

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance; // Set the ref to the current utterance

    // Handle the boundary event to update the current word index
    utterance.addEventListener('boundary', (event) => {
      if (event.name === 'word') {
        currentWord++;
        setCurrentWordIndex(currentWord);
      }
    });

    // Handle the end event to reset the word index
    utterance.addEventListener('end', () => {
      setCurrentWordIndex(-1);
    });

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      setCurrentWordIndex(-1);
    }
  };

  const Sidebar = () => {
    return (
      <div className="w-64 bg-white shadow-lg p-4 max-h-screen min-h-screen border-slate-300 border-[1px] rounded-lg">
        <div className="flex items-center mb-6">
          <div>
            <div className="text-lg font-semibold">{data?.subject}</div>
            <div className="text-sm text-gray-500">{data?.category}</div>
          </div>
        </div>

        <div className="space-y-2">
          {data?.questionsAndAnswers.map((i, index) => (
            <div
              onClick={() => {
                setCurrentQuiz(i);
                setCurrentIndex(index);
              }}
              key={index}
              className={`p-4 rounded-lg cursor-pointer ${index === currentIndex ? 'bg-purple-200' : 'bg-green-200'}`}
            >
              <div className="font-semibold">Quiz {index + 1}</div>
              <div className="text-sm text-gray-700">{`${data?.topic}`}</div>
            </div>
          ))}
        </div>
        <Timer />
      </div>
    );
  };

  const QuizContent = () => {
    return (
      <div className='border-slate-300 border-[1px] rounded-lg p-6'>
        <div className="mb-4 text-sm text-purple-700">Lesson 1 of 2</div>
        <div className="text-2xl font-semibold mb-2">Question: {currentQuiz?.question}</div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
          <div className="space-y-2">
            <div
              className={`w-full p-4 rounded-lg ${selectedAnswer === 'a' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect('a')}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === 'a'}
                onChange={() => handleAnswerSelect('a')}
                className="checkbox checkbox-lg"
              />
              <div>Option A: {currentQuiz?.optionA}</div>
            </div>

            <div
              className={`w-full p-4 rounded-lg ${selectedAnswer === 'b' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect('b')}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === 'b'}
                onChange={() => handleAnswerSelect('b')}
                className="checkbox checkbox-lg"
              />
              <div>Option B: {currentQuiz?.optionB}</div>
            </div>

            <div
              className={`w-full p-4 rounded-lg ${selectedAnswer === 'c' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect('c')}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === 'c'}
                onChange={() => handleAnswerSelect('c')}
                className="checkbox checkbox-lg"
              />
              <div>Option C: {currentQuiz?.optionC}</div>
            </div>

            <div
              className={`w-full p-4 rounded-lg ${selectedAnswer === 'd' ? 'bg-purple-300' : 'bg-purple-200'} text-start items-center flex gap-3 cursor-pointer`}
              onClick={() => handleAnswerSelect('d')}
            >
              <input
                type="checkbox"
                checked={selectedAnswer === 'd'}
                onChange={() => handleAnswerSelect('d')}
                className="checkbox checkbox-lg"
              />
              <div>Option D: {currentQuiz?.optionD}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <button className="btn btn-secondary" onClick={() => setShowGrade(true)}>Finish quiz</button>
          <button className="btn btn-primary" onClick={handleNextQuestion}>Next question</button>
        </div>
      </div>
    );
  };

  const Timer = () => {
    return (
      <div className="bg-black text-white rounded-lg p-4 w-full mt-10">
        <div className="text-sm font-semibold justify-start text-slate-300">Timer</div>
        <div className="text-2xl font-bold text-slate-300">00:59:32</div>
      </div>
    );
  };

  const Grade = () => {
    const scorePercentage = (correctAnswers / data?.questionsAndAnswers.length) * 100;
    console.log("Quiz Results: ", quizResults); 
    
    const handleNextPage = () => {
      if (currentPage < Math.ceil(analyzedData.length / itemsPerPage) - 1) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePrevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };

    const handleAnalyzeResult = async () => {
      const failedResults = quizResults.filter(result => !result.isCorrect).map(result => ({
        question: result.question,
        student_answer: result.wrongOption,
        correct_answer: result.correctOption
      }));
  
      const scorePercentage = (correctAnswers / data?.questionsAndAnswers.length) * 100;
  
      const newObject = {
        questions: failedResults,
        student_info: {
          age: userInfo?.age,
          learning_objectives: `${data?.category}: ${scorePercentage}`,
          disability: userInfo?.neurodiversity
        },
        student_name: userInfo?.fullName
      };
  
      const response = await analyzeResult(newObject);
      setAnalyzedData(response.data);
    };
  

    return (
      <div className="text-2xl text-white">
        <div className='card card-body border-[1px] border-slate-300 rounded-md '>
          <div className='text-[18px] text-slate-800'>You got {correctAnswers} out of {data?.questionsAndAnswers.length} correct.</div>
          <div className='w-full flex items-center gap-4'>
            <div className='text-slate-800 text-[16px]'>Score: </div>
            <progress className="progress progress-primary text-slate-800" value={scorePercentage} max="100"></progress>
            <div className='text-slate-800 text-[16px]'>
              {scorePercentage}%
            </div>
          </div>
          {scorePercentage < 80 && (
            <div>
              <p className="text-red-600 text-[16px] ">You scored less than 50%. Do you want to retake the quiz.</p>
              <button className="btn  mt-4" onClick={handleRetakeQuiz}>Retake Quiz</button>
              <button className="btn  mt-4 ml-4" onClick={handleAnalyzeResult}>
                {
                  isLoading ? "Analyzing your mistakes ..." : "Analyze Mistake(s)"
                }
               
                </button>
            </div>
          )}
        </div>
        <div className='mt-4 text-slate-800'>Recommendation</div>
        <div className='px-2 border-slate-300 border-[1px] mt-2 rounded-md text-slate-800 text-[16px] '>
          {analyzedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((i, index) => (
            <div key={index} className="px-4">
              <div className='text-[18px] font-bold mt-4'>{i?.question}</div>
              <div className='text-[16px] mt-2'>
                {i?.analysis.split(' ').map((word, idx) => (
                  <span key={idx} className={idx === currentWordIndex ? 'bg-yellow-300' : ''}>{word} </span>
                ))}
              </div>
              <button onClick={() => speak(i?.analysis)} className="btn btn-primary mt-2">Play</button>
              <button onClick={stopSpeech} className="btn btn-secondary mt-2 ml-2">Stop</button>
            </div>
          ))}
         {
          analyzedData.length &&  <div className="flex justify-between mt-4">
          <button onClick={handlePrevPage} disabled={currentPage === 0} className="btn btn-secondary">Previous</button>
          <button onClick={handleNextPage} disabled={currentPage === Math.ceil(analyzedData.length / itemsPerPage) - 1} className="btn btn-secondary">Next</button>
        </div>
         }
        </div>
        <div className="mt-8 text-black">
          <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
          {quizResults.map((result, index) => (
            <div key={index} className={`p-4 mb-4 rounded-lg ${result.isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
              <div className="font-semibold text-[18px]">Question: {result.question}</div>
              <div className="text-sm">Your answer: {result.selectedAnswer.toUpperCase()}</div>
              <div className="text-sm">Correct answer: {result.correctAnswer.toUpperCase()}</div>
              <div className="text-sm">Correct option: {result.correctOption}</div>
              <div className="text-sm font-bold">{result.isCorrect ? 'Correct' : 'Wrong'}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white p-4">
      <Sidebar />
      <div className="px-4 min-h-screen">
        {showGrade ? 
          <div className='flex'>
            <Grade />
          </div>
        : 
          <div>
            <QuizContent />
          </div>
        }
      </div>
    </div>
  );
};

export default Index;













