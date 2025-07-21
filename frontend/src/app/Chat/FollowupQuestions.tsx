import React, { useState } from "react";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootDispatch, RootState } from "@/store";
import {
  generateFinalPromptThunk,
  generateLLMAnswer,
  submitFollowupAnswersThunk,
} from "@/store/slices/diagnosis.slice";
import { socket } from "@/utils/socketSetup";

const FollowUpQuestions = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const dispatch: RootDispatch = useDispatch();
  const userSymptoms = useSelector(
    (state: RootState) => state.diagnosis.userSymptoms
  );

  const userAdditionalFollowupAnswer = useSelector(
    (state: RootState) => state.diagnosis.user_response
  );
  const questions = useSelector(
    (state: RootState) => state.diagnosis.followupQuestions
  );
  // const navigate = useNavigate();
  const progress = ((current + 1) / questions?.length) * 100;

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
    questions.forEach((question: string, index: number) => {
      usersAnswers[question] = answers[index] || "";
    });

    const response = await dispatch(
      submitFollowupAnswersThunk({
        sessionId: "1",
        userSymptoms: userSymptoms,
        user_response: usersAnswers,
      })
    );

    if (response.meta.requestStatus === "fulfilled") {
      const finalPromptResponse = await dispatch(
        generateFinalPromptThunk({
          sessionId: "1",
          userSymptoms: userSymptoms,
          formatted_response: userAdditionalFollowupAnswer,
        })
      ).unwrap();

      console.log("Generated final prompt:", finalPromptResponse?.final_prompt);

      socket.emit("start_diagnosis", {
        finalPrompt: finalPromptResponse?.final_prompt,
      });
      await dispatch(
        generateLLMAnswer({
          session_id: "1",
          finalPrompt: finalPromptResponse?.final_prompt,
        })
      );

      // navigate("/diagnosis-report");
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <div className="w-full max-w-3xl">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm font-medium text-green-700">
                {current + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white p-8 sm:p-10 mb-10 rounded-2xl shadow-sm">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6 w-full max-w-xs">
                <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold">
                  {current + 1}
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <h2 className="text-2xl text-gray-600 mb-6 leading-relaxed">
                {questions[current]}
              </h2>

              <input
                type="text"
                className="w-full p-5 rounded-2xl border border-gray-200 focus:border-green-600 focus:ring-1 focus:ring-green-500 outline-none transition-all duration-200 text-lg bg-gray-50 focus:bg-white placeholder-gray-400"
                value={answers[current] || ""}
                onChange={handleChange}
                placeholder="Type your answer here..."
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
              {/* Previous */}
              <button
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
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

              {/* Next or Complete */}
              {current < questions.length - 1 ? (
                <button
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition ${
                    !answers[current]?.trim()
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                  onClick={handleNext}
                  disabled={!answers[current]?.trim()}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition ${
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
            {questions.map((_: string, index: number) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-green-600 w-8"
                    : index < current
                    ? "bg-green-300 w-2"
                    : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FollowUpQuestions;
