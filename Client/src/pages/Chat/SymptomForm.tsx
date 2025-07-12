import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch } from "react-redux";
import {
  startdiagnosis,
  generatefollowUpQuestion,
} from "@/store/slices/diagnosis.slice";
import { Shield, Sparkles, Stethoscope } from "lucide-react";
import type { RootDispatch, RootState } from "@/store";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
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
    <div className="min-h-screen flex">
      <Navbar />

      <div className="hidden lg:flex w-2/5 flex-col justify-center items-start px-16 py-12 bg-white border-r border-emerald-100">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-semibold text-gray-900 leading-tight">
              AI-powered health
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                assessment
              </span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Describe your symptoms and get intelligent follow-up questions to
              better understand your condition.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-8">
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-full">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-700 font-medium">
                HIPAA Compliant
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">
                Available 24/7
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">AI-Powered</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-16 opacity-5">
          <Stethoscope className="w-32 h-32 text-emerald-600" />
        </div>
      </div>

      <div className="flex items-center justify-center px-8 py-12 flex-col w-full">
        <AnimatePresence>
          {userInfoCompleted && (
            <motion.div
              key="followup-section"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, x: 20 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <FollowUpQuestions />
            </motion.div>
          )}
        </AnimatePresence>

        {!userInfoCompleted && (
          <div className="bg-white p-8 relative overflow-hidden w-full max-w-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>

            <div className="space-y-6 relative z-10">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Tell us what's wrong
                </h3>
                <p className="text-gray-500">
                  The more details you provide, the better we can help
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Describe your symptoms in detail (e.g., chest pain when climbing stairs, started 2 days ago...)"
                    className="w-full h-48 p-5 text-base border border-emerald-200 rounded-2xl resize-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all duration-300 bg-emerald-50/30 focus:bg-white placeholder-gray-400 hover:border-emerald-300"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-md">
                    0/500
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg transform relative overflow-hidden ${
                    loading
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white hover:shadow-xl hover:-translate-y-0.5 shadow-emerald-600/25"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="flex items-center">
                        generating more questions
                        <span className="ml-1">
                          <span className="animate-bounce inline-block">.</span>
                          <span
                            className="animate-bounce inline-block"
                            style={{ animationDelay: "150ms" }}
                          >
                            .
                          </span>
                          <span
                            className="animate-bounce inline-block"
                            style={{ animationDelay: "300ms" }}
                          >
                            .
                          </span>
                        </span>
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="flex items-center justify-center">
                        Start Assessment
                        <div className="inline-block ml-2 transition-transform duration-200 group-hover:translate-x-1">
                          →
                        </div>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-emerald-100">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-emerald-700 font-medium">
                    Medical Information Protected
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  This tool is for informational purposes only and should not
                  replace professional medical advice. For emergencies, call
                  911.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomForm;
