import React, { useState, useRef, useEffect } from "react";
import { Stethoscope, Clock, Shield, Send, Plus } from "lucide-react";

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
  const [charCount, setCharCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 800) {
      setInputValue(value);
      setCharCount(value.length);
    }
  };

  const handleSendMessage = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setCharCount(0);
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: "ai",
        text: "Thank you for sharing your symptoms. Based on what you've described, I recommend consulting with a healthcare professional for proper evaluation. In the meantime, here are some general suggestions that might help...",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 1,
        sender: "ai",
        text: "Hello! I'm here to help with your medical questions. Please describe your symptoms in detail, and I'll provide guidance based on the information you share.",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    setCharCount(0);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Medical Chat</h1>
        </div>

        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area - Full Width */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-white border-b border-gray-100">
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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">
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
                          : "bg-green-500"
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
                          ? "bg-green-500 text-white border-green-500"
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
                              ? "text-green-100"
                              : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`text-xs ${
                            message.sender === "user"
                              ? "text-green-100"
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
                    <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-green-500 flex items-center justify-center">
                      <Stethoscope className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.15s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.3s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700">
                          Analyzing...
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Describe your symptoms in detail..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all duration-200 text-sm placeholder-gray-500"
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
                  <Shield className="w-3 h-3 text-green-500" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>HIPAA Compliant</span>
                </div>
              </div>

              <button
                // onClick={(e) => handleSendMessage(e)}
                disabled={!inputValue.trim() || isProcessing}
                className="flex items-center space-x-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
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
