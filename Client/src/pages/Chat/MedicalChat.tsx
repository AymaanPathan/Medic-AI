import React, { useState, useRef, useEffect } from "react";
import {
  Stethoscope,
  Clock,
  Shield,
  Send,
  Plus,
  Play,
  Sparkles,
  Heart,
  Brain,
  Activity,
} from "lucide-react";
import { socket } from "@/utils/socketSetup";
import { useDispatch } from "react-redux";
import type { RootDispatch } from "@/store";
import { getFirstThread, storeInitalThread } from "@/store/slices/threadSlice";
const MedicalChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm here to help with your medical questions. Please describe your symptoms in detail, and I'll provide guidance based on the information you share.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch: RootDispatch = useDispatch();
  const [charCount, setCharCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  const handleStartSession = async () => {
    setSessionStarted(true);
    await dispatch(storeInitalThread());
  };

  useEffect(() => {
    const getInitialThread = async () => {
      const res = await dispatch(getFirstThread());
      if (res.meta.requestStatus === "fulfilled" && res.payload.id) {
        setSessionStarted(true);
      }
      console.log(res);
    };
    getInitialThread();
  }, [dispatch]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleChunk = (chunk: string) => {
      if (chunk === "[DONE]") {
        setIsProcessing(false);
        return;
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        if (updated[lastIndex]?.sender === "ai") {
          updated[lastIndex] = {
            ...updated[lastIndex],
            text: updated[lastIndex].text + chunk,
          };
        } else {
          updated.push({
            id: Date.now(),
            sender: "ai",
            text: chunk,
            timestamp: new Date(),
          });
        }

        return updated;
      });
    };

    socket.off("stream_chunk");
    socket.on("stream_chunk", handleChunk);

    return () => {
      socket.off("stream_chunk", handleChunk);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 800) {
      setInputValue(value);
      setCharCount(value.length);
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const messageToSend = inputValue.trim();
    setInputValue("");
    setIsProcessing(true);

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        text: messageToSend,
        timestamp: new Date(),
      },
    ]);

    socket.emit("start_stream_answer", messageToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isProcessing) sendMessage();
    }
  };

  const formatTime = (timestamp: Date) =>
    timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Rest of the code stays same — no change to rendering JSX

  useEffect(() => {
    socket.on("stream_chunk", (data) => {
      console.log(data);
    });
  });

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Floating medical icons */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            <Heart className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <div
            className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center animate-bounce"
            style={{ animationDelay: "2s" }}
          >
            <Brain className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-1/3 transform -translate-x-1/2 translate-y-1/2">
          <div
            className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center animate-bounce"
            style={{ animationDelay: "3s" }}
          >
            <Activity className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-all duration-300">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MedAssist AI
              </h1>
              <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 font-medium">
              Your Intelligent Medical Companion
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-sm text-gray-600">
                HIPAA compliant with end-to-end encryption
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">
                Advanced medical knowledge at your fingertips
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                24/7 Available
              </h3>
              <p className="text-sm text-gray-600">
                Instant medical guidance anytime, anywhere
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <button
              onClick={handleStartSession}
              className="group relative inline-flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span>Start Medical Consultation</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
            </button>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Click to begin your personalized medical consultation. Remember,
              this is for guidance only and not a substitute for professional
              medical advice.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>FDA Guidelines</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                MedAssist AI
              </h1>
              <p className="text-xs text-gray-500">Medical Consultation</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <button
            // onClick={handleNewChat}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>New Consultation</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Medical Consultation
              </h2>
              <p className="text-gray-600 text-xs mt-0.5">
                Share your symptoms for personalized guidance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700">
                AI Active
              </span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-2xl ${
                    message.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-flex items-start space-x-2 ${
                      message.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-gray-600"
                          : "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      ) : (
                        <Stethoscope className="w-3 h-3 text-white" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-2.5 rounded-xl shadow-sm border ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent"
                          : "bg-white text-gray-900 border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div
                        className={`flex items-center space-x-1 mt-1 ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <Clock
                          className={`w-2.5 h-2.5 ${
                            message.sender === "user"
                              ? "text-emerald-100"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            message.sender === "user"
                              ? "text-emerald-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-2xl">
                  <div className="inline-flex items-start space-x-2">
                    <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Stethoscope className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.15s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.3s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">
                          Analyzing your symptoms...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms in detail..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-sm placeholder-gray-500"
                rows={3}
                maxLength={800}
                disabled={isProcessing}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <span className="text-xs text-gray-400">{charCount}/800</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                  <Shield className="w-3 h-3 text-emerald-500" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span>HIPAA Compliant</span>
                </div>
              </div>

              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-2 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-gray-500">
              AI-powered medical guidance • Not a substitute for professional
              medical advice • Emergency: Call 911
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalChat;
