import Theory from "@/components/Quiz/Exam";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export type ExamQuestions = {
  exam_question: {
    _id: string;
    questions: {
      number: string;
      text: string;
      marks: number;
      learning_objectives: string[];
      mark_scheme: string;
    }[];
    student_id: null | string;
    class_id: string | null;
  };
};

const Exams = () => {
  const { examId } = useParams();
  const [examQuestions, setExamQuestions] = useState<ExamQuestions | "">("");

  const getExamTasks = async () => {
    try {
      const res = await fetch(
        `https://edat-microservice-v1.onrender.com/exam/get_one_exam_id?exam_id=${examId}`
      );
      const tasks = await res.json();
      console.log({ tasks });
      if (res.ok) {
        setExamQuestions(tasks);
      }
    } catch (err) {
      console.log({ err });
    }
  };

  useEffect(() => {
    getExamTasks();
  }, []);

  if (examQuestions != "") {
    return <Theory exam={examQuestions} />;
  } else {
    return <p>Loading...</p>;
  }
};

export default Exams;
