import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startChat, generatefollowUpQuestion } from "@/store/slices/chatSlice";
import { HeartPulse, Stethoscope } from "lucide-react";
import type { RootDispatch } from "@/store";

const SymptomForm = () => {
  const [problem, setProblem] = useState("");
  const navigate = useNavigate();
  const dispatch: RootDispatch = useDispatch();

  const handleSubmit = async () => {
    if (!problem.trim()) return;

    dispatch(startChat({ sessionId: "1", userSymptoms: problem }));
    dispatch(
      generatefollowUpQuestion({ sessionId: "1", userSymptoms: problem })
    );

    navigate("/diagnosis");
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left: Brand & visuals */}
      <div className="hidden lg:flex w-2/5 flex-col justify-center items-start px-16 py-12 bg-white border-r border-gray-100">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <HeartPulse className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">MedicAI</h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-semibold text-gray-900 leading-tight">
              AI-powered health
              <br />
              assessment
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Describe your symptoms and get intelligent follow-up questions to
              better understand your condition.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-700 font-medium">
                HIPAA Compliant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 font-medium">
                Available 24/7
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-16 opacity-10">
          <Stethoscope className="w-24 h-24 text-gray-400" />
        </div>
      </div>

      {/* Right: Form UI */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="space-y-6">
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
                    className="w-full h-48 p-5 text-base border border-gray-200 rounded-2xl resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    0/500
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Assessment
                  <div className="inline-block ml-2">→</div>
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  This tool is for informational purposes only and should not
                  replace professional medical advice. For emergencies, call
                  911.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomForm;
