"use client";
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
  MessageCircle,
  ArrowRight,
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
import { ChatMessage } from "@/models/chat";
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
    <div>
      <div className="min-h-screen bg-white ">
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Sidebar Content */}
          <div className="flex-auto h-screen overflow-y-scroll scrollbar-thin ">
            <Sidebar />
          </div>
        </div>

        <div className="flex- h-screen w-full overflow-hidden flex flex-col bg-white min-w-0">
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-3">
              {messages.map((message: ChatMessage, index: number) => (
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
