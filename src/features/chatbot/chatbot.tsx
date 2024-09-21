import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState, useEffect, useCallback, useRef } from "react";
import { BiSolidSend } from "react-icons/bi";
import { useChatMutation } from "../api/apiSlice";

interface ChatBotProps {
  userInfo: any; // Replace 'any' with the actual type of userInfo
  rec: any; // Replace 'any' with the actual type of recData
  onClose: () => void;
}

interface Message {
  role: string;
  content: string;
}

interface ConversationItem {
  type: "user" | "assistant";
  messages: Message[];
  currentIndex: number;
}

function ChatBot({ userInfo, rec, onClose }: ChatBotProps) {
  const [chat, { isLoading }] = useChatMutation();
  console.log("this is user info", userInfo, rec?.questions[0].question);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean; time: string }>
  >([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [conversationItems, setConversationItems] = useState<
    ConversationItem[]
  >([]);
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const payload = {
    name: userInfo?.fullName,
    country: userInfo?.country,
    learningObjective: rec?.objectives[0]?.objective,
    aspiration: userInfo?.bioData[0]?.career_aspirations,
    interests: userInfo?.bioData[0]?.subjects_of_interest,
    strengths: "",
    learningStyle: userInfo?.bioData[0].learning_style_preferences,
    strugglingTopic: rec?.objectives[0]?.objective,
    relatedTopic: rec?.objectives[0]?.objective,
    neurodiversity: userInfo?.neurodiversity,
  };
  console.log("this is payload", payload);

  const initializeChat = async () => {
    try {
      setIsInitializing(true);
      const response = await chat(payload);
      console.log("this is response", response);
      setConversation(response?.data.conversation);
      setAskedQuestions(response?.data.askedQuestions);
    } catch (error) {
      console.error("Error initializing chat:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (isChatVisible) {
      initializeChat();
    }
  }, [isChatVisible]);

  useEffect(() => {
    if (conversation.length > 0) {
      const items = conversation.reduce(
        (acc: ConversationItem[], message: Message) => {
          if (message.role === "user") {
            acc.push({ type: "user", messages: [message], currentIndex: 0 });
          } else {
            if (acc.length > 0 && acc[acc.length - 1].type === "assistant") {
              acc[acc.length - 1].messages.push(message);
            } else {
              acc.push({
                type: "assistant",
                messages: [message],
                currentIndex: 0,
              });
            }
          }
          return acc;
        },
        []
      );
      setConversationItems(items);
    }
  }, [conversation]);

  const scrollToBottom = (behavior: "auto" | "smooth" = "auto") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [conversationItems]);

  const handleQuestionSubmit = async () => {
    if (question.trim() && !isSubmitting) {
      setIsSubmitting(true);
      const userMessage: Message = { role: "user", content: question };
      setConversation((prev) => [...prev, userMessage]);
      setQuestion("");
      const payload = {
        userInput: question,
        conversation: [...conversation, userMessage],
        askedQuestions: askedQuestions,
      };
      console.log("this is new payload", payload);

      try {
        const response = await chat(payload);
        console.log("this is response", response);
        setConversation(response?.data.conversation);
        setAskedQuestions(response?.data.askedQuestions);
        setConversationItems((prev) => [
          ...prev,
          { type: "user", messages: [userMessage], currentIndex: 0 },
        ]);
        scrollToBottom("smooth");
      } catch (error) {
        console.error("Error getting chat response:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const formatMessage = (content: string) => {
    if (!content) return ""; // Add this line to handle undefined content
    const lines = content?.split("\n");
    let formattedContent = "";
    let inList = false;
    let inParagraph = false;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^\d+\./)) {
        if (inParagraph) {
          formattedContent += "</p>";
          inParagraph = false;
        }
        if (!inList) {
          formattedContent += "<ol>";
          inList = true;
        }
        formattedContent += `<li>${trimmedLine}</li>`;
      } else if (inList && trimmedLine === "") {
        formattedContent += "</ol>";
        inList = false;
      } else if (trimmedLine !== "") {
        if (!inParagraph) {
          formattedContent += "<p>";
          inParagraph = true;
        }
        formattedContent += line + " ";
      } else if (inParagraph) {
        formattedContent += "</p>";
        inParagraph = false;
      }
    });

    if (inList) formattedContent += "</ol>";
    if (inParagraph) formattedContent += "</p>";

    return formattedContent.trim();
  };

  const messageStyle = `
    p { margin-bottom: 0.75em; }
    ol { margin-top: 0.5em; margin-bottom: 0.75em; padding-left: 1.5em; }
    li { margin-bottom: 0.5em; }
    p + ol { margin-top: -0.25em; }
  `;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setIsChatVisible(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversationItems]);

  return (
    <div
      className="fixed inset-0 z-50 bg-white flex flex-col p-6 rounded-[20px]"
      onFocus={() => setIsChatVisible(true)}
    >
      {isInitializing ? (
        <div>Initializing chat...</div>
      ) : (
        <div className="flex items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">AI Assist</h2>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            X
          </button>
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="flex-grow mb-6 overflow-y-auto scroll-smooth"
      >
        <style>{messageStyle}</style>
        {conversationItems.map((item, index) =>
          item.type === "assistant" ? (
            <div key={index} className="flex flex-col items-start mb-4">
              <HoverCard>
                <HoverCardTrigger className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-800">
                  <div className="font-bold mb-1">Eddey</div>
                  <div
                    className="whitespace-pre-wrap font-sans"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(
                        item.messages[item.currentIndex]?.content || ""
                      ),
                    }}
                  />
                  {item.messages.length > 1 && (
                    <div className="mt-2 flex justify-between items-center">
                      <button
                        onClick={() => {
                          setConversationItems((prev) =>
                            prev.map((prevItem, i) =>
                              i === index
                                ? {
                                    ...prevItem,
                                    currentIndex:
                                      (prevItem.currentIndex -
                                        1 +
                                        prevItem.messages.length) %
                                      prevItem.messages.length,
                                  }
                                : prevItem
                            )
                          );
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        ← Previous
                      </button>
                      <span className="text-sm text-gray-600">
                        {item.currentIndex + 1} / {item.messages.length}
                      </span>
                      <button
                        onClick={() => {
                          setConversationItems((prev) =>
                            prev.map((prevItem, i) =>
                              i === index
                                ? {
                                    ...prevItem,
                                    currentIndex:
                                      (prevItem.currentIndex + 1) %
                                      prevItem.messages.length,
                                  }
                                : prevItem
                            )
                          );
                        }}
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-fit p-0 relative bottom-1"
                  align="start"
                >
                  <Button
                    variant="ghost"
                    aria-label="Read Aloud"
                    data-testid="voice-play-turn-action-button"
                    onClick={() => {
                      const utterThis = new SpeechSynthesisUtterance(
                        item.messages[item.currentIndex]?.content
                      );
                      window.speechSynthesis.speak(utterThis);
                    }}
                  >
                    <span className="flex h-[30px] w-[30px] items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon-md-heavy"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11 4.9099C11 4.47485 10.4828 4.24734 10.1621 4.54132L6.67572 7.7372C6.49129 7.90626 6.25019 8.00005 6 8.00005H4C3.44772 8.00005 3 8.44776 3 9.00005V15C3 15.5523 3.44772 16 4 16H6C6.25019 16 6.49129 16.0938 6.67572 16.2629L10.1621 19.4588C10.4828 19.7527 11 19.5252 11 19.0902V4.9099ZM8.81069 3.06701C10.4142 1.59714 13 2.73463 13 4.9099V19.0902C13 21.2655 10.4142 22.403 8.81069 20.9331L5.61102 18H4C2.34315 18 1 16.6569 1 15V9.00005C1 7.34319 2.34315 6.00005 4 6.00005H5.61102L8.81069 3.06701ZM20.3166 6.35665C20.8019 6.09313 21.409 6.27296 21.6725 6.75833C22.5191 8.3176 22.9996 10.1042 22.9996 12.0001C22.9996 13.8507 22.5418 15.5974 21.7323 17.1302C21.4744 17.6185 20.8695 17.8054 20.3811 17.5475C19.8927 17.2896 19.7059 16.6846 19.9638 16.1962C20.6249 14.9444 20.9996 13.5175 20.9996 12.0001C20.9996 10.4458 20.6064 8.98627 19.9149 7.71262C19.6514 7.22726 19.8312 6.62017 20.3166 6.35665ZM15.7994 7.90049C16.241 7.5688 16.8679 7.65789 17.1995 8.09947C18.0156 9.18593 18.4996 10.5379 18.4996 12.0001C18.4996 13.3127 18.1094 14.5372 17.4385 15.5604C17.1357 16.0222 16.5158 16.1511 16.0539 15.8483C15.5921 15.5455 15.4632 14.9255 15.766 14.4637C16.2298 13.7564 16.4996 12.9113 16.4996 12.0001C16.4996 10.9859 16.1653 10.0526 15.6004 9.30063C15.2687 8.85905 15.3578 8.23218 15.7994 7.90049Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </span>
                  </Button>
                </HoverCardContent>
              </HoverCard>
            </div>
          ) : (
            item.messages[0]?.content && (
              <div key={index} className="flex flex-col items-end mb-4">
                <div className="max-w-[80%] p-3 rounded-lg bg-blue-500 text-white">
                  {/* <div className="font-bold mb-1">You</div> */}
                  <div
                    className="whitespace-pre-wrap font-sans m-0"
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(item.messages[0].content),
                    }}
                  />
                </div>
              </div>
            )
          )
        )}
      </div>

      <div className="bg-gray-100 rounded-[20px] border-slate-200 border-[1px] rounded-b-[19px]">
        <div className=" relative">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full py-3 px-5 pr-12 rounded-tl-[19px] rounded-tr-[19px] focus:outline-none"
            placeholder="Ask me anything..."
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleQuestionSubmit();
              }
            }}
          />
        </div>

        <div className=" flex justify-between px-3 items-center">
          {isSubmitting && (
            <div className="text-green-500 font-semibold">Thinking...</div>
          )}
          <button
            style={{ transform: "rotate(-45deg)" }}
            className={`ml-auto right-2 top-1/2 transform -translate-y-1/2 text-green-500 py-2 mb-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleQuestionSubmit}
            disabled={isSubmitting}
          >
            <BiSolidSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
