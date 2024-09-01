import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { BiSolidSend } from "react-icons/bi";
import { useChatMutation } from "../api/apiSlice";

function ChatBot({ userInfo, rec }) {
  const [chat, setChat] = useState<Record<string, string>[]>([]);
  const [question, setQuestion] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  console.log({ rec });

  const [chatBot, { data }] = useChatMutation();

  console.log({ chatRes: data });

  //   function scrollToBottom() {
  //     const scrollHeight = bottomRef.current?.scrollHeight;
  //     const clientHeight = bottomRef.current?.clientHeight;
  //     const maxScrollTop = scrollHeight + clientHeight;
  //     bottomRef.current.scrollTop = 30;
  //   }

  const isLoading = true;

  useEffect(() => {
    chatBot({
      name: userInfo.fullName,
      country: "Nigeria",
      //   learningObjective: rec.objectives[0].objective,
      aspiration: userInfo.bioData[0].age_or_grade_level,
      interests: userInfo.bioData[0].subjects_of_interest + "",
      strengths: "Problem-solving",
      learningStyle: userInfo.bioData[0].learning_style_preferences + "",
      strugglingTopic: "Quadratic equations",
      neurodiversity:
        userInfo.bioData[0].special_educational_needs_or_accommodations + "",
    });
  }, []);

  function handleQuestionSubmit() {
    if (question.length > 0) {
      const q = question;
      setQuestion("");
      setChat((prev) => [...prev, { you: q }]);

      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }

  //   useEffect(() => {
  //     if (isSuccess) {
  //       console.log({ data });
  //       setChat((prev) => [...prev, { bot: data }]);
  //     }
  //     bottomRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //     });
  //   }, [data, isLoading, isSuccess]);

  return (
    <div className="relative h-72 p-3 rounded-md bg-yellow-500 flex flex-col">
      <div className="flex flex-col gap-2 mx-3 h-64 overflow-y-auto">
        {data?.conversation?.map((e, i) => {
          return (
            <p
              className={`bg-white px-4 py-1 w-fit rounded-lg max-w-[90%] ${
                e.you && "self-end"
              }`}
              key={i}
            >
              {e.content}
            </p>
          );
        })}
        {!!isLoading && (
          <div className="bg-white px-4 py-1 w-fit rounded-lg max-w-[90%]">
            <p className="animate-bounce text-lg">...</p>
          </div>
        )}
        <div className="bg-fuchsia-700 px-4 py-1 rounded-lg max-w-[90%] h-6 opacity-0"></div>
        <div
          className="bg-fuchsia-700 px-4 py-1 rounded-lg max-w-[90%] h-6 opacity-0"
          ref={bottomRef}
        >
          <p>Ref</p>
        </div>
      </div>
      <div className="w-full h-12 bg-slate-200 flex gap-2 px-4 items-center rounded">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="h-8 !rounded-xl w-full px-2"
        />
        <button
          disabled={isLoading}
          className={`size-8 rounded-full text-white bg-[#00327f] flex items-center justify-center ${
            isLoading && "opacity-50"
          }`}
          onClick={() => {
            handleQuestionSubmit();
          }}
        >
          <BiSolidSend />
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
