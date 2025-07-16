import React, { useState, useRef, useEffect } from "react";
import {
  Stethoscope,
  Clock,
  Shield,
  Send,
  Play,
  Sparkles,
  Heart,
  Brain,
  Activity,
} from "lucide-react";
import { socket } from "@/utils/socketSetup";
import { useDispatch, useSelector } from "react-redux";
import type { RootDispatch, RootState } from "@/store";
import {
  setCurrentUserThreadId,
  storeInitalThread,
} from "@/store/slices/thread.slice";
import {
  addUserMessage,
  appendAiChunk,
  getMessageForSideBar,
  getMessagesByThreadId,
} from "@/store/slices/chat.slice";
import { getUsersInitialThreadId } from "@/store/slices/userSlice";
import Sidebar from "./SideBar";
import Navbar from "@/components/Navbar";
const MedicalChat = () => {
  const messages = useSelector((state: RootState) => state.chat.message);

  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch: RootDispatch = useDispatch();
  const [charCount, setCharCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef(null);
  const currentUserThreadId = useSelector(
    (state: RootState) => state.thread.currentUserThreadId
  );
  const [sessionStarted, setSessionStarted] = useState(false);
  const handleStartSession = async () => {
    setSessionStarted(true);

    await dispatch(storeInitalThread());
  };

  useEffect(() => {
    const getInitialThread = async () => {
      const res = await dispatch(getUsersInitialThreadId());
      dispatch(setCurrentUserThreadId(res?.payload?.last_selected_thread_id));
      if (
        res.meta.requestStatus === "fulfilled" &&
        res.payload.last_selected_thread_id
      ) {
        setSessionStarted(true);
      }
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
    socket.on("trigger_sidebar_fetch", (msg) => {
      if (msg) {
        dispatch(getMessageForSideBar());
      }
    });
  });

  useEffect(() => {
    const handleChunk = (chunk: string) => {
      if (chunk === "[DONE]") {
        setIsProcessing(false);
        return;
      }

      dispatch(appendAiChunk(chunk));
    };

    socket.off("stream_chunk");
    socket.on("stream_chunk", handleChunk);

    return () => {
      socket.off("stream_chunk", handleChunk);
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 800) {
      setInputValue(value);
      setCharCount(value.length);
    }
  };

  useEffect(() => {
    const fetchMessagesById = async () => {
      await dispatch(getMessagesByThreadId(currentUserThreadId!));
    };

    fetchMessagesById();
  }, [currentUserThreadId, dispatch]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const messageToSend = inputValue.trim();
    setInputValue("");
    setIsProcessing(true);

    // Add user message to UI
    dispatch(addUserMessage(messageToSend));

    const thread_id = currentUserThreadId;

    if (!thread_id) {
      console.error("No thread_id set!");
      return;
    }

    dispatch(getMessageForSideBar());

    // ✅ Send proper structured payload
    socket.emit("start_stream_answer", {
      thread_id,
      message: messageToSend,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isProcessing) sendMessage();
    }
  };

  useEffect(() => {
    dispatch(getMessageForSideBar());
  }, [dispatch]);

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
    <div>
      <div className="min-h-screen bg-white flex">
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Sidebar Content */}
          <div className="flex-auto h-screen overflow-y-scroll scrollbar-thin ">
            <Sidebar />
          </div>
        </div>

        <div className="flex- h-screen w-full overflow-hidden flex flex-col bg-white min-w-0">
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "User" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl ${
                      message.sender === "User" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-sflex items-start space-x-2 ${
                        message.sender === "User"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-xl shadow-sm border ${
                          message.sender === "User"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent"
                            : "bg-white text-gray-900 border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                        <div
                          className={`flex items-center space-x-1 mt-1 ${
                            message.sender === "User"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <Clock
                            className={`w-2.5 h-2.5 ${
                              message.sender === "User"
                                ? "text-emerald-100"
                                : "text-gray-400"
                            }`}
                          />
                          <span
                            className={`text-xs ${
                              message.sender === "User"
                                ? "text-emerald-100"
                                : "text-gray-500"
                            }`}
                          >
                            {typeof message.time_stamp === "string"
                              ? message.time_stamp
                              : message.time_stamp?.toLocaleString()}
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
    </div>
  );
};

export default MedicalChat;
