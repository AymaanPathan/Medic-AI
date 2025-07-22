"use client";
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
    <div className="h-full">
      <div className=" max-w-4xl">
        {/* Question Card */}
        <div className="relative mb-8">
          <div className="relative p-8 lg:p-10">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                  {questions[current]}
                </h2>

                <textarea
                  className="w-full min-h-[160px] p-5 text-base rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm placeholder:text-slate-400 transition-all duration-200 resize-none shadow-sm"
                  value={answers[current] || ""}
                  onChange={handleChange}
                  placeholder="Please provide as much detail as possible..."
                  rows={6}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  className={`flex items-center gap-3 px-6 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                    current === 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md"
                  }`}
                  onClick={handlePrev}
                  disabled={current === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                {current < questions.length - 1 ? (
                  <button
                    className={`flex items-center gap-3 px-8 py-3 text-base font-semibold rounded-xl transition-all duration-200 transform ${
                      !answers[current]?.trim()
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r bg-gray-800 text-white hover:shadow-lg hover:shadow-blue-500/25"
                    }`}
                    onClick={handleNext}
                    disabled={!answers[current]?.trim()}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    className={`flex items-center gap-3 px-8 py-3 text-base font-semibold rounded-xl transition-all duration-200 transform ${
                      !answers[current]?.trim()
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/25"
                    }`}
                    onClick={onCompleteAssessment}
                    disabled={!answers[current]?.trim()}
                  >
                    <Check className="w-5 h-5" />
                    Complete Assessment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center items-center gap-3">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`rounded-full transition-all duration-500 ease-out ${
                index === current
                  ? "h-3 w-8 bg-gradient-to-r from-blue-500 to-indigo-500"
                  : index < current
                  ? "h-3 w-3 bg-blue-400"
                  : "h-3 w-3 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowUpQuestions;
