import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Clock,
  CheckCircle,
  Loader2,
  FileText,
  MessageSquare,
  Stethoscope,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootDispatch, RootState } from "@/store";
import { generateLLMAnswer } from "@/store/slices/chatSlice";

const MedicalChat = () => {
  const dispatch: RootDispatch = useDispatch();
  const {
    sessionId,
    userSymptoms,
    user_info,
    followupQuestions,
    user_response,
    finalPrompt,
    diagnosis,
  } = useSelector((state: RootState) => state.chat);

  type Message = {
    id: string | number;
    type: "user" | "assistant";
    content: string;
    timestamp: Date;
    status: string;
    label?: string;
    isImportant?: boolean;
    isQuestion?: boolean;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef(null);

  // Build conversation history from Redux state
  useEffect(() => {
    const conversationHistory: Message[] = [];

    // Initial symptoms
    if (userSymptoms) {
      conversationHistory.push({
        id: "symptoms",
        type: "user" as const,
        content: userSymptoms,
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        status: "delivered",
        label: "Initial Symptoms",
      });

      conversationHistory.push({
        id: "symptoms-response",
        type: "assistant" as const,
        content:
          "Thank you for sharing your symptoms. I'll need some additional information to better understand your condition.",
        timestamp: new Date(Date.now() - 295000),
        status: "delivered",
      });
    }

    // Personal information
    if (user_info) {
      conversationHistory.push({
        id: "personal-info",
        type: "user" as const,
        content: user_info,
        timestamp: new Date(Date.now() - 250000),
        status: "delivered",
        label: "Personal Information",
      });

      conversationHistory.push({
        id: "personal-info-response",
        type: "assistant" as const,
        content:
          "I've recorded your personal information. Now I'll ask some follow-up questions to get a clearer picture.",
        timestamp: new Date(Date.now() - 245000),
        status: "delivered",
      });
    }

    // Follow-up questions and answers
    if (followupQuestions.length > 0 && Object.keys(user_response).length > 0) {
      followupQuestions.forEach((question, index) => {
        const answer = user_response[question];
        if (answer) {
          conversationHistory.push({
            id: `followup-q-${index}`,
            type: "assistant" as const,
            content: question,
            timestamp: new Date(Date.now() - 200000 + index * 30000),
            status: "delivered",
            isQuestion: true,
          });

          conversationHistory.push({
            id: `followup-a-${index}`,
            type: "user" as const,
            content: answer,
            timestamp: new Date(Date.now() - 195000 + index * 30000),
            status: "delivered",
          });
        }
      });

      conversationHistory.push({
        id: "followup-complete",
        type: "assistant" as const,
        content:
          "Thank you for answering all the follow-up questions. I'm now analyzing your information to provide a comprehensive assessment.",
        timestamp: new Date(Date.now() - 100000),
        status: "delivered",
      });
    }

    // Final diagnosis
    if (diagnosis) {
      conversationHistory.push({
        id: "diagnosis",
        type: "assistant" as const,
        content: diagnosis,
        timestamp: new Date(Date.now() - 60000),
        status: "delivered",
        label: "Medical Assessment",
        isImportant: true,
      });
    }

    // Welcome message if no conversation yet
    if (conversationHistory.length === 0) {
      conversationHistory.push({
        id: "welcome",
        type: "assistant" as const,
        content:
          "Hello! I'm your AI medical assistant. I'll help you understand your symptoms and provide guidance. Please start by describing what's bothering you.",
        timestamp: new Date(),
        status: "delivered",
      });
    }

    setMessages(conversationHistory);
  }, [userSymptoms, user_info, followupQuestions, user_response, diagnosis]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    // Update message status to delivered
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 500);

    // Generate AI response using Redux
    try {
      if (finalPrompt && sessionId) {
        const response = await dispatch(
          generateLLMAnswer({
            session_id: sessionId,
            finalPrompt: finalPrompt + "\n\nUser follow-up: " + currentInput,
          })
        );

        if (response.payload) {
          const aiResponse: Message = {
            id: Date.now() + 1,
            type: "assistant",
            content: response.payload,
            timestamp: new Date(),
            status: "delivered",
          };

          setMessages((prev) => [...prev, aiResponse]);
        }
      } else {
        // Fallback response
        const fallbackResponse: Message = {
          id: Date.now() + 1,
          type: "assistant",
          content:
            "I understand your concern. To provide the best guidance, please complete the initial assessment process first. This will help me give you more accurate and personalized advice.",
          timestamp: new Date(),
          status: "delivered",
        };

        setMessages((prev) => [...prev, fallbackResponse]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        type: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
        status: "delivered",
      };

      setMessages((prev) => [...prev, errorResponse]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: number | Date | undefined) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(timestamp);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              Medical Assessment Chat
            </h1>
            <p className="text-sm text-gray-500">
              {sessionId
                ? `Session: ${sessionId}`
                : "Ready to start assessment"}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {diagnosis && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-green-700 font-medium">
                  Assessment Complete
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Secure & HIPAA Compliant
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.type === "user" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                message.type === "user"
                  ? "bg-blue-600"
                  : message.isImportant
                  ? "bg-green-100 border-2 border-green-500"
                  : "bg-gray-100 border border-gray-200"
              }`}
            >
              {message.type === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : message.isImportant ? (
                <FileText className="w-4 h-4 text-green-600" />
              ) : message.isQuestion ? (
                <MessageSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Bot className="w-4 h-4 text-gray-600" />
              )}
            </div>

            {/* Message Content */}
            <div
              className={`flex flex-col max-w-2xl ${
                message.type === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Label */}
              {message.label && (
                <div
                  className={`text-xs font-medium mb-1 ${
                    message.isImportant ? "text-green-600" : "text-blue-600"
                  }`}
                >
                  {message.label}
                </div>
              )}

              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-blue-600 text-white rounded-tr-lg"
                    : message.isImportant
                    ? "bg-green-50 text-gray-900 border-2 border-green-200 rounded-tl-lg shadow-sm"
                    : message.isQuestion
                    ? "bg-blue-50 text-gray-900 border border-blue-200 rounded-tl-lg shadow-sm"
                    : "bg-white text-gray-900 border border-gray-200 rounded-tl-lg shadow-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>

              {/* Message Meta */}
              <div
                className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <span>{formatTime(message.timestamp)}</span>
                {message.type === "user" && (
                  <>
                    <span>•</span>
                    {message.status === "sending" ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <CheckCircle className="w-3 h-3 text-blue-500" />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center bg-gray-100 border border-gray-200">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-lg px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">Analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your symptoms, request clarification, or share additional concerns..."
              className="w-full p-4 pr-12 border border-gray-200 rounded-2xl resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 min-h-[52px] max-h-32"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`absolute right-2 bottom-2 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                inputValue.trim() && !isTyping
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center mt-3">
          <p className="text-xs text-gray-400">
            This AI provides general information only. Always consult healthcare
            professionals for medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalChat;
