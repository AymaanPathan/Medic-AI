import { useState, useRef, useEffect } from "react";
import {
  Stethoscope,
  User,
  Bot,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  Send,
  Loader2,
  Shield,
  Zap,
  Paperclip,
  Mic,
  MoreHorizontal,
  Menu,
  X,
  Plus,
  History,
  Search,
  Archive,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { socket } from "@/utils/socketSetup";
import DiagnosisCard from "./DiagnosisCard";

const ChatInterface = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock chat history data
  const [chatHistory] = useState([
    {
      id: "current",
      title: "Headaches & Dizziness",
      preview: "I've been having headaches for the past few days...",
      timestamp: new Date(),
      status: "active",
      category: "symptoms",
    },
    {
      id: "chat-001",
      title: "Chest Pain Assessment",
      preview: "Sharp pain in chest area during exercise...",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: "completed",
      category: "emergency",
    },
    {
      id: "chat-002",
      title: "Sleep Issues",
      preview: "Having trouble falling asleep lately...",
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      status: "completed",
      category: "wellness",
    },
    {
      id: "chat-003",
      title: "Medication Side Effects",
      preview: "Questions about new prescription...",
      timestamp: new Date(Date.now() - 604800000), // 1 week ago
      status: "completed",
      category: "medication",
    },
    {
      id: "chat-004",
      title: "Allergy Symptoms",
      preview: "Seasonal allergies getting worse...",
      timestamp: new Date(Date.now() - 1209600000), // 2 weeks ago
      status: "archived",
      category: "symptoms",
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hello! I'm your AI medical assistant. I'm here to help you with symptom assessment, health questions, and provide general medical information. How are you feeling today?",
      timestamp: new Date(),
      isWelcome: true,
    },
    {
      id: 2,
      type: "user",
      content:
        "I've been having headaches for the past few days and feeling dizzy sometimes.",
      timestamp: new Date(),
      status: "delivered",
    },
    {
      id: 3,
      type: "assistant",
      content:
        "I understand you're experiencing headaches and dizziness. These symptoms can have various causes. To better assist you, I'd like to ask a few questions:\n\n• How would you rate the severity of your headaches on a scale of 1-10?\n• When do they typically occur (morning, evening, after activities)?\n• Have you noticed any triggers?\n• Any changes in your sleep pattern or stress levels recently?",
      timestamp: new Date(),
      isQuestion: true,
      label: "Assessment Questions",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState("MED-2025-001");
  const finalPrompt = useSelector((state: RootState) => state.chat.finalPrompt);
  const [diagnosis, setDiagnosis] = useState(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const res = socket.emit("start_diagnosis", {
      finalPrompt: finalPrompt,
    });
    if (res.connected) {
      socket.on("diagnosis_chunk", (data: any) => {
        setDiagnosis(data?.text);
      });
    }
  }, [finalPrompt, setDiagnosis]);

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(timestamp);
  };

  const formatChatDate = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return timestamp.toLocaleDateString();
  };

  const getCategoryColor = (
    category: "symptoms" | "emergency" | "wellness" | "medication" | string
  ) => {
    const colors: Record<string, string> = {
      symptoms: "text-blue-600 bg-blue-50 border-blue-200",
      emergency: "text-red-600 bg-red-50 border-red-200",
      wellness: "text-green-600 bg-green-50 border-green-200",
      medication: "text-purple-600 bg-purple-50 border-purple-200",
    };
    return colors[category] || "text-gray-600 bg-gray-50 border-gray-200";
  };

  const filteredHistory = chatHistory.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    setActiveChat("new-" + Date.now());
    setMessages([
      {
        id: 1,
        type: "assistant",
        content:
          "Hello! I'm your AI medical assistant. How can I help you today?",
        timestamp: new Date(),
        isWelcome: true,
      },
    ]);
    setIsSidebarOpen(false);
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSend();
  //   }
  // };

  const MessageAvatar = ({ message }: { message: any }) => {
    if (message.type === "user") {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <User className="w-5 h-5 text-white" />
        </div>
      );
    }

    const avatarClasses = message.isWelcome
      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg"
      : message.isQuestion
      ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg"
      : message.isRecommendation
      ? "bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg"
      : "bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200";

    const iconColor =
      message.isWelcome || message.isQuestion || message.isRecommendation
        ? "text-white"
        : "text-gray-600";

    return (
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${avatarClasses}`}
      >
        {message.isWelcome ? (
          <Stethoscope className={`w-5 h-5 ${iconColor}`} />
        ) : message.isQuestion ? (
          <MessageSquare className={`w-5 h-5 ${iconColor}`} />
        ) : message.isRecommendation ? (
          <Zap className={`w-5 h-5 ${iconColor}`} />
        ) : (
          <Bot className={`w-5 h-5 ${iconColor}`} />
        )}
      </div>
    );
  };

  const MessageBubble = ({ message }: { message: any }) => {
    if (message.type === "user") {
      return (
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg max-w-lg">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      );
    }

    const bubbleClasses = message.isWelcome
      ? "bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 text-emerald-900"
      : message.isQuestion
      ? "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 text-blue-900"
      : message.isRecommendation
      ? "bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 text-purple-900"
      : "bg-white border border-gray-200 text-gray-900 shadow-sm";

    return (
      <div
        className={`rounded-2xl rounded-tl-md px-4 py-3 max-w-2xl ${bubbleClasses}`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200/50 shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <History className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-gray-900">Chat History</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-200/50">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">New Consultation</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredHistory.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setActiveChat(chat.id);
                setIsSidebarOpen(false);
              }}
              className={`
                p-3 rounded-xl cursor-pointer transition-all duration-200 group hover:bg-gray-50
                ${
                  activeChat === chat.id
                    ? "bg-emerald-50 border border-emerald-200"
                    : "hover:shadow-sm"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <h3
                  className={`font-medium text-sm truncate pr-2 ${
                    activeChat === chat.id
                      ? "text-emerald-700"
                      : "text-gray-900"
                  }`}
                >
                  {chat.title}
                </h3>
                <div className="flex items-center gap-1">
                  {chat.status === "active" && (
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                  <ChevronRight
                    className={`w-3 h-3 transition-transform duration-200 ${
                      activeChat === chat.id
                        ? "text-emerald-600 rotate-90"
                        : "text-gray-400 group-hover:translate-x-0.5"
                    }`}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                {chat.preview}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatChatDate(chat.timestamp)}
                </span>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getCategoryColor(
                    chat.category
                  )}`}
                >
                  {chat.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200/50 p-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200">
              <Archive className="w-4 h-4" />
              <span className="text-xs">Archive</span>
            </button>
            <button className="flex items-center gap-2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200">
              <Trash2 className="w-4 h-4" />
              <span className="text-xs">Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        }`}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200/50 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Medical AI Assistant
                </h1>
                <p className="text-sm text-gray-600">
                  Session:{" "}
                  <span className="font-medium text-emerald-600">
                    {sessionId}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {diagnosis && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-full">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    Assessment Complete
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">
                  HIPAA Secure
                </span>
              </div>

              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.type === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <MessageAvatar message={message} />

              <div
                className={`flex flex-col ${
                  message.type === "user" ? "items-end" : "items-start"
                }`}
              >
                {message.label && (
                  <div className="text-xs font-semibold text-gray-500 mb-2 px-1">
                    {message.label}
                  </div>
                )}

                <MessageBubble message={message} />

                <div
                  className={`flex items-center gap-2 mt-2 text-xs text-gray-500 ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  {message.type === "user" && (
                    <>
                      <span>•</span>
                      {message.status === "sending" ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Sending</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>Delivered</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {diagnosis && (
            <div className="mt-6">
              <DiagnosisCard diagnosis={diagnosis} />
            </div>
          )}
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-gray-200">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200/50 px-6 py-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  // onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms, ask questions, or share additional information..."
                  className="w-full p-4 pr-32 border border-gray-300 rounded-2xl resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-200 bg-white placeholder-gray-500 text-gray-900 min-h-[56px] max-h-32 shadow-sm"
                  rows={1}
                />

                <div className="absolute right-2 bottom-2 flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    // onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      inputValue.trim() && !isTyping
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25 hover:scale-105"
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
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200">
                  <Zap className="w-3 h-3" />
                  Quick Assessment
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200">
                  <FileText className="w-3 h-3" />
                  Upload Report
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                <span>
                  This AI provides general information only. Always consult
                  healthcare professionals for medical decisions.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
