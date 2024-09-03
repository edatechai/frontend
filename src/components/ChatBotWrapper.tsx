import { useState } from 'react';
import ChatBot from '@/features/chatbot/chatbot';

const ChatBotWrapper = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleChatBot = () => setIsVisible(!isVisible);

  return (
    <>
      <button
        onClick={toggleChatBot}
        className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg z-40"
      >
        Chat
      </button>
      {isVisible && <ChatBot onClose={toggleChatBot} />}
    </>
  );
};

export default ChatBotWrapper;







