import { useState, useRef, useEffect } from "react";
import type { Message } from "@/types/interfaces";
import SideBar from "./SideBar";
import VoiceImageDiagnosis from "./VoiceImageDiagnosis";
import Chat from "./ChatWithLLm";
import { useDispatch, useSelector } from "react-redux";
import type { RootDispatch, RootState } from "@/store";
import { generatefollowUpQuestion, startChat } from "@/store/slices/chatSlice";

const ChatPage = () => {
  const [selectedSection, setSelectedSection] = useState("chat");
  const dispatch: RootDispatch = useDispatch();

  const [messages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI Medical Assistant. I'm here to help you understand your symptoms and provide guidance. Please describe your current health concerns or symptoms.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const userSymptoms = useSelector(
    (state: RootState) => state.chat.userSymptoms
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    dispatch(startChat({ sessionId: "1", userSymptoms: inputMessage }));
  };
  useEffect(() => {
    dispatch(
      generatefollowUpQuestion({
        sessionId: "1",
        userSymptoms,
      })
    );
  }, [dispatch, userSymptoms]);

  return (
    <div className="min-h-screen bg-gradient-to-br flex">
      <SideBar selected={selectedSection} onSelect={setSelectedSection} />
      <main className="flex-1 ml-72 flex flex-col min-h-screen transition-all duration-300">
        <div className="flex-1 flex overflow-hidden">
          {selectedSection === "chat" ? (
            <Chat
              messages={messages}
              isTyping={isTyping}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              messagesEndRef={messagesEndRef}
            />
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center">
              <VoiceImageDiagnosis />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
