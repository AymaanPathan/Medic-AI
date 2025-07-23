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
  X,
  Menu,
  MessageSquare,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex h-screen items-center justify-center bg-black">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-80 h-full">
            <Sidebar />
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex flex-col h-screen flex-1">
        {/* Header - Mobile only */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-black" />
            </div>
            <h1 className="text-sm font-medium text-white">HealthAI</h1>
          </div>
          <div className="w-6" />
        </div>

        {/* Messages */}
        <div className=" overflow-y-scroll h-screen  scrollbar-hidden">
          <div className="max-w-5xl mx-auto   px-4 py-6 space-y-6">
            {messages.map((message, index) => (
              <div key={index} className="group">
                {message.sender !== "User" ? (
                  <div className="flex items-start gap-3 max-w-3xl">
                    <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-neutral-400" />
                    </div>

                    <div className=" px-4 py-2 rounded-lg text-sm text-neutral-200 leading-relaxed max-w-[75%] break-words whitespace-pre-wrap overflow-hidden">
                      {message.text}
                      <div className="text-xs text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // User Message
                  <div className="flex items-start gap-3 justify-end max-w-3xl ml-auto">
                    {/* Message Bubble */}
                    <div className="bg-neutral-800 px-4 py-2 rounded-lg text-sm text-white leading-relaxed max-w-[75%]  break-words whitespace-pre-wrap overflow-hidden">
                      {message.text}
                    </div>

                    {/* User Avatar */}
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-black" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isProcessing && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3 h-3 text-neutral-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-xl p-6">
          <div className="max-w-4xl mx-auto">
            {/* Input Container */}
            <div className="relative group">
              <div className="absolute inset-0  rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>

              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl hover:border-white/20 focus-within:border-white/30 transition-all duration-300">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask MediCore anything about your health..."
                  className="w-full px-4 py-4 pr-14 bg-transparent border-0 rounded-xl resize-none focus:outline-none text-sm placeholder:text-gray-400 text-white transition-all duration-200 placeholder:transition-colors focus:placeholder:text-gray-500"
                  rows={1}
                  maxLength={1000}
                  disabled={isProcessing}
                  style={{
                    minHeight: "52px",
                    maxHeight: "140px",
                  }}
                  onInput={(e) => {
                    const textarea = e.target as HTMLTextAreaElement;
                    textarea.style.height = "auto";
                    textarea.style.height =
                      Math.min(textarea.scrollHeight, 140) + "px";
                  }}
                />

                {/* Send Button */}
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    className="flex items-center justify-center w-9 h-9 text-white   disabled:bg-white/20 disabled:cursor-not-allowed cursor-pointer disabled:text-gray-500 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 group/btn"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalChat;
