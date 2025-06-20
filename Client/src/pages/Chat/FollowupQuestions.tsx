import React, { useState } from "react";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootDispatch, RootState } from "@/store";
import {
  generateFinalPromptThunk,
  submitFollowupAnswersThunk,
} from "@/store/slices/chatSlice";
import { socket } from "@/utils/socketSetup";
import { useNavigate } from "react-router";

const FollowUpQuestions = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const dispatch: RootDispatch = useDispatch();
  const userSymptoms = useSelector(
    (state: RootState) => state.chat.userSymptoms
  );
  const finalPrompt = useSelector((state: RootState) => state.chat.finalPrompt);
  const userAdditionalFollowupAnswer = useSelector(
    (state: RootState) => state.chat.user_response
  );
  const questions = useSelector(
    (state: RootState) => state.chat.followupQuestions
  );
  const navigate = useNavigate();
  const sessionId = useSelector((state: RootState) => state.chat.sessionId);
  const progress = ((current + 1) / questions.length) * 100;

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [current]: e.target.value,
    }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const onCompleteAssessment = async () => {
    const usersAnswers: Record<string, string> = {};
    questions.forEach((question, index) => {
      usersAnswers[question] = answers[index] || "";
    });

    console.log("Final answers:", usersAnswers);

    const response = await dispatch(
      submitFollowupAnswersThunk({
        sessionId: "1",
        user_response: usersAnswers,
      })
    );
    if (response.meta.requestStatus === "fulfilled") {
      await dispatch(
        generateFinalPromptThunk({
          sessionId: "1",
          userSymptoms: userSymptoms,
          formatted_response: userAdditionalFollowupAnswer,
        })
      ).unwrap();
    }
    if (response.meta.requestStatus === "fulfilled") {
      navigate("/chat");
    }
  };

  console.log(
    "User additional follow-up answers:",
    userAdditionalFollowupAnswer
  );

  const emit = () => {
    const res = socket.emit("start_diagnosis", {
      finalPrompt: finalPrompt,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            Follow-Up Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Help us understand your situation better
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-blue-600">
              {current + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 mb-8">
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-semibold">
                {current + 1}
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <h2 className="text-2xl font-medium text-gray-900 mb-8 leading-relaxed">
              {questions[current]}
            </h2>

            <div className="relative">
              <input
                type="text"
                className="w-full p-5 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all duration-200 text-lg bg-gray-50 focus:bg-white placeholder-gray-400"
                value={answers[current] || ""}
                onChange={handleChange}
                placeholder="Type your answer here..."
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                current === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={handlePrev}
              disabled={current === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={emit}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Debug
            </button>

            {current < questions.length - 1 ? (
              <button
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                  !answers[current]?.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
                onClick={handleNext}
                disabled={!answers[current]?.trim()}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                  !answers[current]?.trim()
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
                onClick={onCompleteAssessment}
                disabled={!answers[current]?.trim()}
              >
                <Check className="w-4 h-4" />
                Complete Assessment
              </button>
            )}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-3">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-blue-600 w-8"
                  : index < current
                  ? "bg-green-500 w-2"
                  : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowUpQuestions;
