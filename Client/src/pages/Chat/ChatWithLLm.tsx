import React, { useEffect, useState } from "react";
import DiagnosisCard from "./DiagnosisCard";
import type { Message } from "@/types/interfaces";
import { useDispatch, useSelector } from "react-redux";
import type { RootDispatch, RootState } from "@/store";
import { submitFollowupAnswersThunk } from "@/store/slices/chatSlice";
type ChatProps = {
  messages: Message[];
  isTyping?: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
};

const Chat: React.FC<ChatProps> = ({
  messages,
  isTyping,
  messagesEndRef,
  inputMessage,
  setInputMessage,
  handleSendMessage,
}: ChatProps) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [currentFollowUpIndex, setCurrentFollowUpIndex] = useState(0);
  const [userResponseToFollowUp, setUserResponseToFollowUp] = useState<
    Record<string, string>
  >({});
  const finalPrompt = useSelector((state: RootState) => state.chat.finalPrompt);
  const [hasStarted, setHasStarted] = useState(false);
  const followUpQuestions = useSelector(
    (state: RootState) => state.chat.followupQuestions
  );
  const dispatch: RootDispatch = useDispatch();

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    // Call only once
    if (!hasStarted) {
      handleSendMessage();
      setHasStarted(true);
    }

    if (currentFollowUpIndex < followUpQuestions.length - 1) {
      setCurrentFollowUpIndex((prev) => prev + 1);
    }

    if (followUpQuestions.length > 0) {
      setUserResponseToFollowUp((prev) => ({
        ...prev,
        [followUpQuestions[currentFollowUpIndex]]: inputMessage.trim(),
      }));
    }

    setInputMessage("");
    setCurrentFollowUpIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (
      !hasSubmitted &&
      currentFollowUpIndex >= followUpQuestions.length &&
      Object.keys(userResponseToFollowUp).length === followUpQuestions.length
    ) {
      setHasSubmitted(true);
      dispatch(
        submitFollowupAnswersThunk({
          sessionId: "1",
          user_response: userResponseToFollowUp,
        })
      );
    }
  }, [
    currentFollowUpIndex,
    followUpQuestions.length,
    userResponseToFollowUp,
    dispatch,
    hasSubmitted,
  ]);

  console.log("final", finalPrompt);

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <div className="flex-1 flex flex-col justify-center items-stretch">
        <div className="flex-1 flex flex-col">
          {/* Chat Container - now fills the right side */}
          <div className="flex-1 flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-white/90 rounded-none shadow-none border-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                      message.type === "user"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {message.type === "user" ? (
                      <span className="font-bold text-lg">U</span>
                    ) : (
                      <span className="font-bold text-lg">AI</span>
                    )}
                  </div>
                  <div
                    className={`max-w-2xl rounded-2xl px-6 py-4 text-base shadow-sm ${
                      message.type === "user"
                        ? "bg-green-600 text-white"
                        : message.type === "bot-diagnosis"
                        ? "bg-transparent p-0"
                        : "bg-green-50 text-gray-800 border border-green-200"
                    }`}
                  >
                    {message.type === "bot-diagnosis" &&
                    typeof message.content !== "string" ? (
                      <DiagnosisCard diagnosis={message.content} />
                    ) : typeof message.content === "string" ? (
                      <p className="leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                    ) : null}
                    <div
                      className={`text-xs mt-2 ${
                        message.type === "user"
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {followUpQuestions.length > 0 &&
                currentFollowUpIndex < followUpQuestions.length && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-md">
                      <span className="font-bold text-lg">AI</span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
                      <p className="text-base text-gray-800">
                        {followUpQuestions[currentFollowUpIndex]}
                      </p>
                    </div>
                  </div>
                )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shadow-md">
                    <span className="font-bold text-lg">AI</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input Area */}
            <div className="border-t border-green-200 bg-white/95 p-6 flex items-center gap-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Describe your symptoms or ask a question..."
                className="flex-1 resize-none border border-green-300 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[48px] max-h-32 text-base bg-white shadow-sm"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 disabled:bg-green-300 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 flex-shrink-0"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Chat;
