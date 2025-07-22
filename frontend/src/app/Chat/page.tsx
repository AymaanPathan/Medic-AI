"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Clock,
  Shield,
  Send,
  Sparkles,
  ArrowRight,
  Bot,
  User,
  Zap,
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
import Sidebar from "../../components/SideBar";
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
    socket.on("trigger_sidebar_fetch", (msg: string) => {
      if (msg) {
        dispatch(getMessageForSideBar());
      }
    });
  });

  useEffect(() => {
    const handleChunk = (chunk: string) => {
      setIsProcessing(false);
      if (chunk === "[DONE]") {
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
      <div className="h-screen  bg-white flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main heading */}
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              AI-powered medical
              <br />
              consultation platform
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Get instant medical insights and connect with healthcare
              professionals through our intelligent platform.
            </p>
          </div>

          {/* CTA */}
          <div className="mb-16">
            <button
              onClick={handleStartSession}
              className="inline-flex cursor-pointer items-center px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors"
            >
              Start consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Free to start • No credit card required
            </p>
          </div>

          {/* Trust bar */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 border-t pt-8">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>SOC 2 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>End-to-end Encrypted</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 max-w-2xl mx-auto">
            <p className="text-xs text-gray-400 leading-relaxed">
              This platform provides informational content and AI-assisted
              preliminary assessments. It is not intended to replace
              professional medical advice, diagnosis, or treatment. Always
              consult with qualified healthcare providers for medical decisions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-start">
      {/* Sidebar - Hidden on mobile, visible on tablet+ */}
      <div className="hidden md:block w-64 lg:w-80 flex-shrink-0 h-[calc(100vh-4rem)]">
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mx-auto space-y-4 sm:space-y-6 max-w-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 sm:space-x-3 ${
                  message.sender === "User"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`flex-1 max-w-[85%] sm:max-w-2xl ${
                    message.sender === "User" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-3 py-2 sm:px-4 sm:py-3 rounded-lg ${
                      message.sender === "User"
                        ? "bg-gray-800 text-primary-foreground"
                        : "bg-white"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`flex items-center space-x-1 mt-1 sm:mt-2 text-xs text-muted-foreground ${
                      message.sender === "User"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>
                      {typeof message.time_stamp === "string"
                        ? message.time_stamp
                        : message.time_stamp?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.15s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Analyzing...</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 border-t bg-card/50">
          <div className="max-w-4xl mx-auto">
            {/* Input */}
            <div className="relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms or ask a health question..."
                className="w-full px-3 py-2 pr-16 sm:px-4 sm:py-3 sm:pr-20 bg-background border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring text-sm placeholder:text-muted-foreground"
                rows={window.innerWidth < 640 ? 2 : 3}
                maxLength={1000}
                disabled={isProcessing}
              />

              {/* Character Count & Send Button */}
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center space-x-2 sm:space-x-3">
                <span
                  className={`text-xs transition-colors ${
                    charCount > 800
                      ? "text-yellow-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {charCount}/1000
                </span>
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground rounded-md transition-colors"
                >
                  {isProcessing ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Security Features */}
            <div className="flex items-center justify-between mt-2 sm:mt-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center space-x-1.5">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span className="hidden xs:inline">Encrypted</span>
                  <span className="xs:hidden">Secure</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Zap className="w-3 h-3 text-blue-600" />
                  <span>AI-powered</span>
                </div>
              </div>
              <div className="text-right">
                <span className="hidden sm:inline">Medical AI Assistant</span>
                <span className="sm:hidden">Medical AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalChat;
