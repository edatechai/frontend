

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Index = (props) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGrade, setShowGrade] = useState(false);
  const [quizResults, setQuizResults] = useState([]);

  const data = props?.data.data;

  // Set the first quiz on page load
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
    const result = {
      question: currentQuiz?.question,
      selectedAnswer: selectedAnswer,
      correctAnswer: currentQuiz?.answer,
      isCorrect: isCorrect,
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
    console.log("Quiz Results: ", quizResults); // Log the quiz results
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
        {scorePercentage < 50 && (
          <div>
            <p className="text-red-600 text-[16px] ">You scored less than 50%. Do you want to retake the quiz.</p>
            <button className="btn  mt-4" onClick={handleRetakeQuiz}>Retake Quiz</button>
          </div>
        )}
        </div>
         <div className='mt-4 text-slate-800'>Recommendation</div>
        <div className='px-2 border-slate-300 border-[1px] mt-2 rounded-md text-slate-800 text-[16px] '>
       
            </div>


        <div className="mt-8 text-black">
          <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
          {quizResults.map((result, index) => (
            <div key={index} className={`p-4 mb-4 rounded-lg ${result.isCorrect ? 'bg-green-200' : 'bg-red-200'}`}>
              <div className="font-semibold text-[18px]">Question: {result.question}</div>
              <div className="text-sm">Your answer: {result.selectedAnswer.toUpperCase()}</div>
              <div className="text-sm">Correct answer: {result.correctAnswer.toUpperCase()}</div>
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
        <div className='flex  '>
          <Grade />
          
          </div>
         : 
         <div>
          <QuizContent />
         
          </div>}
      </div>
    </div>
  );
};

export default Index;









