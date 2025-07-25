/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  ArrowRight,
  Bot,
  User,
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
  const [sessionStarted, setSessionStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch: RootDispatch = useDispatch();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const currentUserThreadId = useSelector(
    (state: RootState) => state.thread.currentUserThreadId
  );

  // Socket connection management
  useEffect(() => {
    const handleConnect = () => {
      setError(null);
    };

    const handleDisconnect = () => {
      setError("Connection lost. Attempting to reconnect...");
    };

    const handleConnectError = () => {
      setError("Failed to connect to server. Please try again.");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  const handleStartSession = async () => {
    try {
      setError(null);
      setSessionStarted(true);
      await dispatch(storeInitalThread());

      // Focus input after session starts
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || "Failed to start session. Please try again.");
      setSessionStarted(false);
    }
  };

  useEffect(() => {
    const getInitialThread = async () => {
      try {
        const res = await dispatch(getUsersInitialThreadId());
        dispatch(setCurrentUserThreadId(res?.payload?.last_selected_thread_id));
        if (
          res.meta.requestStatus === "fulfilled" &&
          res.payload.last_selected_thread_id
        ) {
          setSessionStarted(true);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load chat history.");
      }
    };
    getInitialThread();
  }, [dispatch]);

  useEffect(() => {
    const handleSidebarTrigger = (msg: string) => {
      if (msg) {
        dispatch(getMessageForSideBar());
      }
    };

    socket.on("trigger_sidebar_fetch", handleSidebarTrigger);

    return () => {
      socket.off("trigger_sidebar_fetch", handleSidebarTrigger);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleChunk = (chunk: string) => {
      setIsProcessing(false);
      if (chunk === "[DONE]") {
        return;
      }

      dispatch(appendAiChunk(chunk));
    };

    const handleError = () => {
      setIsProcessing(false);
      setError(
        "An error occurred while processing your message. Please try again."
      );
    };

    socket.off("stream_chunk");
    socket.off("stream_error");
    socket.on("stream_chunk", handleChunk);
    socket.on("stream_error", handleError);

    return () => {
      socket.off("stream_chunk", handleChunk);
      socket.off("stream_error", handleError);
    };
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 1000) {
      setInputValue(value);
      setError(null);
    }
  };

  useEffect(() => {
    const fetchMessagesById = async () => {
      if (currentUserThreadId) {
        try {
          await dispatch(getMessagesByThreadId(currentUserThreadId));
        } catch (err: any) {
          setError(err.message || "Failed to load messages.");
        }
      }
    };

    fetchMessagesById();
  }, [currentUserThreadId, dispatch]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaResize = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      const textarea = e.target as HTMLTextAreaElement;
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 140) + "px";
    },
    []
  );

  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || isProcessing) return;

    const messageToSend = inputValue.trim();
    setInputValue("");
    setIsProcessing(true);
    setError(null);

    // Add user message to UI
    dispatch(addUserMessage(messageToSend));

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const thread_id = currentUserThreadId;

    if (!thread_id) {
      setError("No active conversation found. Please refresh the page.");
      setIsProcessing(false);
      return;
    }

    dispatch(getMessageForSideBar());

    socket.emit("start_stream_answer", {
      thread_id,
      message: messageToSend,
    });
  }, [inputValue, isProcessing, currentUserThreadId, dispatch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    dispatch(getMessageForSideBar());
  }, [dispatch]);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isProcessing) {
      scrollToBottom();
    }
  }, [isProcessing]);

  // Loading state for initial load
  if (!sessionStarted) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
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

          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* CTA */}
          <div className="mb-16">
            <button
              onClick={handleStartSession}
              className="inline-flex cursor-pointer items-center px-8 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Start consultation
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Free to start • No credit card required
            </p>
          </div>

          {/* Connection status */}

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
    <div className="flex h-screen scrollbar-thin bg-black">
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
              aria-label="Close sidebar"
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
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-black" />
            </div>
            <h1 className="text-sm font-medium text-white">HealthAI</h1>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-900/20 border-b border-red-800/30 px-4 py-3">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mt-16 mb-16 overscroll-contain">
          <div className="max-w-5xl mx-auto px-4 py-6 pb-32 space-y-6">
            {messages.length === 0 && !isProcessing && (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Welcome to HealthAI
                </h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto">
                  Start by asking any health-related question. I&apos;m here to
                  help with medical information and guidance.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={`${message.id || index}`} className="group">
                {message.sender !== "User" ? (
                  <div className="flex items-start gap-3 max-w-3xl">
                    <div className="w-6 h-6 bg-neutral-800 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-neutral-400" />
                    </div>

                    <div className="px-4 py-2 rounded-lg text-sm text-neutral-200 leading-relaxed max-w-[75%] break-words whitespace-pre-wrap overflow-hidden">
                      {message.text}
                      <div className="text-xs text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {message.time_stamp
                          ? new Date(message.time_stamp).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : new Date().toLocaleTimeString([], {
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
                    <div className="bg-neutral-800 px-4 py-2 rounded-lg text-sm text-white leading-relaxed max-w-[75%] break-words whitespace-pre-wrap overflow-hidden">
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

        {/* Fixed Input Area at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-40  p-6 md:left-44">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>

              <div className="backdrop-blur-md border-2 border-white rounded-xl shadow-2xl hover:border-white/20 focus-within:border-white/30 transition-all duration-300">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onInput={handleTextareaResize}
                  placeholder={"Ask MediCore anything about your health..."}
                  className="w-full px-4 py-4 pr-14 bg-transparent border-0 rounded-xl resize-none focus:outline-none text-sm placeholder:text-gray-400 text-white transition-all duration-200 placeholder:transition-colors focus:placeholder:text-gray-500"
                  rows={1}
                  maxLength={1000}
                  disabled={isProcessing}
                  style={{
                    minHeight: "52px",
                    maxHeight: "140px",
                  }}
                />

                {/* Send Button */}
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isProcessing}
                    className="flex items-center justify-center w-9 h-9 text-white disabled:bg-white/20 disabled:cursor-not-allowed cursor-pointer disabled:text-gray-500 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 group/btn"
                    aria-label="Send message"
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
