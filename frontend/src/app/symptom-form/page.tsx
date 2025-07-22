"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  startdiagnosis,
  generatefollowUpQuestion,
} from "@/store/slices/diagnosis.slice";
import { Shield, Sparkles, Lock, Loader2, ArrowRight } from "lucide-react";
import type { RootDispatch, RootState } from "@/store";
import { useSelector } from "react-redux";
import FollowUpQuestions from "./FollowupQuestions";

const SymptomForm = () => {
  const [problem, setProblem] = useState("");
  const [userInfoCompleted, setUserInfoCompleted] = useState(false);

  const dispatch: RootDispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.chat.loading);

  const handleSubmit = async () => {
    if (!problem.trim()) return;

    dispatch(startdiagnosis({ sessionId: "1", userSymptoms: problem }));
    const response = await dispatch(
      generatefollowUpQuestion({ sessionId: "1", userSymptoms: problem })
    );
    if (response.meta.requestStatus === "fulfilled") {
      setUserInfoCompleted(true);
    }
  };
  return (
    <div className="mt-10 mb-20">
      <div className="container mx-auto px-4 ">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center justify-center max-w-7xl mx-auto">
          {/* Left Side - Hero Content */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-sm font-medium text-emerald-700 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mr-3 animate-pulse"></div>
                AI-Powered Healthcare
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
                  Smart Health
                  <span className="block bg-gradient-to-r text-gray-800 bg-clip-text mt-2">
                    Assessment
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-xl font-light">
                  Get intelligent symptom analysis and personalized health
                  insights powered by advanced AI technology.
                </p>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-2 rounded-full bg-blue-50">
                  <Lock className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="p-2 rounded-full bg-purple-50">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span className="font-medium">AI-Powered Analysis</span>
              </div>
            </div>
          </div>

          {/* Right Side - Assessment Form */}
          <div className="relative">
            {userInfoCompleted ? (
              <div className="animate-in slide-in-from-right duration-700 ease-out">
                <FollowUpQuestions />
              </div>
            ) : (
              <div className="relative">
                <div className="relative p-8">
                  <div className="space-y-8">
                    <div className="text-center space-y-3">
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Describe Your Symptoms
                      </h2>
                      <p className="text-lg text-slate-600 font-light">
                        The more details you provide, the better we can assist
                        you
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="relative">
                        <textarea
                          value={problem}
                          onChange={(e) => setProblem(e.target.value)}
                          placeholder="Describe your symptoms in detail (e.g., chest pain when climbing stairs, started 2 days ago, feels like pressure...)"
                          className="w-full min-h-[200px] p-5 text-base rounded-2xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm placeholder:text-slate-400  transition-all duration-200 resize-none shadow-sm"
                          maxLength={500}
                        />
                        <div className="absolute bottom-4 right-5 text-sm text-slate-400 bg-white/90 px-3 py-1 rounded-full backdrop-blur-sm">
                          {problem.length}/500
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        disabled={loading || !problem.trim()}
                        className="w-full h-14 bg-gradient-to-r text-gray-800 font-semibold text-lg flex items-center justify-center"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Analyzing symptoms...
                          </>
                        ) : (
                          <>
                            Start Assessment
                            <ArrowRight className="ml-3 h-6 w-6" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomForm;
