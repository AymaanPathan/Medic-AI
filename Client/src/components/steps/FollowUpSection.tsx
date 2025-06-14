import React, { useState, useEffect } from "react";
import {
  Brain,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Send,
  Bot,
  User,
  ChevronRight,
} from "lucide-react";
import type { FollowUpSectionProps } from "../../types/interfaces";
import type { RootDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { generatefollowUpQuestion } from "../../store/slices/chatSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
// TypeScript interfaces
interface LLMQuestion {
  id: number;
  question: string;
  isAnswered: boolean;
}

interface Answer {
  questionId: number;
  question: string;
  answer: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "default",
  size = "md",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105",
    outline:
      "border border-gray-700 bg-transparent text-white hover:bg-gray-800",
    ghost: "text-gray-300 hover:bg-gray-800 hover:text-white",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur shadow-xl ${className}`}
  >
    {children}
  </div>
);

// Loading Component
const LoadingAnalysis: React.FC = () => {
  const [loadingText, setLoadingText] = useState("Analyzing your symptoms...");

  useEffect(() => {
    const texts = [
      "Analyzing your symptoms...",
      "Processing medical data...",
      "Generating personalized questions...",
      "Preparing assessment...",
    ];

    let index = 0;
    const interval = setInterval(() => {
      setLoadingText(texts[index]);
      index = (index + 1) % texts.length;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-600/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">{loadingText}</h3>
        <p className="text-gray-400 text-sm">
          Our AI is preparing targeted questions for you
        </p>
      </div>

      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

// Chat Message Component
const ChatMessage: React.FC<{
  message: string;
  isBot: boolean;
  isTyping?: boolean;
}> = ({ message, isBot, isTyping = false }) => {
  return (
    <div
      className={`flex items-start space-x-3 ${
        isBot ? "" : "flex-row-reverse space-x-reverse"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? "bg-blue-600/20" : "bg-purple-600/20"
        }`}
      >
        {isBot ? (
          <Bot className="w-4 h-4 text-blue-400" />
        ) : (
          <User className="w-4 h-4 text-purple-400" />
        )}
      </div>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
          isBot ? "bg-gray-800/70 text-white" : "bg-blue-600 text-white ml-auto"
        }`}
      >
        {isTyping ? (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message}</p>
        )}
      </div>
    </div>
  );
};

// Question Input Component
const QuestionInput: React.FC<{
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}> = ({ currentAnswer, onAnswerChange, onSubmit, isSubmitting }) => {
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (currentAnswer.trim() && !isSubmitting) {
        onSubmit();
      }
    }
  };

  return (
    <div className="flex items-end space-x-3">
      <div className="flex-1">
        <textarea
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer here..."
          className="w-full min-h-[60px] max-h-32 p-4 rounded-2xl border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          rows={2}
          disabled={isSubmitting}
        />
      </div>
      <Button
        onClick={onSubmit}
        disabled={!currentAnswer.trim() || isSubmitting}
        className="p-3 rounded-2xl"
        size="md"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};

// Main Symptom Analysis Component
const FollowUpSection: React.FC<FollowUpSectionProps> = ({
  onNext,
  onBack,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<LLMQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user_info = useSelector((state: RootState) => state.chat.user_info);
  const symptoms = "cough, fever, fatigue";
  const [chatHistory, setChatHistory] = useState<
    Array<{ message: string; isBot: boolean }>
  >([]);
  const dispatch: RootDispatch = useDispatch();

  useEffect(() => {
    dispatch(
      generatefollowUpQuestion({
        sessionId: "1",
        user_info: user_info,
        userSymptoms: symptoms,
      })
    );
  });

  // Simulate LLM generated questions
  const simulatedLLMQuestions = [
    "How long have you been experiencing these symptoms?",
    "Can you describe the intensity or severity of your symptoms on a scale you're comfortable with?",
    "Have you noticed any patterns in when your symptoms occur or worsen?",
    "Are you currently taking any medications or have you tried any treatments?",
    "Have you experienced similar symptoms before, and if so, what was the outcome?",
  ];

  useEffect(() => {
    // Simulate loading and LLM question generation
    const timer = setTimeout(() => {
      const generatedQuestions: LLMQuestion[] = simulatedLLMQuestions.map(
        (q, index) => ({
          id: index + 1,
          question: q,
          isAnswered: false,
        })
      );

      setQuestions(generatedQuestions);
      setIsLoading(false);

      // Add initial bot message
      setChatHistory([
        {
          message:
            "I'll ask you a few personalized questions to better understand your symptoms. Please answer as detailed as you feel comfortable.",
          isBot: true,
        },
      ]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmitAnswer = async (): Promise<void> => {
    if (!currentAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const currentQuestion = questions[currentQuestionIndex];

    // Add user answer to chat
    setChatHistory((prev) => [
      ...prev,
      {
        message: currentAnswer,
        isBot: false,
      },
    ]);

    // Save answer
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: currentAnswer.trim(),
    };

    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQuestion.id);
      return [...filtered, newAnswer];
    });

    // Mark question as answered
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === currentQuestion.id ? { ...q, isAnswered: true } : q
      )
    );

    setCurrentAnswer("");

    // Simulate processing time
    setTimeout(() => {
      setIsSubmitting(false);

      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex((prev) => prev + 1);

        // Add next question to chat
        const nextQuestion = questions[currentQuestionIndex + 1];
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              message: nextQuestion.question,
              isBot: true,
            },
          ]);
        }, 1000);
      } else {
        // All questions completed
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              message:
                "Thank you for providing detailed information about your symptoms. I'm now analyzing your responses to provide personalized insights.",
              isBot: true,
            },
          ]);
          setIsComplete(true);
        }, 1000);
      }
    }, 1500);
  };

  const goToPreviousQuestion = (): void => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevAnswer = answers.find(
        (a) => a.questionId === questions[currentQuestionIndex - 1].id
      );
      setCurrentAnswer(prevAnswer?.answer || "");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-gray-900"></div>
        <div className="relative z-10">
          <LoadingAnalysis />
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-gray-900 to-gray-900"></div>
        <Card className="w-full max-w-2xl mx-auto relative z-10">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-600/20 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Assessment Complete!
            </h2>
            <p className="text-gray-400 mb-8">
              Thank you for providing detailed information about your symptoms.
              Our AI is now analyzing your responses to provide personalized
              health insights.
            </p>
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-400 mb-2">Your Responses</h4>
              <p className="text-sm text-gray-400">
                You've answered {answers.length} personalized questions.
                Analysis will be ready in a few moments.
              </p>
            </div>
            <Button size="lg" className="w-full">
              View Analysis Results
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-900 to-gray-900"></div>
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Symptom Assessment
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Personalized questions based on your symptoms
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Progress:</span>
                <div className="flex space-x-1">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index < currentQuestionIndex
                          ? "bg-green-500"
                          : index === currentQuestionIndex
                          ? "bg-blue-500 scale-125"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-400 ml-2">
                  {currentQuestionIndex + 1}/{questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="space-y-6 mb-6">
              {chatHistory.map((chat, index) => (
                <ChatMessage
                  key={index}
                  message={chat.message}
                  isBot={chat.isBot}
                />
              ))}

              {/* Current question */}
              {currentQuestionIndex < questions.length && (
                <ChatMessage
                  message={questions[currentQuestionIndex].question}
                  isBot={true}
                />
              )}

              {/* Show typing indicator when submitting */}
              {isSubmitting && (
                <ChatMessage message="" isBot={true} isTyping={true} />
              )}
            </div>
          </div>
        </div>

        {/* Input Area */}
        {!isComplete && currentQuestionIndex < questions.length && (
          <div className="flex-shrink-0 p-6 border-t border-gray-800/50">
            <div className="max-w-4xl mx-auto">
              <QuestionInput
                currentAnswer={currentAnswer}
                onAnswerChange={setCurrentAnswer}
                onSubmit={handleSubmitAnswer}
                isSubmitting={isSubmitting}
              />

              {/* Navigation */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="ghost"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0 || isSubmitting}
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="text-xs text-gray-500">
                  Press Enter to send • Shift+Enter for new line
                </div>
                <div className="w-20"></div> {/* Spacer for balance */}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 py-3">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1 py-3 text-base">
          Complete Assessment
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FollowUpSection;
