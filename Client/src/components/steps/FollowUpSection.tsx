import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RootDispatch, RootState } from "../../store";
import {
  generateFinalPromptThunk,
  generatefollowUpQuestion,
  generateLLMAnswer,
  submitFollowupAnswersThunk,
} from "../../store/slices/chatSlice";
import { socket } from "../../utils/socketSetup";

const FollowUpSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState<
    Record<string, string>
  >({});
  const dispatch: RootDispatch = useDispatch();
  const navigate = useNavigate();

  const finalPrompt = useSelector((state: RootState) => state.chat.finalPrompt);
  const diagnosis = useSelector((state: RootState) => state.chat.diagnosis);
  const user_info = useSelector((state: RootState) => state.chat.user_info);
  const userSymptoms = useSelector(
    (state: RootState) => state.chat.userSymptoms
  );
  const questions = useSelector(
    (state: RootState) => state.chat.followupQuestions
  );

  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    dispatch(
      generatefollowUpQuestion({
        sessionId: "1",
        user_info,
        userSymptoms,
      })
    );
  }, [dispatch, user_info, userSymptoms]);

  useEffect(() => {
    if (questions.length) {
      setAnswers(Array(questions.length).fill(""));
    }
  }, [questions]);

  useEffect(() => {
    socket.on("diagnosis_chunk", (data) => {
      console.log("Received diagnosis chunk:", data);
    });

    socket.on("diagnosis_done", (data) => {
      console.log("✅ Diagnosis complete:", data);
    });

    return () => {
      socket.off("diagnosis_chunk");
      socket.off("diagnosis_done");
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = [...answers];
    updated[current] = e.target.value;
    setAnswers(updated);

    setQuestionAnswers((prev) => ({
      ...prev,
      [questions[current]]: e.target.value,
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

  const progress = ((current + 1) / questions.length) * 100;

  const onCompleteAssessment = async () => {
    const response = await dispatch(
      submitFollowupAnswersThunk({
        sessionId: "1",
        user_response: questionAnswers,
      })
    ).unwrap();

    const formattedResponse = response.user_response;

    await dispatch(
      generateFinalPromptThunk({
        sessionId: "1",
        userSymptoms: userSymptoms,
        user_info,
        formatted_response: formattedResponse,
      })
    ).unwrap();

    await dispatch(
      generateLLMAnswer({
        session_id: "1",
        finalPrompt: finalPrompt,
      })
    ).unwrap();

    // navigate("/diagnosis");
  };
  const emit = () => {
    const res = socket.emit("start_diagnosis", {
      finalPrompt: finalPrompt,
    });
    if (res) {
      navigate("/diagnosis");
    }
  };
  console.log("finalPrompt", finalPrompt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-2">
            Follow-Up Questions
          </h1>
          <p className="text-slate-400 text-lg">
            Help us understand your situation better
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-300">Progress</span>
            <span className="text-sm font-medium text-purple-400">
              {current + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-slate-800/50 rounded-full h-2 backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-purple-500/30 transition-all duration-300">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {current + 1}
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
            </div>

            <h2 className="text-xl font-semibold text-white mb-6 leading-relaxed">
              {questions[current]}
            </h2>

            <div className="relative">
              <input
                type="text"
                className="w-full p-4 rounded-2xl text-gray-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-200 placeholder-slate-400 text-lg"
                value={answers[current] || ""}
                onChange={handleChange}
                placeholder="Type your answer here..."
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 pointer-events-none"></div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                current === 0
                  ? "bg-slate-800/50 text-slate-500"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/20 backdrop-blur-sm"
              }`}
              onClick={handlePrev}
              disabled={current === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button onClick={emit}>Emit</button>

            {current < questions.length - 1 ? (
              <button
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  !answers[current]
                    ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/25"
                }`}
                onClick={handleNext}
                disabled={!answers[current]}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  !answers[current]
                    ? "bg-slate-700/50 text-slate-400"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/25"
                }`}
                onClick={onCompleteAssessment}
                disabled={!answers[current]}
              >
                <Check className="w-4 h-4" />
                Next
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === current
                  ? "bg-purple-500 w-8"
                  : index < current
                  ? "bg-emerald-500"
                  : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FollowUpSection;
