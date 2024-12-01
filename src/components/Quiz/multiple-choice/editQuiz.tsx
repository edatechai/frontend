import { Dispatch, SetStateAction, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUpdateQuizMutation } from "@/features/api/apiSlice";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const EditQuiz = ({
  question,
  index,
  setEdittedIndexes,
  edittedIndexes,
  
}: {
  question: {
    _id: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    answer: string;
    subject: string;
    _doc: {
      answer: string;
      _id: string;
    };
  };
  index: number;
  edittedIndexes: string[];
  setEdittedIndexes: Dispatch<SetStateAction<string[]>>;
  userInfo: any;
}) => {
  // State for each field
  const [questionContent, setQuestionContent] = useState(question.question);
  const [optionA, setOptionA] = useState(question.optionA);
  const [optionB, setOptionB] = useState(question.optionB);
  const [optionC, setOptionC] = useState(question.optionC);
  const [optionD, setOptionD] = useState(question.optionD);
  const [answer, setAnswer] = useState(question.answer);
  const [_id, setId] = useState();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();
  const userInfo = useSelector((state: any) => state.user.userInfo);

  

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "formula"], // Added formula for math equations
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Supported formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "formula",
  ];

  const handleSubmit = async () => {
    console.log("this is question", question)
   
    // setId(question._id );
    // setAnswer(question.answer);
    const stripHtml = (html: string) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };

    const payload = {
      _id: question?._doc?._id || question?._id, 
      question: stripHtml(questionContent),
      optionA: stripHtml(optionA),
      optionB: stripHtml(optionB),
      optionC: stripHtml(optionC),
      optionD: stripHtml(optionD),
      answer: stripHtml(answer),
      teacherInfo: {
        country: userInfo.country,
        username: userInfo.username,
        email: userInfo.email,
        teacherId: userInfo._id,
        fullName: userInfo.fullName,
        accountId: userInfo.accountId,
        gender: userInfo.gender,
        subject: question?.subject,
      },
      before: question
    };

    try {
      // Helper function to strip HTML tags
      
      
      console.log("payload", payload);
      
      // TODO: Implement your update logic here
      const result =  await updateQuiz(payload);
      console.log("result", result)
      // status is 200 show result.data.message
      if (result.data.status) {
        setEdittedIndexes((prev) => [...prev, question._id]);
        toast.success(result.data.message);
      } else {
        toast.error(result.data.message);
      }
    } catch (error) {
      console.error(error);
        // Add error toast
      toast.error("There was an error updating the question");
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
        <CardDescription>Edit question and options using the rich text editor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Question</label>
          <ReactQuill
            theme="snow"
            value={questionContent}
            onChange={setQuestionContent}
            modules={modules}
            formats={formats}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
        <div>
            <label className="block mb-2 font-medium">Answer</label>
            <ReactQuill
              theme="snow"
              value={answer}
              onChange={setAnswer}
              modules={modules}
              formats={formats}
            />
          </div>
          <br/>
          <div>
            <label className="block mb-2 font-medium">Option A</label>
            <ReactQuill
              theme="snow"
              value={optionA}
              onChange={setOptionA}
              modules={modules}
              formats={formats}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Option B</label>
            <ReactQuill
              theme="snow"
              value={optionB}
              onChange={setOptionB}
              modules={modules}
              formats={formats}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Option C</label>
            <ReactQuill
              theme="snow"
              value={optionC}
              onChange={setOptionC}
              modules={modules}
              formats={formats}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Option D</label>
            <ReactQuill
              theme="snow"
              value={optionD}
              onChange={setOptionD}
              modules={modules}
              formats={formats}
            />
          </div>
        </div>

        <Button onClick={handleSubmit} className="mt-4">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default EditQuiz;
