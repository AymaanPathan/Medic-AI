import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { RefreshCcw } from "lucide-react";

const DiagnosisResult: React.FC = () => {
  const diagnosis = useSelector((state: RootState) => state.chat.diagnosis);

  if (!diagnosis) return null; // Don't show if no diagnosis yet

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl p-6 text-white font-medium text-lg leading-relaxed transition-all duration-500 animate-fade-in">
          {diagnosis}
        </div>

        {/* Optional CTA or Button */}
        <div className="mt-6 flex justify-center">
          <button
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all duration-200"
            onClick={() => window.location.reload()} // or navigate to restart
          >
            <RefreshCcw className="w-4 h-4" />
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisResult;
