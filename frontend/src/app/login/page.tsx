"use client";
import React, { useState } from "react";
import { Mail, ArrowRight, Sparkles } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "verify">("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 2000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      // Handle successful verification here
      console.log("OTP verified successfully:", otp);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Main content */}
      <div className="relative w-full max-w-md">
        {/* Logo/Brand area */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-2">Welcome</h1>
          <p className="text-gray-400 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login form */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 shadow-2xl">
          {step === "email" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-200 block"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !email}
                className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  Enter verification code
                </h3>
                <p className="text-gray-400 text-sm">
                  We&apos;ve sent a 6-digit OTP to{" "}
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="text-sm font-medium text-gray-200 block"
                  >
                    Verification code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 text-center text-xl tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>

              <div className="space-y-4">
                <button
                  onClick={() => setStep("email")}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  Use a different email address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            By continuing, you agree to our{" "}
            <button className="text-gray-400 hover:text-white underline transition-colors duration-200">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-gray-400 hover:text-white underline transition-colors duration-200">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
