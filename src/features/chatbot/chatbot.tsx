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
    learningStyle: userInfo?.bioData[0]?.learning_style_preferences,
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
              <div className="max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800">
                <div className="font-bold mb-1">Eddy</div>
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
              </div>
            </div>
          ) : (
            item.messages[0]?.content && (
              <div key={index} className="flex flex-col items-end mb-4">
                <div className="max-w-[70%] p-3 rounded-lg bg-blue-500 text-white">
                  <div className="font-bold mb-1">You</div>
                  <div
                    className="whitespace-pre-wrap font-sans"
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
